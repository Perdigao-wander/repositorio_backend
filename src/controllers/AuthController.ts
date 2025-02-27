import {Request, Response} from "express";
import userRepository from "../repositories/UserRepository";
import {BadRequestError} from "../helpers/api-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sessionRepository from "../repositories/SessionRepository";
import {addDays, set} from "date-fns";
import {MoreThan} from "typeorm";

const jwtAccessSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string;
const jwtAccessExpiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION as string;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string;
const jwtRefreshExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION as string;

export class AuthController {
    async login(req: Request, res: Response){
        const {email, password} = req.body;

        const user = await userRepository.findOne({
            where: {
                email,
                status: 1
            }
        });

        if (!user) {
            throw new BadRequestError("Email ou senha incorretos!");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new BadRequestError("Email ou senha incorretos!");
        }


        const accessToken = jwt.sign({uuid: user.id}, jwtAccessSecretKey, {
            subject: user.id,
            expiresIn: jwtAccessExpiration
        });

        const refreshToken = jwt.sign({uuid: user.id}, jwtRefreshSecretKey, {
            subject: user.id,
            expiresIn: jwtRefreshExpiration
        });

        const session = sessionRepository.create({
            session_user_uuid: user.id,
            session_refresh_token: refreshToken,
            session_expires_at: addDays(new Date(), 15)
        });

        await sessionRepository.save(session);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 24 * 60 * 60 * 1000 // 15 dias
        });

        res.cookie('user_id', user.id, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 24 * 60 * 60 * 1000 // 15 dias
        });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.json({
            result: true,
            message: "Login realizado com sucesso!"
        });
    }

    async getProfile(req: Request, res: Response) {

        const user = await userRepository
            .createQueryBuilder('user')
            .leftJoin('user_menu', 'user_menu', 'user_menu.user_owner_uuid = user.id')
            .leftJoin('menu', 'menu', 'user_menu.menu_uuid = menu.id')
            .leftJoin('document', 'document', 'document.id = user.photo_id')
            .select([
                'user.id AS id',
                'user.name AS name',
                'user.username AS username',
                'user.email AS email',
                'user.phone AS phone',
                'document.id AS documentId',
                'document.file_path AS filePath',
                'document.file_name AS fileName',
                "jsonb_agg(jsonb_build_object('id', menu.id, 'name', menu.name, 'icon', menu.icon, 'url', menu.link)) AS access",
            ])
            .where('user.id = :id', { id: req.userAuth.id })
            .groupBy('user.id, document.id')
            .getRawOne();

        return res.json({
            result: true,
            message: "Profile retornado com sucesso!",
            data: user
        });
    }

    async logout(req: Request, res: Response){

        const refreshToken = req.cookies.refresh_token;

        const session = await sessionRepository.findOne({
            where: {
                session_user_uuid: req.userAuth.id,
                session_expires_at: MoreThan(new Date()),
                session_refresh_token: refreshToken
            }
        });

        if (session) {

            session.session_expires_at = set(new Date(), {
                year: 1998,
                month: 6, // Julho (os meses começam em 0, então 6 = Julho)
                date: 30,
            });

            await sessionRepository.save(session);

            res.clearCookie('refresh_token');
            res.clearCookie('access_token');

            return res.json({
                result: true,
                message: "Logout realizado com sucesso!"
            });
        }
    }

    async updatePassword(req: Request, res: Response) {
        const {currentPassword, newPassword} = req.body;

        const {id} = req.userAuth;

        const user = await userRepository.findOneBy({id});

        if (!user) {
            throw new BadRequestError("Não Autoridado!");
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            throw new BadRequestError("Senha atual incorreta!");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await userRepository.save(user);

        return res.json({
            result: true,
            message: "Senha alterada com sucesso!"
        });
    }
}