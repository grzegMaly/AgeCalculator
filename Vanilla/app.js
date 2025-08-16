const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const frontendRoutes = require('./frontend/frontendRoutes');
const path = require('path');

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
app.use((req, res, next) => {

    res.status(404)
        .json({
            status: 'fail',
            message: `Page ${req.originalUrl}, not found`
        })
})

/** @type {import('express').Express} */
module.exports = app;