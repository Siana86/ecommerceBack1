import Cart from "../models/cart.model.js";

export default class CartDAO {

    static async create() {
        try {
            const cart = new Cart();
            return await cart.save();
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    static async getById(id) {
        try {
            return await Cart.findById(id).populate("products.product");
        } catch (error) {
            throw new Error("Error al obtener el carrito");
        }
    }

    static async addProduct(cartId, productId, quantity) {
        try {
            return await Cart.findByIdAndUpdate(
                cartId,
                { $push: { products: { product: productId, quantity } } },
                { new: true }
            );
        } catch (error) {
            throw new Error("Error al agregar producto al carrito");
        }
    }

    static async clear(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate("products.product");
            if (!cart) return null;

            cart.products = [];
            return await cart.save();
        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }
}
