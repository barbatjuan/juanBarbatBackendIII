import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "error", error: "Incomplete values" });
        }
        
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ status: "error", error: "Invalid credentials" });
        }
        
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            return res.status(401).json({ status: "error", error: "Invalid credentials" });
        }
        
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        
        // Enviar el token en la respuesta JSON
        res.status(200).json({
            status: "success",
            token,
            user: userDto
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

const current = async (req, res) => {
    try {
        // Obtener el token del encabezado Authorization
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No estás autenticado. Por favor inicia sesión para obtener acceso.'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener el usuario actual
        const currentUser = await usersService.getUserById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'El usuario al que pertenece este token ya no existe.'
            });
        }

        // Enviar los datos del usuario
        const userDto = UserDTO.getUserTokenFrom(currentUser);
        res.status(200).json({
            status: 'success',
            data: userDto
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido. Por favor inicia sesión de nuevo.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.'
            });
        }
        console.error('Error en current:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    current,
    login,
    register,
    unprotectedLogin,
    unprotectedCurrent
}