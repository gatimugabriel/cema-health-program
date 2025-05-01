import { DB } from '../../infrastructure/database/data-source';
import { Token, User } from '../../domain/entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authConfig } from "../../application/config/authConfig";
import { encryptPayload, decryptPayload } from '../../shared/utils/encryption';
import { CreateUserDto, LoginUserDto, UserTokenDto } from '../dtos/UserDto';

export class AuthService {
    private userRepository = DB.getRepository(User);
    private tokenRepository = DB.getRepository(Token)
    private readonly accessTokenSecret = authConfig.jwt.accessTokenSecret as string
    private readonly refreshTokenSecret = authConfig.jwt.refreshTokenSecret as string

    async register(userData: CreateUserDto): Promise<User> {    
        userData.password = bcrypt.hashSync(userData.password, 10);
        userData.email = userData.email.toLowerCase();

        const user = new User();
        Object.assign(user, userData);
        return await this.userRepository.save(user);
    }

    //  @ authenticateUser
    //  Generates JWT tokens
    async login(loginData: LoginUserDto): Promise<{ user: Omit<User, 'password' | 'tokens'>, tokens:{accessToken: string, refreshToken: string }}> {
        const user = await this.userRepository.findOne({
            where: {email: (loginData.email).toLowerCase()}
        });
        
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = bcrypt.compareSync(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const {accessToken, refreshToken} = this.generateAuthTokens(user.id, user.role, user.email)

        // --- save refresh token to DB ---//
        const tokenData: UserTokenDto = {
            userID: user.id,
            token: refreshToken,
            type: "refresh"
        }

        const token = new Token();
        Object.assign(token, tokenData);
        await this.tokenRepository.save(token);

        return {user: this.createSafeUserResponse(user), tokens: {accessToken, refreshToken}};
    }
    private createSafeUserResponse(user: User): Omit<User, 'password' | 'tokens'> {
        const { password, tokens, ...safeUser } = user;
        return safeUser;
    }
    // Generates a JWT token
    private generateToken(payload: any, secretKey: string, expiresIn: string): string {
        const encryptedPayload = encryptPayload(payload)
        return jwt.sign({ data: encryptedPayload }, secretKey, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
    }

    validateToken(tokenString: string, tokenType: string): any {
        let secret: string;

        switch (tokenType) {
            case "ACCESS":
                secret = this.accessTokenSecret
                break;
            case "REFRESH":
                secret = this.refreshTokenSecret;
                break;
            default:
                throw new Error('Invalid token type');
        }

        try {
            const token = jwt.verify(tokenString, secret) as jwt.JwtPayload;
            const encryptedPayload = token.data as string;
            return decryptPayload(encryptedPayload);
        } catch (err) {
            console.log(err)
            return err
        }
    }

    // Generates auth tokens
    generateAuthTokens(userID: number | string, userRole: string, email = ""): { accessToken: string; refreshToken: string } {
        const userPayload = { userID, userRole, email };
        if (!authConfig.jwt.accessTokenSecret || !authConfig.jwt.refreshTokenSecret) {
            throw new Error('JWT secrets are not provided');
        }

        const accessToken = this.generateToken(userPayload, this.accessTokenSecret, "1d");
        const refreshToken = this.generateToken(userPayload, this.accessTokenSecret, "7d");

        return { accessToken, refreshToken };
    }
} 