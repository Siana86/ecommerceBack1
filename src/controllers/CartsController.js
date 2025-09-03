import CartDAO from "../dao/CartsDAO.js";

export class CartsController {

    static addCart = async (req, res) => {
        try {
            const cart = await CartDAO.create();
            res.status(201).json({ status: "success", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static getCartById = async (req, res) => {
        try {
            const cart = await CartDAO.getById(req.params.cid);
            if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

            res.status(200).json({ status: "success", payload: cart });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const updatedCart = await CartDAO.addProduct(cid, pid, quantity);
            if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

            res.status(201).json({ status: "success", payload: updatedCart });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static deleteProducts = async (req, res) => {
        try {
            const clearedCart = await CartDAO.clear(req.params.cid);
            if (!clearedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

            res.status(200).json({ status: "success", payload: clearedCart });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };
}



// export class CartsController {

//     static addCart = async (req, res) => {
//         try {
//             const cart = new Cart();
//             await cart.save();
//             res.status(201).json({ status: "succes", payload: cart });
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     };

//     static getCartById = async (req, res) => {
//         try {
//             const cid = req.params.cid;
//             const cart = await Cart.findById(cid).populate("products.product");
//             if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

//             res.status(200).json({ status: "success", payload: cart });
//         } catch (error) {
//             res.status(404).json({ message: error.message });
//         }
//     };

//     static addProductToCart = async (req, res) => {
//         try {
//             const { cid, pid } = req.params;
//             const { quantity } = req.body;

//             const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { product: pid, quantity } } }, { new: true });
//             if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

//             res.status(201).json({ status: "success", payload: updatedCart });
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     };

//     static deleteProducts = async (req, res) => {
//         try {
//             const cid = req.params.cid;
//             const cart = await Cart.findById(cid).populate("products.product");
//             if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

//             cart.products = [];
//             await cart.save();

//             res.status(200).json({ status: "success", payload: cart });
//         } catch (error) {
//             res.status(404).json({ message: error.message });
//         }
//     };

// }