import {z} from 'zod';

export const domainCreateSchema = z.object({
    domain: z.string(),
    value: z.string(),
    description: z.string(),
    orderby: z.number().optional(),
    obs: z.string().optional(),
    self_id: z.number().optional()
});

export const domainUpdateSchema = z.object({
    id: z.number(),
    name: z.string().optional(),
    value: z.string().optional(),
    description: z.string().optional(),
    orderby: z.number().optional(),
    obs: z.string().optional(),
    self_id: z.number().optional()
});

export const domainUpdateStatusSchema = z.object({
    id: z.number(),
    status: z.string(),
});

export const domainFilterSchema = z.object({
    name: z.string().optional(),
    value: z.string().optional(),
    description: z.string().optional(),
    orderby: z.number().optional(),
    obs: z.string().optional(),
    self_id: z.number().optional(),
    status: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional()
})