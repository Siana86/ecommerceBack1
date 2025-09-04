import express from "express";
import { auth, authorization } from "../middleware/auth.js";
import { ViewsController} from "../controllers/ViewsController.js";


const viewsRouter = express.Router();

viewsRouter.get('/', auth, authorization(["public", "user", "admin"]), ViewsController.getHome);
viewsRouter.get('/realtimeproducts',auth, authorization(["admin"]), ViewsController.getRealTimeProducts);
viewsRouter.get('/registro',auth, authorization(["public"]), ViewsController.getRegistro);
viewsRouter.get('/login', ViewsController.getLogin);
viewsRouter.get('/perfil', auth, ViewsController.getPerfil);


export default viewsRouter;

