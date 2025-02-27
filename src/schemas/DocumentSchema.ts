import { z } from "zod";


// Document Schema
export const documentSchema = z.object({
    name: z.string(),
    data: z.instanceof(Buffer),
    size: z
        .number()
        .max(1024 * 1024 * 5, "Arquivo muito grande (máx. 5MB)"),
    encoding: z.string(),
    mimetype: z
        .string()
        .regex(
            /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain)$/,
            "Tipo de arquivo inválido! Por favor, envie um documento nos formatos PDF, DOC, DOCX ou TXT."
        ),
    truncated: z.boolean(),
    md5: z.string(),
    mv: z
        .function()
        .args(z.string().optional())
        .returns(z.promise(z.void())),
});

// Image Schema
export const imageSchema = z.object({
    name: z.string(),
    data: z.instanceof(Buffer),
    size: z.number().max(1024 * 1024 * 1, "Arquivo muito grande (máx. 1MB)"),
    encoding: z.string(),
    mimetype: z.string().regex(/^image\/(png|jpeg|jpg)$/, "Tipo de arquivo invalido!\n Por favor selecione uma foto do tipo (png|jpeg|jpg|)"),
    truncated: z.boolean(),
    md5: z.string(),
    mv: z.function().args(z.string().optional()).returns(z.promise(z.void())),
});