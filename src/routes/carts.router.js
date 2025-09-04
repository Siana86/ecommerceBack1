import express from "express";
import { CartsController } from "../controllers/CartsController.js";
import { auth, authorization } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post('/', CartsController.addCart);
cartRouter.get('/:cid', CartsController.getCartById);
cartRouter.post('/:cid/product/:pid',auth, authorization(["users"]), CartsController.addProductToCart);
cartRouter.delete('/:cid', CartsController.deleteProducts);


export default cartRouter;