import UserDAO from "../dao/UsersDAO.js";
import bcrypt from "bcrypt";
import UserDTO from "../dto/UsersDTO.js";


export class UsersController {

    static getUsers = async (req, res) => {
        try {
            const users = await UserDAO.getAll();
            const usersDTO = UserDTO.fromList(users);
            res.status(200).json({ status: "success", payload: usersDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static getUserById = async (req, res) => {
        try {
            const user = await UserDAO.getById(req.params.uid);
            if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

            const userDTO = new UserDTO(user); 
            res.status(200).json({ status: "success", payload: userDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static addUser = async (req, res) => {
        try {
            const { first_name, last_name, email, age, password, cart, role } = req.body;

            if (!first_name || !last_name || !email) {
                return res.status(400).json({ status: "error", message: "Nombre / Apellido / Email son requeridos" });
            }

            if (!password) {
                return res.status(400).json({ status: "error", message: "Debe ingresar una contraseña" });
            }

            const existingUser = await UserDAO.getByEmail(email);
            if (existingUser) return res.status(400).json({ status: "error", message: "El correo ya está registrado" });

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await UserDAO.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                cart,
                role
            });

            const userDTO = new UserDTO(user); 
            res.status(201).json({ status: "success", payload: userDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static updateUser = async (req, res) => {
        try {
            const uid = req.params.uid;
            const updateData = req.body;

            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedUser = await UserDAO.updateById(uid, updateData);
            if (!updatedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

            const userDTO = new UserDTO(updatedUser); 
            res.status(200).json({ status: "success", payload: userDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };

    static deleteUser = async (req, res) => {
        try {
            const deletedUser = await UserDAO.deleteById(req.params.uid);
            if (!deletedUser) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

            const userDTO = new UserDTO(deletedUser); 
            res.status(200).json({ status: "success", payload: userDTO });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    };
}
