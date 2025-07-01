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