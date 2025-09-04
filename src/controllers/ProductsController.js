import Product from "../models/product.model.js";
import ProductDAO from "../dao/ProductsDAO.js";
import ProductDTO from "../dto/ProductsDTO.js";

export class ProductsController {
    static getProducts = async (req, res) => {
        try {
            const { limit = 10, page = 1 } = req.query;
            const data = await ProductDAO.getAll({ limit, page });

            const products = ProductDTO.fromList(data.docs);
            delete data.docs;

            res.status(200).json({ status: "success", payload: products, ...data });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static getProductById = async (req, res) => {
        try {
            const product = await ProductDAO.getById(req.params.pid);
            if (!product) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }


            const productDTO = new ProductDTO(product);
            res.status(200).json({ status: "success", payload: productDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static addProduct = async (req, res) => {
        try {
            const product = await ProductDAO.create(req.body);

            const productDTO = new ProductDTO(product);
            res.status(201).json({ status: "success", payload: productDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static updateProductById = async (req, res) => {
        try {
            const updated = await ProductDAO.updateById(req.params.pid, req.body);
            if (!updated) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            const updatedDTO = new ProductDTO(updated);
            res.status(200).json({ status: "success", payload: updatedDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const deleted = await ProductDAO.deleteById(req.params.pid);
            if (!deleted) {
                return res.status(404).json({ status: "error", message: "Producto no encontrado" });
            }

            const deletedDTO = new ProductDTO(deleted);
            res.status(200).json({ status: "success", payload: deletedDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };
}
