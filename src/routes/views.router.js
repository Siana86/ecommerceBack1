import express from "express";
import { auth } from "../middleware/auth.js";
import { ViewsController } from "../controllers/ViewsController.js";



const viewsRouter = express.Router();

viewsRouter.get('/', ViewsController.getHome);
viewsRouter.get('/realtimeproducts',ViewsController.getRealTimeProducts);
viewsRouter.get('/registro', ViewsController.getRegistro);
viewsRouter.get('/login', ViewsController.getLogin);
viewsRouter.get('/perfil', auth, ViewsController.getPerfil);


export default viewsRouter;

