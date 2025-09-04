import ViewsDAO from "../dao/ViewsDAO.js";
import ProductDTO from "../dto/ProductsDTO.js";

export class ViewsController {
    static getHome = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const data = await ViewsDAO.getPaginatedProducts(limit, page);
        const products = ProductDTO.fromList(data.docs); 
        delete data.docs;

        const links = [];
        for (let i = 1; i <= data.totalPages; i++) {
            links.push({ text: i, link: `?limit=${limit}&page=${i}` });
        }

        
        const role = req.user?.role || "public";
        const isLogin = role !== "public";

        res.render("home", { 
            products, 
            links, 
            role,     
            isLogin   
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


    // static getHome = async (req, res) => {
    //     try {
    //         const { limit = 10, page = 1 } = req.query;

    //         const data = await ViewsDAO.getPaginatedProducts(limit, page);
    //         const products = ProductDTO.fromList(data.docs); // 🔥 DTO aquí
    //         delete data.docs;

    //         const links = [];
    //         for (let i = 1; i <= data.totalPages; i++) {
    //             links.push({ text: i, link: `?limit=${limit}&page=${i}` });
    //         }

    //         res.render("home", { products, links }); //Agregar rol
    //     } catch (error) {
    //         res.status(500).send({ message: error.message });
    //     }
    // };

    static getRealTimeProducts = async (req, res) => {
        try {
            const { limit = 10, page = 1 } = req.query;

            const data = await ViewsDAO.getPaginatedProducts(limit, page);
            const products = ProductDTO.fromList(data.docs); // 🔥 DTO aquí
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

    static getRegistro = (req, res) => {
        let isLogin = false;
        if (req.user) isLogin = true;

        res.status(200).render('registro', { isLogin });
    };

    static getLogin = (req, res) => {
        let isLogin = false;
        if (req.user) isLogin = true;

        res.status(200).render('login', { isLogin });
    };

    static getPerfil = (req, res) => {
        let { first_name, last_name, email, role } = req.user;

        res.status(200).render('perfil', {
            first_name,
            last_name,
            email,
            role,
            isLogin: true
        });
    };
}
