import {z} from "zod";

export const authLoginSchema = z.object({
    email: z.string().email("Insira um email valido!"),
    password: z.string().min(8, "Sua senha precisa ter pelo menos 8 caracteres!"),
});

export const authChangePwaSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, "Sua senha nova precisa ter pelo menos 8 caracteres!").regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Sua senha nova precisa conter pelo menos um caractere especial!"
    ),
});