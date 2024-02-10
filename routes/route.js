import express from "express";
import { getUsers, register, login, logout } from "../controllers/userController.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = express.Router();

route.get('/users', verifyToken, getUsers);
route.post('/register', register);
route.post('/login', login);
route.get('/token', refreshToken);
route.delete('/logout', logout);

export default route