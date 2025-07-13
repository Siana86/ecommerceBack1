import express, { urlencoded } from "express";
import http from "http";
import ProductManager from "./ProductManager.js";
import CartManager from "./cartManager.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import cartRouter from "./routes/carts.router.js";
import __dirname from "../dirname.js";
import Product from "./models/product.model.js";



//Inicializar variables de entorno 
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server);
//Habilitar recepcion datos tipos json en el server
app.use(express.json());
const PORT = process.env.PORT;

connectMongoDB();

//EndPoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// app.listen(PORT, () => {
//     console.log(`Servidor inciado en el pruerto> ${PORT}`);
// });





// //Incializar gestor de productos y de carritos
// const productManager = new ProductManager("./src/products.json");
// const cartManager = new CartManager("./src/carts.json");



//Habilitar la carpeta public
app.use(express.static(__dirname + "/public"));
app.use(urlencoded({ extended: true }));


//Handlerbars config 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");




//Websockets desde el server 
io.on("connection", (socket) => {
    console.log("Conexion websockets establecida desde app server")

    //Agregar nuevo producto
    socket.on("newProduct", async (productData) => {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            io.emit("productAdded", newProduct)

        } catch (error) {
            console.error("Error al añadir un producto", error.message);
        }
    });

    //Eliminar un producto 
    socket.on("deleteProduct", async productId => {
        try {
            const result = await Product.findByIdAndDelete(productId);
            if (result) {
                io.emit("productDeleted", productId);
            } else {
                socket.emit("errorMsg", "Producto no encontrado");
            }



        } catch (error) {
            socket.emit("errorMsg", "No se pudo eliminar el producto.");
            console.error(error);
        }
    });
});



server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto > ${PORT}`);
});