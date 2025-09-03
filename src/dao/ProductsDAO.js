import Product from "../models/product.model.js";

export default class ProductDAO {
    static async getAll({ limit = 10, page = 1 }) {
        return await Product.paginate({}, { limit, page });
    }

    static async getById(id) {
        return await Product.findById(id);
    }

    static async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    static async updateById(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    static async deleteById(id) {
        return await Product.findByIdAndDelete(id);
    }
}
