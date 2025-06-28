import fs from "fs";

class CartManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    async getCarts() {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
            const carts = JSON.parse(fileData);
            return carts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw new Error(`Error al traer los carros - ${error.message}`);
        }
    }

    async getCartById(idCart) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === parseInt(idCart));

            if (!cart) {
                console.error("Not found");
                return null;
            }

            return cart;

        } catch (error) {
            throw new Error(`Error al buscar carrito por ID: ${error.message}`)
        }
    }

    generateNewId(carts) {
        if (carts.length > 0) {
            return carts[carts.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    async addCart(newCart) {
        try {

            const carts = await this.getCarts();
            const newId = this.generateNewId(carts);
            const cart = {
                id: newId,
                products: []
            };
            carts.push(cart);

            await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
            return carts;
        } catch (error) {
            throw new Error(`Error al crear el carrito - ${error.message}`);
        }
    }

    async addProductToCart(idCart, idProduct) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((c) => c.id === parseInt(idCart));

            if (cartIndex < 0) {
                throw new Error(`Carrito con id ${idCart} no encontrado`);
            }

            const cart = carts[cartIndex];

            const productIndex = cart.products.findIndex(
                (p) => p.product === parseInt(idProduct)
            );

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({
                    product: parseInt(idProduct),
                    quantity: 1,
                });
            }

            carts[cartIndex] = cart;
            await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito ${idCart} - ${error.message}`);
        }
    }

}

export default CartManager;
