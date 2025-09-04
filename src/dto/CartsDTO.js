// src/dto/CartsDTO.js
import ProductDTO from "./ProductsDTO.js";

export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            product: new ProductDTO(item.product),
            quantity: item.quantity
        }));
        this.createdAt = cart.created_at;
    }

    static fromList(carts) {
        return carts.map(c => new CartDTO(c));
    }
}