import {Request, Response} from "express";
import domainRepository from "../repositories/DomainRepository";
import {BadRequestError} from "../helpers/api-error";
import {Like, Raw} from "typeorm";

export class DomainController {
    async create(req: Request, res: Response) {

        const {
            domain,
            value,
            description,
            orderby,
            obs,
            self_id
        } = req.body;

        const authUuid = req.userAuth.id;

        const domainFind = await domainRepository.findOneBy({domain,value,description});

        if (domainFind) {
            throw new BadRequestError("O dominio já existe!")
        }

        const domainCreate = domainRepository.create({
            domain,
            description,
            value,
            orderby,
            obs,
            self_id,
            user_uuid: authUuid
        });

        await domainRepository.save(domainCreate);

        return res.json({
            result: true,
            message: "Dominio criado com sucesso!",
            data: domainCreate
        })
    }

    async update(req: Request, res: Response) {
        const { id, domain, value, description, orderby, obs, self_id } = req.body;

        const domainFind = await domainRepository.findOneBy({id});

        if (!domainFind) {
            throw new BadRequestError("Dominio não encontrado.")
        }

        domainFind.domain = domain || domainFind.domain;
        domainFind.value = value || domainFind.value;
        domainFind.description = description || domainFind.description;
        domainFind.orderby = orderby || domainFind.orderby;
        domainFind.obs = obs || domainFind.obs;
        domainFind.self_id = self_id || domainFind.self_id;
        domainFind.user_update_uuid = req.userAuth.id as string;
        domainFind.updated_at = new Date();

        await domainRepository.save(domainFind);

        res.json({
            result: true,
            message: "Dominio atualizado com sucesso!",
            data: domainFind
        })
    }

    async updateStatus (req:Request, res: Response) {
        const { id, status } = req.body;

        const domainFind = await domainRepository.findOneBy({id});

        if (!domainFind) {
            throw new BadRequestError("Dominio não encontrado!")
        }

        domainFind.status = Number(status);
        domainFind.updated_at = new Date();
        domainFind.user_update_uuid = req.userAuth.id as string;

        await domainRepository.save(domainFind);

        return res.json({
            result: true,
            message: "Status do tipo de documento alterado com sucesso!",
            data: domainFind
        })
    }

    async filter (req: Request, res: Response) {
        const {
            domain,
            value,
            description,
            orderby,
            obs,
            self_id,
            status,
            page = 1,
            limit = 10
        } = req.body;

        const whereConditions = {
            ...(domain? {domain:Like(`%${domain}%`)}: {}),
            ...(value? {value: Like(`%${value}%`)}: {}),
            ...(description? {description: Like(`%${description}%`)}: {}),
            ...(orderby? {orderby}: {}),
            ...(obs? {obs:Like(`%${obs}%`)}: {}),
            ...(self_id? {self_id}: {}),
            ...(status? {status}: {})
        };

        const offset = (page - 1) * limit;

        const [domains, total] = await domainRepository.findAndCount({
            where: whereConditions,
            order: {
                domain: 'asc'
            },
            take: limit,
            skip: offset
        });

        return res.json({
            result: true,
            message: "Sucesso!",
            data: domains,
            pagination: {
                total, // Total de registros
                page: Number(page), // Página atual
                limit: Number(limit), // Registros por página
                totalPages: Math.ceil(total / limit) // Total de páginas
            }

        })
    }
}