import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'email']
        })
        res.json(users)
    } catch (error) {
        console.log(error);
    }
}

export const register = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;
    if (password !== password_confirmation) return res.status(400).json({ message: "konfirmasi password tidak sesuai!" })
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    try {
        await User.create({
            name: name,
            email: email,
            password: hashPass
        })
        res.json({ message: "registrasi berhasil!" })
    } catch (error) {
        res.status(500).json({message: "register gagal"})
        console.log(error);
    }
}

export const login = async (req, res) => {

    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            },
        })

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ message: "password salah!" });

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        await User.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            },
            
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({message: "data user tidak ditemukan!"})
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user) return res.sendStatus(204);
    await user.update({ refresh_token: null });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}