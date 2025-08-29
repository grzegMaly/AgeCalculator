const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catcAsync');
const mongoose = require("mongoose");
const {mongo} = require("mongoose");

class TokenGenerator {
    signToken(id) {
        return jwt.sign(
            {
                id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
    }

    async verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

class AuthController {
    constructor() {
        this._tokenGenerator = new TokenGenerator();
        const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10);
        this._cookieOptions = {
            expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        if (process.env.NODE_ENV === 'production') {
            this._cookieOptions.secure = true;
        }
    }

    #sendTokenResponse = (user, statusCode, res) => {

        const token = this._tokenGenerator.signToken(user._id);
        console.log(this._cookieOptions)
        res.cookie('jwt', token, this._cookieOptions);
        res.status(statusCode)
            .json({
                status: 'success',
                token,
                data: {
                    user,
                }
            })
    }

    protect = async (req, res, next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.redirect('/login');
        }

        try {
            const decoded = await this._tokenGenerator.verifyToken(token);

            const freshUser = await User.findById(decoded.id);
            if (!freshUser) {
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

    login = catchAsync(async (req, res, next) => {

        console.log("readyState", mongoose.connection.readyState);
        if (mongoose.connection.readyState !== 1) {
            return next(new AppError('Unknown Server Error', 500));
        }

        const {email, password} = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400))
        }

        console.log(req.body);
        const user = await User.findOne({email})
            .select('+password');

        console.log(user);
        if (!user || !(await user.correctPassword(password))) {
            return next(new AppError('Invalid Credentials', 401));
        }
        this.#sendTokenResponse(user, 200, res);
    })

    register = catchAsync(async (req, res, next) => {

        console.log(req.body);
        const {name, email, password, passwordConfirm} = req.body;
        if (!password || !passwordConfirm || password !== passwordConfirm) {
            return next(new AppError('Invalid Data', 400));
        }

        console.log('Tu jesteśmy')
        const newUser = await User.create({name, email, password});
        console.log(newUser);
        this.#sendTokenResponse(newUser, 201, res);
    })
}

module.exports = new AuthController();