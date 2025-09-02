import express from 'express';
import { UsersController } from "../controllers/UsersController.js";

const usersRouter = express.Router();

usersRouter.get('/', UsersController.getUsers);
usersRouter.get('/:uid', UsersController.getUserById);
usersRouter.post('/', UsersController.addUser);
usersRouter.put('/:uid', UsersController.updateUser);
usersRouter.delete('/:uid', UsersController.deleteUser);


export default usersRouter;