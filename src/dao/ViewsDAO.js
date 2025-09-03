import Product from "../models/product.model.js";

export default class ViewsDAO {
    static async getPaginatedProducts(limit = 10, page = 1) {
        try {
            const data = await Product.paginate({}, { limit, page, lean: true });
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
