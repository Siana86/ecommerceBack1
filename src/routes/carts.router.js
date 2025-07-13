import express from "express";
import CartManager from "../cartManager.js";
import Cart from "../models/cart.model.js";


const cartRouter = express.Router();
const cartManager = new CartManager("./src/cars.json");

cartRouter.post("/", async (req, res) => {
    try {
        const cart = new Cart();
        await cart.save();
        res.status(201).json({ status: "succes", payload: cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouter.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await Cart.findById(cid).populate("products.product");
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { product: pid, quantity } } }, { new: true });
        if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.status(201).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});







// //POST: Add cart
// cartsRouter.post("/api/carts", async (req, res) => {
//     try {
//         const newCart = req.body;
//         const carts = await cartManager.addCart(newCart);
//         res.status(201).json({ status: "success", carts });
//     } catch (error) {
//         res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
//     }
// });


// //GET: getCartById
// cartsRouter.get("/api/carts/:cid", async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const cart = await cartManager.getCartById(cartId);
//         res.status(200).json({ status: "success", cart });
//     } catch (error) {
//         res.status(500).json({ status: "error" }) //TO DO: mejorar respuesta del error 
//     }
// });


// //POST: addProductToCart
// cartsRouter.post("/api/carts/:cid/product/:pid", async (req, res) => {
//     try {
//         const { cid, pid } = req.params;

//         const updatedCart = await cartManager.addProductToCart(cid, pid);

//         return res.status(200).json({ status: "success", cart: updatedCart });
//     } catch (error) {
//         return res.status(500).json({ status: "error", message: error.message }); //TO DO: mejorar respuesta del error
//     }
// });


export default cartRouter;