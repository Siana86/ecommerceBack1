import { Router } from 'express';
import express from 'express';
import bcrypt from "bcrypt";
import { auth } from '../middleware/auth.js';
import User from '../models/user.model.js';

const usersRouter = express.Router();

//GET usuarios
usersRouter.get("/", async (req, res) => {
    try {
        const users = await User.find().populate("cart");
        res.status(200).json({ status: "success", payload: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los usuarios" });
    }
});


//GET usuarios by id
usersRouter.get("/:uid", async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await User.findById(uid).populate("cart");
        if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        res.status(200).json({ status: "success", payload: user });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener el usuario" });
    }
});

//POST Crear un usuario
usersRouter.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body;

        if (!first_name || !last_name || !email) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Nombre / Apellido / email son requeridos` })
        }

        if (!password) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Debe ingresar una contraseña`})
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: "error", message: "El correo ya está registrado" });

        // Hashear la password
        const hashedPassword = await bcrypt.hashSync(password, 10);

        const user = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart,
            role
        });

        await user.save();
        res.status(201).json({ status: "success", payload: user });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el usuario" });
    }
});


// PUT: actualizar 
usersRouter.put("/:uid", async (req, res) => {
    try {
        const uid = req.params.uid;
        const updateData = req.body;

        // Actualizacion y hasheo de password
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(uid, updateData, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        res.status(200).json({ status: "success", payload: updatedUser });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar el usuario" });
    }
});


// DELETE: eliminar
usersRouter.delete("/:uid", async (req, res) => {
    try {
        const uid = req.params.uid;
        const deletedUser = await User.findByIdAndDelete(uid);
        if (!deletedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        res.status(200).json({ status: "success", payload: deletedUser });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar el usuario" });
    }
});


export default usersRouter;