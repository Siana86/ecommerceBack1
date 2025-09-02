import Product from "../models/product.model.js";


export class ViewsController {

    static getHome =async (req, res) => {
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
};

    static getRealTimeProducts = async (req, res) => {
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
};

    static getRegistro = (req,res)=>{
    let isLogin=false
    if(req.user) isLogin=true

    res.status(200).render('registro', {
        isLogin
    })
};

    static getLogin = (req,res)=>{
    let isLogin = false;

    // Verifica si req.user existe
    if (req.user) {
        isLogin = true;
    }

    res.status(200).render('login', { isLogin });
};

    static getPerfil = (req,res)=>{
    
        let {first_name, last_name, email, role}=req.user
        
    
        res.status(200).render('perfil', {
            first_name,
            last_name,
            email,
            role, 
            isLogin: true
        })
    };


}