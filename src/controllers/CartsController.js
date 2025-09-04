import CartDAO from "../dao/CartsDAO.js";
import CartDTO from "../dto/CartsDTO.js";

export class CartsController {
    static addCart = async (req, res) => {
        try {
            const cart = await CartDAO.create();
            const cartDTO = new CartDTO(cart);
            res.status(201).json({ status: "success", payload: cartDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static getCartById = async (req, res) => {
        try {
            const cart = await CartDAO.getById(req.params.cid);
            if (!cart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }
            const cartDTO = new CartDTO(cart);
            res.status(200).json({ status: "success", payload: cartDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const updatedCart = await CartDAO.addProduct(cid, pid, quantity);
            if (!updatedCart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            const cartDTO = new CartDTO(updatedCart);
            res.status(201).json({ status: "success", payload: cartDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static deleteProducts = async (req, res) => {
        try {
            const clearedCart = await CartDAO.clear(req.params.cid);
            if (!clearedCart) {
                return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
            }

            const cartDTO = new CartDTO(clearedCart);
            res.status(200).json({ status: "success", payload: cartDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };
}
