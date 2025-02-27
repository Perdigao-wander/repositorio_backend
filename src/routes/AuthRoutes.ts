import {Router} from "express";
import {AuthController} from "../controllers/AuthController";
import {authMiddleware} from "../middlewares/authMiddleware";
import {zodValidate} from "../middlewares/zodMiddleware";
import {authChangePwaSchema, authLoginSchema} from "../schemas/AuthSchema";
import {generateNewAccessToken} from "../utils/GenerateNewAccessToken";

const authController = new AuthController();
const AuthRoutes = Router();

// @ts-ignore
AuthRoutes.post("/api/insure_flow/auth/login", zodValidate(authLoginSchema), authController.login);
// @ts-ignore
AuthRoutes.get("/api/insure_flow/auth/logout",authMiddleware,authController.logout);
// @ts-ignore
AuthRoutes.get("/api/insure_flow/auth/profile",authMiddleware,authController.getProfile);
// @ts-ignore
AuthRoutes.post("/api/insure_flow/auth/updatepwa",authMiddleware,zodValidate(authChangePwaSchema),authController.updatePassword);
// @ts-ignore
AuthRoutes.post('/api/insure_flow/auth/refresh-token', generateNewAccessToken);

export default  AuthRoutes;