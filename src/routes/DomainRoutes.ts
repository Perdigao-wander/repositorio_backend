import {DomainController} from "../controllers/DomainController";
import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";
import {zodValidate} from "../middlewares/zodMiddleware";
import {
    domainCreateSchema,
    domainFilterSchema,
    domainUpdateSchema,
    domainUpdateStatusSchema
} from "../schemas/DomainSchema";

const typeDocumentController = new DomainController();
const DomainRoutes = Router();

// @ts-ignore
DomainRoutes.post("/api/insure_flow/event/domain/create",authMiddleware,zodValidate(domainCreateSchema),typeDocumentController.create);
// @ts-ignore
DomainRoutes.post("/api/insure_flow/event/domain/update",authMiddleware,zodValidate(domainUpdateSchema),typeDocumentController.update);
// @ts-ignore
DomainRoutes.post("/api/insure_flow/event/domain/updateStatus",authMiddleware,zodValidate(domainUpdateStatusSchema) ,typeDocumentController.updateStatus);
// @ts-ignore
DomainRoutes.post("/api/insure_flow/event/domain/filter",authMiddleware,zodValidate(domainFilterSchema),typeDocumentController.filter);

export default DomainRoutes;