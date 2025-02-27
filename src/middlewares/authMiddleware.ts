import {NextFunction, Request, Response} from "express";
import {UnauthorizedError} from "../helpers/api-error";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/UserRepository";
import sessionRepository from "../repositories/SessionRepository";
import {MoreThan} from "typeorm";

type JwtPlayload = {
    uuid: string;
}

const jwtAccessSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string;


export const authMiddleware = async(req:Request, res:Response,next:NextFunction) =>{
    const refreshToken = req.cookies.refresh_token;
    const accessToken = req.cookies.access_token;

    if (!accessToken && !refreshToken){
        throw new UnauthorizedError('Access or Refresh token missing');
    }

    const token = accessToken? accessToken : refreshToken;
    const secret = accessToken ? jwtAccessSecretKey: jwtRefreshSecretKey;

    const { uuid } = jwt.verify(token, secret) as JwtPlayload;

    const session = await sessionRepository.findOne({
        where: {
            session_user_uuid: uuid,
            session_refresh_token: refreshToken,
            session_expires_at: MoreThan(new Date())
        }
    });
    if (!session) {
        throw new UnauthorizedError("Não autorizado!");
    }

    const user = await userRepository.findOneBy({ id:uuid });
    if (!user) {
        throw new UnauthorizedError("Não autorizado!");
    }

    const {password:_,...userLogin} = user;

    req.userAuth = userLogin;

    next();
}