const path = require('path');

module.exports = (err, req, res, next) => {

    console.log(err)

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log(err.statusCode);
    console.log(err.status);
    console.log('dupa');

    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode)
            .json({
                status: err.status,
                message: err.message,
                stack: err.stack,
                error: err
            });
    }
    return res.status(err.statusCode)
        .sendFile(path.join(__dirname, '..', 'public', 'html', 'notFound.html'));
}