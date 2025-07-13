import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String, index: "text" },
    category: { type: String, index: true },
    price: Number,
    thumbnail: String,
    stock: Number,
    status: { type: Boolean, default: true },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;