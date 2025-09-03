import User from "../models/user.model.js";

export default class UserDAO {

    static async getAll() {
        try {
            return await User.find().populate("cart");
        } catch (error) {
            throw new Error("Error al obtener los usuarios");
        }
    }

    static async getById(id) {
        try {
            return await User.findById(id).populate("cart");
        } catch (error) {
            throw new Error("Error al obtener el usuario");
        }
    }

    static async getByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error("Error al buscar usuario por email");
        }
    }

    static async create(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error("Error al crear el usuario");
        }
    }

    static async updateById(id, updateData) {
        try {
            return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        } catch (error) {
            throw new Error("Error al actualizar el usuario");
        }
    }

    static async deleteById(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error al eliminar el usuario");
        }
    }
}
