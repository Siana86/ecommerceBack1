import express, { urlencoded } from "express";
import http from "http";
import ProductManager from "./ProductManager.js";
import CartManager from "./cartManager.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

//Incializar gestor de productos y de carritos
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");


app.use(express.json()); //Habilita que se pueda recibir datos tipos json en el server (1H 26min)
app.use(express.static("public"));
app.use(urlencoded({extended: true }));


//Handlerbars config 
app.engine("handlebars" , engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//EndPoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);


//Websockets desde el server 
io.on("connection", (socket) =>{
    console.log("Conexion websockets establecida")
})




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
app.get("/api/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error" }) //TO DO: mejorar respuesta del error 
    }
});

//POST: Add cart
app.post("/api/carts", async (req, res) => {
    try {
        const newCart = req.body;
        const carts = await cartManager.addCart(newCart);
        res.status(201).json({ status: "success", carts });
    } catch (error) {
        res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
    }
});


//GET: getCartById
app.get("/api/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.status(200).json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error" }) //TO DO: mejorar respuesta del error 
    }
});


//POST: addProductToCart
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const updatedCart = await cartManager.addProductToCart(cid, pid);

        return res.status(200).json({ status: "success", cart: updatedCart });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message }); //TO DO: mejorar respuesta del error
    }
});


server.listen(PORT, () => {
    console.log("Servidor iniciado en el puerto 8080");
});