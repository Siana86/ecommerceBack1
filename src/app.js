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
import cookieParser from "cookie-parser";


//Inicializar variables de entorno 
dotenv.config();

const app = express();

//Habilitar recepcion datos tipos json en el server
app.use(express.json());

//Declarar el uso de urlencode
app.use(urlencoded({ extended: true }));

//Inicializar cookiparse
app.use(cookieParser());


const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT;

//Conectar a MongoDB
connectMongoDB();

///Handlerbars config con helpers
app.engine("handlebars", engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

//Paso 2 clase 3 
iniciarPassport();
app.use(passport.initialize());


//EndPoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);

//Registrar usuario
app.post('/registro',async(req,res)=>{
    try {
        // validaciones...
    let {first_name, last_name, email, age, password, cart, role }=req.body
    if(!first_name || !last_name || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Todos los datos son requeridos`})
    }

    let usuarioExistente = await usuariosModelo.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: `El email ya está registrado` });
        }

    // TO DO: resto validaciones

    {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        let nuevoUsuario=await usuariosModelo.create({
            first_name, 
            last_name, 
            email,
            age,
            password: hashedPassword,
            cart,
            role
        })
        
        res.setHeader('Content-Type','application/json')
        res.status(200).json({message:`Registro exitoso para ${nombre}!`, nuevoUsuario})

    };
    
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error: ${error.message}`})
    }
});



//Incia login
app.post(
    "/login",

    (req, res, next) => {
        console.log("Datos recibidos en el body:", req.body); // Para saber los datos que llegan en el body
        next();
    },

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