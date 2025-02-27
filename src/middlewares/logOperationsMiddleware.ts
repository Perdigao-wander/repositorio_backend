import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source"; // Ajuste o caminho do seu DataSource
import { OperationLog } from "../entities/OperationLogs";

export const logOperationsMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = Date.now();
    const userId = req.cookies.user_id;
    const route = req.originalUrl;
    const method = req.method;
    const requestBody = { ...req.body };
    if (method === "GET" && route.startsWith("/fileResolve/")) {
        return next();
    }

    if (requestBody.password) {
        requestBody.password = "[PROTECTED]";
    }

    let responseBody: any;
    const originalSend = res.send;

    res.send = function (body) {
        responseBody = body;
        // @ts-ignore
        return originalSend.apply(this, arguments);
    };

    res.on("finish", async () => {
        const executionTime = Date.now() - start;

        try {
            const operation = `${method} ${route}`;
            const operationLogRepository = AppDataSource.getRepository(OperationLog);

            if (responseBody && typeof responseBody === "object") {
                if (responseBody.password) {
                    responseBody.password = "[PROTECTED]";
                }
                if (responseBody.token) {
                    responseBody.token = "[PROTECTED]";
                }
            }

            const log = operationLogRepository.create({
                user_id: userId,
                operation,
                route,
                method,
                request_body: requestBody,
                response_body: responseBody,
                created_at: new Date(),
            });

            await operationLogRepository.save(log);

            console.log(
                `[LOG]: ${operation} | Time: ${executionTime}ms | User: ${
                    userId || "Guest"
                }`
            );
        } catch (error) {
            console.error("Erro ao salvar log da operação:", error);
        }
    });

    next();
};
