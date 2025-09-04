import express from "express";
import { ProductsController } from "../controllers/ProductsController.js";
import { auth, authorization } from "../middleware/auth.js";

const productsRouter = express.Router();

productsRouter.get('/', ProductsController.getProducts);
productsRouter.get('/:pid', ProductsController.getProductById);
productsRouter.post('/', authorization(["admin"]), ProductsController.addProduct);
productsRouter.put('/:pid', auth, authorization(["admin"]), ProductsController.updateProductById);
productsRouter.delete('/:pid',auth, authorization(["admin"]), ProductsController.deleteProduct);


export default productsRouter;