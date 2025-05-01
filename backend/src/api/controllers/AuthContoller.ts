import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000
};

const REFRESH_COOKIE_OPTIONS = {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.authService.register(req.body);
            const tokens = await this.authService.generateAuthTokens(user.id, user.role)

            //set http-only cookies
            res.cookie("accessToken", tokens.refreshToken, COOKIE_OPTIONS)
            res.cookie("refreshToken", tokens.accessToken, REFRESH_COOKIE_OPTIONS)

            res.status(201).json({ user, tokens });
        } catch (error: any) {
            next(error);
        }
    }

    public async signin(req: Request, res: Response): Promise<void> {
        try {
            const { user, tokens } = await this.authService.login(req.body);

            //set http-only cookies
            res.cookie("accessToken", tokens.refreshToken, COOKIE_OPTIONS)
            res.cookie("refreshToken", tokens.accessToken, REFRESH_COOKIE_OPTIONS)

            res.status(200).json({ user, tokens });
        } catch (error: any) {
            throw new Error(error)
        }
    }
}
