import express from "express";
import ProductManager from "../ProductManager.js";
import { Server } from "socket.io";
import Product from "../models/product.model.js";



const productsRouter = express.Router();
//const productManager = new ProductManager("./src/products.json");

//Add product
// productsRouter.post("/", async (req, res) => {
//     try {
//         const products = await productManager.addProduct(req.body);
//         const lastProduct = products[products.length - 1];
//         res.status(201).json({ status: "success", lastProduct });
//     } catch (error) {
//         res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
//     }
// });


productsRouter.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const data = await Product.paginate({}, { limit, page });
        const products = data.docs;
        delete data.docs;

        res.status(200).json({ status: "sucess", payload: products, ...data });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al recuperar los productos" })
    }
});


//Falta traer producto por su id

productsRouter.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail, status } = req.body;

        const product = new Product({ title, description, code, price, stock, category, thumbnail, status });
        await product.save();

        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al añadir un nuevo producto" });
    }
});

productsRouter.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.status(200).json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al editar un producto" });
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.status(200).json({ status: "success", payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al borrar un producto" });
    }
});



// productsRouter.get("/api/products", async (req, res) => {
//     try {
//         const products = await productManager.getProducts();

//         res.status(200).json({ status: "success", products });
//     } catch (error) {
//         res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
//     }
// });


// //DELETE: Delete product by id
// productsRouter.delete("/api/products/:pid", async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         const products = await productManager.deleteProductById(productId);
//         res.status(200).json({ status: "success", products });
//     } catch (error) {
//         res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
//     }
// });

// //PUT: Updtae product by id
// productsRouter.put("/api/products/:pid", async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         const updatedData = req.body;

//         const products = await productManager.updateProductById(productId, updatedData);
//         res.status(200).json({ status: "success", products });
//     } catch (error) {
//         res.status(500).json({ status: "error" }); //TO DO: mejorar respuesta del error
//     }
// });

// //GET: getProductById 
// productsRouter.get("/api/products/:pid", async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         const product = await productManager.getProductById(productId);
//         res.status(200).json({ status: "success", product });
//     } catch (error) {
//         res.status(500).json({ status: "error" }) //TO DO: mejorar respuesta del error 
//     }
// });


export default productsRouter;