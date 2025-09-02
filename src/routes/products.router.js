import express from "express";
import { ProductsController } from "../controllers/ProductsController.js";
const productsRouter = express.Router();

productsRouter.get('/', ProductsController.getProducts);
productsRouter.get('/:pid', ProductsController.getProductById);
productsRouter.post('/', ProductsController.addProduct);
productsRouter.put('/:pid', ProductsController.updateProductById);
productsRouter.delete('/:pid', ProductsController.deleteProduct);


export default productsRouter;