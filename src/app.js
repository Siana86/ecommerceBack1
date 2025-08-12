import express, { urlencoded } from "express";
import http from "http";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import { Server } from "socket.io";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import cartRouter from "./routes/carts.router.js";
import __dirname from "../dirname.js";
import Product from "./models/product.model.js";
import usersRouter from "./routes/users.router.js";
import bcrypt from 'bcrypt';
import { iniciarPassport } from "./config/passport.config.js";
import passport from "passport";
import jwt from "jsonwebtoken";



//Inicializar variables de entorno 
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server);
//Habilitar recepcion datos tipos json en el server
app.use(express.json());
const PORT = process.env.PORT;

connectMongoDB();

//Paso 2 clase 3 
iniciarPassport();
app.use(passport.initialize());

//EndPoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);


//Incia login
app.post(
    "/login",
    passport.authenticate("login", {session:false, failureRedirect:"/error"}),
    (req, res) => {

        let usuario=req.user
        delete usuario.password 
        let token = jwt.sign(usuario.toObject(), process.env.SECRET, { expiresIn: "1h" })

        res.cookie("cookieToken", token, { httpOnly: true })
        return res.status(200).json({
            usuarioLogueado: usuario,
        
        })

    }
)

app.get("/logout", (req, res) => {

    res.clearCookie("cookieToken")
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Logout exitoso!" });
})

app.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `Error al autenticar` })
})

//Inica autenticacion de usuario logueado con PassportJWT
app.get(
    '/usuario',
    // paso 3
    passport.authenticate("current", { session: false, failureRedirect: "/error" }),
    (req, res) => {

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            mensaje: 'Perfil usuario ' + req.user.nombre, datosUsuario: req.user
        });
    }
);


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