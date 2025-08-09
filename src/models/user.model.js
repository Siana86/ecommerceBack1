import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true },
    age: Number,
    password: {type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    role: { type: String, default:'user'},
    created_at: { type: Date, default: Date.now}
});


const User = mongoose.model("User", userSchema);

export default User;