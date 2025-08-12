import express from "express";
import Product from "../models/product.model.js";


const viewsRouter = express.Router();


//Endpoints 
viewsRouter.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const data = await Product.paginate({}, { limit, page, lean: true });
        const products = data.docs;
        delete data.docs;

        const links = [];

        for (let i = 1; i <= data.totalPages; i++) {
            links.push({ text: i, link: `?limit=${limit}&page=${i}` });
        }

        res.render("home", { products, links });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {

        const { limit = 10, page = 1 } = req.query;

        const data = await Product.paginate({}, { limit, page, lean: true });
        const products = data.docs;
        delete data.docs;

        const links = [];

        for (let i = 1; i <= data.totalPages; i++) {
            links.push({ text: i, link: `?limit=${limit}&page=${i}` });
        }
        res.render("realTimeProducts", { products, links });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//Habilita la vista de registro
viewsRouter.get('/registro',(req,res)=>{
    let isLogin=false
    if(req.user) isLogin=true

    res.status(200).render('registro', {
        isLogin
    })
});


//Habilita la vista de login
viewsRouter.get('/login',(req,res)=>{
    let isLogin = false;

    // Verifica si req.user existe
    if (req.user) {
        isLogin = true;
    }

    res.status(200).render('login', { isLogin });
});




export default viewsRouter;

