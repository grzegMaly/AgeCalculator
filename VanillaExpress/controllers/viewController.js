const path = require('path');

class ViewController {

    constructor() {
        this.htmlPath = path.join(__dirname, '..', 'public', 'html');
    }

    getPage = (res, next, filename, statusCode = 200) => {
        const filePath = path.join(this.htmlPath, filename);
        return res.status(statusCode)
            .sendFile(filePath, err => {
                if (err) {
                    next(err);
                }
            })
    }

    getCalculatorPage = (req, res, next) => {
        this.getPage(res, next, 'index.html');
    }

    getLoginPage = (req, res, next) => {
        this.getPage(res, next, 'login.html');
    }

    getRegisterPage = (req, res, next) => {
        this.getPage(res, next, 'register.html');
    }

    getNotFoundPage = (req, res, next) => {
        this.getPage(req, next, 'notFound.html', 404);
    }
}

module.exports = new ViewController();