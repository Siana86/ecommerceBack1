import express from "express";
import ProductManager from "../ProductManager.js";
import { Server } from "socket.io";


const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

productsRouter.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            price,
            thumbnail,
            code,
            stock,
            status,
        } = req.body;

        if (!title || !description || !category || !price || !thumbnail || !code || !stock || !status) {
            return res.status(400).json({
                status: "error",
                message: "Faltan campos obligatorios",
            });
        }

        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        //res.status(201).json({ status: "success", products });
        res.redirect("/realTimeProducts");
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

export default productsRouter;