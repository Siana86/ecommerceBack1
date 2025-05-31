import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();

app.use(express.json()); //Habilita que se pueda recibir datos tipos json en el server

const productManager = new ProductManager("./src/products.json");

//GET - Obtener datos
app.get("/", (req, res) => {

    res.json({ status: "success", message: "Solicitud recibida" });
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//POST
app.post("/api/products", async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//DELETE
app.delete("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const products = await productManager.deleteProductById(productId);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//PUT
app.put("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedData = req.body;

        const products = await productManager.updateProductById(productId, updatedData);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//getProductBy

app.listen(8080, () => {
    console.log("Servidor iniciado en el puerto 8080");
});