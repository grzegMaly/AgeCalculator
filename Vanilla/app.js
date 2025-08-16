const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const frontendRoutes = require('./routes/frontend/frontendRoutes');
const backendRoutes = require('./routes/backend/backendRoutes');
const path = require('path');
const GlobalExceptionHandler = require('./controllers/exceptionController');
const AppError = require("./utils/appError");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const limiter = rateLimit({
    max: process.env.MAX_REQUEST_LIMIT,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from these IO, please try again in an hour',
});
app.use('/api', limiter);

app.use(express.json({limit: process.env.PACKET_LIMIT_SIZE}));
app.use(express.urlencoded({extended: true, limit: process.env.PACKET_LIMIT_SIZE}));

app.use('/', frontendRoutes);
app.use('/api/v1', backendRoutes);
app.use('/.well-known', (req, res) => res.status(204).end());
app.use('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res, next) => {
    next(new AppError(`Page ${req.originalUrl} not found`, 404));
});
app.use(GlobalExceptionHandler);

/** @type {import('express').Express} */
module.exports = app;