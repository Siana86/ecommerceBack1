import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./cartManager.js";


const app = express();

app.use(express.json()); //Habilita que se pueda recibir datos tipos json en el server

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

//GET: Get products
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

//POST: Add product
app.post("/api/products", async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//DELETE: Delete product by id
app.delete("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const products = await productManager.deleteProductById(productId);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});

//PUT: Updtae product by id
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

//GET: getProductBy 
app.get("/api/products/:pid", async (req, res) =>
    {try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.status(200).json({status: "success", product});
    } catch (error) {
        res.status(500).json({status: "error"}) //TO DO: mejorar respuesta del error 
    }
});

//POST: Add cart
app.post("/api/carts", async (req, res) => {
    try {
        const newCart = req.body;
        const carts = await cartManager.addCart(newCart);
        res.status(201).json({status:"success", carts});
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});


app.listen(8080, () => {
    console.log("Servidor iniciado en el puerto 8080");
});