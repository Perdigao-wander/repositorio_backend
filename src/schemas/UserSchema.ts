import {z} from "zod";

export const userCreateSchema = z.object({
    name: z.string().min(3).max(100),
    surname: z.string().min(3).max(100),
    email: z.string().email('Email Invalido!'),
    phone: z.string().optional(),
    password: z.string().max(100).default('1234'),
    username: z.string().min(4, "Username muito pequeno, pelo menos 4 caracteres").max(50).optional(),
    pin: z.string().nullable().optional(),
});

export const userUpdateSchema = z.object({
    id: z.string().uuid("uuid invalido!"),
    name: z.string().min(3).max(100).optional(),
    surname: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().nullable().optional(),
    username: z.string().min(3).max(50).optional(),
    pin: z.string().nullable().optional(),
});

export const userStatusUpdateSchema = z.object({
    id: z.string().uuid("uuid invalido!"),
    status: z.string()
});

export const userFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    surname: z.string().optional(),
    orderby: z.number().optional(),
    phone: z.string().optional(),
    status: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional()
})