import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { MoreThan } from 'typeorm';
import {UnauthorizedError} from "../helpers/api-error";
import sessionRepository from "../repositories/SessionRepository";

const jwtAccessSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
const jwtAccessExpiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION as string;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string;

type JwtPlayload = {
    uuid: string;
    exp:number;
    iat: number;
}

const generateNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;
    const accessToken = req.cookies.access_token;
    const { authUuid } = req.body;


    const verify = jwt.verify(refreshToken, jwtRefreshSecretKey) as JwtPlayload;
    if (!verify) {
        throw new UnauthorizedError('Refresh token invalid or expired')
    }

    const session = await sessionRepository.findOneBy({
        session_user_uuid: authUuid,
        session_refresh_token: refreshToken,
        session_expires_at: MoreThan(new Date())
    });

    if (!session) {
        throw new UnauthorizedError('Refresh token invalid or expired');
    }

    try {
        if (accessToken && jwt.verify(accessToken, jwtAccessSecretKey)) {

            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            return res.json({
                result: true,
                message: "Access token is still valid"
            });
        }
    } catch (error) {

        console.log("Access token verification failed:", error);
    }

    const newAccessToken = jwt.sign({uuid: session.session_user_uuid}, jwtAccessSecretKey, {
        subject: session.session_user_uuid,
        expiresIn: jwtAccessExpiration
    });

    res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    return res.json({
        result: true,
        message: "New access token generated",
        newAccessToken
    });
}

export {generateNewAccessToken};