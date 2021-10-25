
const userModel = require('../models/user');

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { json } = require('express');

class AuthController {
    /** [GET] /api/auth/firstAccess
     *  get user date first time access
     *  public
     */
    async firstAccess(req, res) {

        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1]
        if (!token)
            return res
                .status(401)
                .json({ success: false, message: 'Access token not found' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { userId } = decoded;
            if (!userId) return res
                .status(401)
                .json({ success: false, message: 'Access token not found' });

            const foundUser = await userModel.findOne({ _id: userId });
            if (!foundUser) return res.json({ success: false, message: 'user not found' });


            return res.json(
                {
                    success: true,
                    message: 'successfully',
                    response: {
                        _id: foundUser._id,
                        fullname: foundUser.fullname,
                        isAdmin: foundUser.isAdmin
                    }
                }
            );

        } catch (error) {
            console.log(error)
            return res.status(403).json({ success: false, message: 'Invalid token' })
        }
    }

    /** [POST] /api/auth/register 
     *  register a new account
     *  public
    */
    async register(req, res) {
        const { data = {} } = req.body;

        if (typeof data !== 'object') return res.status(404).json({ success: false, message: 'bad request' });
        if (!data.username || !data.password) return res.status(404).json({ success: false, message: 'bad request' })

        try {
            const { username, fullname, password } = data;

            const hashedPassword = await argon2.hash(password);

            // console.log({ username, fullname, password, hashedPassword });

            // Save
            const newUser = await userModel.create({ username, fullname, password: hashedPassword, isAdmin: false });

            // Token
            const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
            // console.log(`[accessToken]`, accessToken);

            // console.log(`[register response ]`, response);

            return res.json(
                {
                    success: true,
                    message: 'successfully',
                    response: { _id: newUser._id, fullname: newUser.fullname, isAdmin: newUser.isAdmin },
                    token: accessToken
                });

        } catch (err) {
            console.log(`[AUTH REGISTER ERR]`, err);
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }

    /** [POST] /api/auth/login 
     *  login
     *  public
    */
    async login(req, res) {
        const { data = {} } = req.body;

        if (typeof data !== 'object') return res.status(400).json({ success: false, message: 'bad request' });

        if (!data.username || !data.password) return res.status(400).json({ success: false, message: 'bad request' });

        try {
            // Find by username
            const foundUser = await userModel.findOne({ username: data.username });

            // return res.status(500).json({ success: false, message: 'internal server' })


            // Not see username
            if (!foundUser) return res.status(404).json({ success: false, message: 'not found' });

            // Compare password
            const isPassword = await argon2.verify(foundUser.password, data.password);

            // Password is not true
            if (!isPassword) return res.status(404).json({ success: false, message: 'not found' })

            const accessToken = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET);

            // All good
            return res.json(
                {
                    success: true,
                    message: 'successfully',
                    response: { _id: foundUser._id, fullname: foundUser.fullname, isAdmin: foundUser.isAdmin },
                    token: accessToken
                })

        } catch (err) {
            console.log(`[AUTH LOGIN ERR]`, err);
            return res.status(500).json({ success: false, message: 'internal server' })
        }

    }

}

module.exports = new AuthController;