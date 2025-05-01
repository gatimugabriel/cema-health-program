import {NextFunction, Response} from "express";
import { AuthService } from "../../application/services/AuthService";
import { ExtendedRequest } from "../../types";

const authService = new AuthService()

export const authenticate = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.header('Authorization') || req.headers['authorization']
    const token = req.cookies["accessToken"] || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
             res.status(401).json({
                success: false,
                message: `Unauthorized. Missing access token`,
            });
            return
    }

    const decoded = authService.validateToken(token, 'ACCESS')
    if (!decoded) {
        res.status(401).json({
            success: false,
            message: `Invalid access Token`,
        });
        return;
    }

    req.user = decoded;
    next();
}

export const validateRefreshToken = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies["refreshToken"] || req.body.refreshToken;
    if (!token) {
        res.status(401).json({
            success: false,
            message: `Missing refresh Token`,
        });
        return;
    }

    const decoded = authService.validateToken(token, "REFRESH");
    if (!decoded) {
        res.status(401).json({
            success: false,
            message: `Invalid refresh Token`,
        });
        return;
    }

    req.user = decoded;
    next();
}







