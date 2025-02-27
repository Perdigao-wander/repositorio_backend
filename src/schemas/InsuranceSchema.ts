import { z } from "zod";

export const createInsuranceSchema = z.object({
    type: z.string(),
    content: z.record(z.any()) // Permite qualquer objeto JSON
        .refine((data) => Object.keys(data).length > 0, "O conteúdo não pode estar vazio"),
    value: z.number()
        .min(0, "O valor do seguro não pode ser negativo")
        .max(99999999.99, "O valor do seguro é muito alto"),
    start_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "A data de início deve estar no formato YYYY-MM-DD")
        .refine((date) => new Date(date).toString() !== "Invalid Date", "Data de início inválida")
        .optional(),
    end_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "A data de término deve estar no formato YYYY-MM-DD")
        .refine((date) => new Date(date).toString() !== "Invalid Date", "Data de término inválida")
        .refine((date, ctx) => new Date(date) > new Date(ctx.parent.start_date), {
            message: "A data de término deve ser posterior à data de início",
            path: ["end_date"],
        }).optional(),
    customer_uuid: z.string()
        .uuid("O UUID do cliente é inválido"),
});

export const updateStatusInsuranceSchema = z.object({
    id: z.string().uuid(),
    status: z.string(),
});

export const filterInsuranceSchema = z.object({
    searchTerm: z.string().optional(),
    user_uuid: z.string().uuid().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    customer_uuid: z.string().uuid().optional(),
})