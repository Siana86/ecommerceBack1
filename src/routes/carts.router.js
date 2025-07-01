import express from "express";
import CartManager from "../cartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/cars.json");

//POST: Add cart
cartsRouter.post("/api/carts", async (req, res) => {
    try {
        const newCart = req.body;
        const carts = await cartManager.addCart(newCart);
        res.status(201).json({ status: "success", carts });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});


//GET: getCartById
cartsRouter.get("/api/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.status(200).json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error" }) //TO DO: mejorar respuesta del error 
    }
});


//POST: addProductToCart
cartsRouter.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const updatedCart = await cartManager.addProductToCart(cid, pid);

        return res.status(200).json({ status: "success", cart: updatedCart });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message }); //TO DO: mejorar respuesta del error
    }
});


export default cartsRouter;