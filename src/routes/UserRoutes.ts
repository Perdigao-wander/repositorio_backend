import {Router} from "express";
import {UserController} from "../controllers/UserController";
import {authMiddleware} from "../middlewares/authMiddleware";
import {zodValidate} from "../middlewares/zodMiddleware";
import {userCreateSchema, userFilterSchema, userStatusUpdateSchema, userUpdateSchema} from "../schemas/UserSchema";
import {domainFilterSchema} from "../schemas/DomainSchema";


const userController = new UserController();
const UserRoutes = Router();

// @ts-ignore
UserRoutes.post("/api/insure_flow/user/createUpdate",authMiddleware,zodValidate(userCreateSchema),userController.createOrUpdate);
// @ts-ignore
UserRoutes.post("/api/insure_flow/user/statusUpdate",authMiddleware,zodValidate(userStatusUpdateSchema),userController.statusUpdate);
// @ts-ignore
UserRoutes.post("/api/insure_flow/user/filter",authMiddleware, zodValidate(userFilterSchema),userController.filter);
// @ts-ignore
UserRoutes.post("/api/insure_flow/user/menu/load",authMiddleware, userController.menuLoad);

export default UserRoutes;