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


server.listen(PORT, () => {
    console.log("Servidor iniciado en el puerto 8080");
});