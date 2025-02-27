import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import {documentSchema, imageSchema} from "../schemas/DocumentSchema";

export const zodValidate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                // Valida o arquivo enviado (se houver)
                // @ts-ignore
                const file = req.files?.attaches;
                if (file) {
                    const validTypesImages = ['image/png', 'image/jpeg', 'image/jpg', 'image/x-icon','image/vnd.microsoft.icon'];
                    const validTypesDocument = [
                        'application/pdf',            // PDF files
                        'application/msword',         // Microsoft Word (.doc)
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Microsoft Word (.docx)
                        'application/vnd.ms-excel',   // Microsoft Excel (.xls)
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Microsoft Excel (.xlsx)
                        'application/vnd.ms-powerpoint', // Microsoft PowerPoint (.ppt)
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // Microsoft PowerPoint (.pptx)
                        'text/plain',                 // Text files (.txt)
                        'application/rtf',            // Rich Text Format (.rtf)
                        'application/zip',            // Zip files
                        'application/x-rar-compressed', // RAR files
                        'application/json',           // JSON files
                    ];

                    if (validTypesImages.includes(file.type)) {
                        imageSchema.parse(file);
                    }

                    if (validTypesDocument.includes(file.type)) {
                        documentSchema.parse(file);
                    }
                }

                // Valida os dados enviados no corpo da requisição
                if (req.body?.data) {
                    let data = JSON.parse(req.body.data);
                    schema.parse(data);
                }else schema.parse(req.body);


                next(); // Passa para o próximo middleware ou controlador
            } catch (error) {
                if (error instanceof z.ZodError) {
                    // Formata os erros de validação
                    return res.status(400).json({
                        result: false,
                        typeError: 3,
                        message: "Validation Error",
                        errors: error.errors.map((err) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    });
                }
                next(error); // Passa para o middleware de erro padrão
            }
        };
