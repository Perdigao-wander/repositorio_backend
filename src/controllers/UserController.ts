import {Request, Response} from "express";
import userRepository from "../repositories/UserRepository";
import {BadRequestError} from "../helpers/api-error";
import bcrypt from "bcrypt";
import uploadFile from "../utils/lib";
import documentRepository from "../repositories/DocumentRepository";
import menuRepository from "../repositories/MenuRepository";
import menuUserRepository from "../repositories/MenuUserRepository";
import {Brackets} from "typeorm";

export class UserController {
    async createOrUpdate(req: Request, res: Response) {
        const authUuid = req.userAuth.id;
        const data = JSON.parse(req.body.data);
        let docSave;
        let message =" Utilizador registrado com sucesso";
        let menu_user_id;
        // @ts-ignore
        const file = req.files;

        if (file) {
            const fileUpload = await uploadFile(file.attaches, "user/", "src/storage/data/user/");
            const upRes = fileUpload.arrayRes[0];

            const document = documentRepository.create({
                file_path: upRes.fileReference,
                file_name: upRes.fileName,
                file_size: upRes.fileSize,
                minetype: upRes.mimeType,
                description: 'Foto de perfil de utilizador',
                user_uuid: authUuid
            });

            docSave = await documentRepository.save(document);
        }

        if (data.type === 2) {

            const existingUser = await userRepository.findOneBy({
                id: data.id
            });
            if (existingUser) {
                existingUser.name = data.name;
                existingUser.email = data.email;
                existingUser.surname = data.surname;
                existingUser.username = data.username;
                existingUser.photo_id = docSave?.id || existingUser.photo_id;
                existingUser.phone = data.phone;

                await userRepository.save(existingUser);

                menu_user_id = existingUser.id

                await menuUserRepository
                    .createQueryBuilder()
                    .update('user_menu')
                    .set({ status: 0 })
                    .where('user_owner_uuid = :userOwnerUuid', { userOwnerUuid:menu_user_id })
                    .execute();

                message = "Utilizador atualizado com sucesso!"
            }

        }else {
            const existingUser = await userRepository.findOneBy({
                email: data.email
            });

            if (existingUser) {
                throw new BadRequestError("Email já está em uso em outro utilizador!");
            }
            let hashPwa = await bcrypt.hash('NiconDefault@1234', 10);

            const newUser = userRepository.create({
                name: data.name,
                email: data.email,
                surname: data.surname,
                username: data.username,
                photo_id: docSave?.id,
                phone: data.phone,
                user_uuid: authUuid,
                password: hashPwa
            });

            await userRepository.save(newUser);

            const {password: _, ...user} = newUser;
            menu_user_id = user.id;
        }


        let menuData = data.menu;

        for (const menu of menuData) {
            const menuInsert = {
                user_owner_uuid: menu_user_id,
                menu_uuid: menu,
                status: 1,
                user_uuid: authUuid,
            }

            const menuCreate = menuUserRepository.create(menuInsert);
            await menuUserRepository.save(menuCreate);
        }

        return res.status(201).json({
            result: true,
            message
        });
    }

    async statusUpdate(req: Request, res: Response) {
        const { id, status } = req.body;

        const userFind = await userRepository.findOneBy({id});

        if (!userFind) {
            throw new BadRequestError('Utilizador não encontrado!')
        }

        userFind.status = Number(status);
        userFind.updated_at = new Date();
        userFind.user_update_uuid = req.userAuth.id as string;

        await userRepository.save(userFind)

        const {password: _,...user} = userFind;

        return res.json({
            result: true,
            message: "Status do utilizador alterado com sucesso!",
            data: {user}
        })
    }

    async filter(req: Request, res: Response) {
        const {
            searchTerm,
            status,
            user_uuid,
            page = 1,
            limit = 10,
        } = req.body;

        const offset = (page - 1) * limit;

        const excludedIds = ['f1684f47-25fb-4aff-9cc6-d4de8de01cdf', req.userAuth.id]; // Lista de IDs a serem excluídos
        const query = userRepository
            .createQueryBuilder('user')
            .leftJoin('user_menu', 'user_menu', 'user_menu.user_owner_uuid = user.id')
            .leftJoin('menu', 'menu', 'user_menu.menu_uuid = menu.id')
            .leftJoin('document', 'document', 'document.id = user.photo_id')
            .select([
                'user.id AS id',
                'user.name AS name',
                'user.username AS username',
                'user.surname AS surname',
                'user.email AS email',
                'user.phone AS phone',
                'user.status AS status',
                'document.id AS documentId',
                'document.file_path AS filePath',
                'document.file_name AS fileName',
                "jsonb_agg(jsonb_build_object('id', menu.id, 'name', menu.name, 'icon', menu.icon, 'url', menu.link)) AS access",
            ])
            .groupBy('user.id, document.id')
            .where('user.id NOT IN (:...excludedIds)', { excludedIds })
            .andWhere("user_menu.status = 1")


        if (status) {
            let stat = Number(status)
            query.andWhere('user.status = :stat', { stat });
        }

        if (user_uuid) {
            query.andWhere('user.user_uuid = :user_uuid', { user_uuid });
        }

        if (searchTerm) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where('user.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
                        .orWhere('user.surname ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
                        .orWhere('user.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
                        .orWhere('user.phone ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
                })
            );
        }

        query.orderBy('user.name', 'ASC').skip(offset).take(limit);

        const users = await query.getRawMany();
        const total = await query.getCount();

        return res.json({
            result: true,
            message: 'Sucesso!',
            data: users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    }

    async menuLoad(req: Request, res: Response){
        const menuData = await menuRepository.find(
            {
                where: {
                    status: 1
                }
            }
        );

        return res.status(200).json({
            result: true,
            menuData
        })
    }
}