import express from "express";
import ProductManager from "../ProductManager.js";
import { Server } from "socket.io";


const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

//Add product
productsRouter.post("/", async (req, res) => {
    try {
        const products = await productManager.addProduct(req.body);
        const lastProduct = products[products.length - 1];
        res.status(201).json({ status: "success", lastProduct });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//GET: Get products
productsRouter.get("/", (req, res) => {

    res.json({ status: "success", message: "Solicitud recibida" });
});

productsRouter.get("/api/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});


//DELETE: Delete product by id
productsRouter.delete("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const products = await productManager.deleteProductById(productId);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//PUT: Updtae product by id
productsRouter.put("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedData = req.body;

        const products = await productManager.updateProductById(productId, updatedData);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//GET: getProductById 
productsRouter.get("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error" }) //TO DO: mejorar respuesta del error 
    }
});


export default productsRouter;