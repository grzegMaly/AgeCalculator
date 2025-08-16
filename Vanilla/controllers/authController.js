const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthController {
    async protect(req, res, next) {
        let token;
        console.log('dupa')

        if (req.headers.authorization && req.req.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.redirect('/login');
        }

        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);

            const freshUser = await User.findById(decoded.id);
            if (freshUser) {
                return next(new Error("The user belonging to this token no longer exists"));
            }

            req.user = freshUser;
            next();
        } catch (error) {
            console.error('JWT verification failed:', error.message);
            res.clearCookie('jwt');
            return res.redirect('/login');
        }
    }

    login(req, res, next) {

    }

    register(req, res, next) {

    }
}

module.exports = new AuthController();