import {ViewsController} from "../controllers/ViewsController";
import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware";

const ViewRoutes = Router();
const viewsController = new ViewsController();

/*// @ts-ignore
ViewRoutes.get('/api/insure_flow/views/getBraceletParticipant', authMiddleware, viewsController.getBraceletParticipant);
// @ts-ignore
ViewRoutes.get('/api/insure_flow/views/getBraceletEvent', authMiddleware, viewsController.getBraceletEvent);*/

export default ViewRoutes;


