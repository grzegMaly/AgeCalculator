const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
}

const handleDuplicateFields = (error) => {
    const message = `Duplicate field value: ${Object.keys(error.keyValue)[0]}. Please use another value.`
    return new AppError(message, 400);
}

const handleValidationErrorDB = (error) => {

    const errors = Object.values(error.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;

    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid Token. Please login again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has been expired. Please login again!', 401);

const sendError = (err, res, req) => {
    console.log(err);
    return res.status(err.statusCode)
        .json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = {...err};
    error.name = err.name;
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendError(error, res, req);
}