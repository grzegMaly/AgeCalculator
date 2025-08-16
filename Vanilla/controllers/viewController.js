const path = require('path');

class ViewController {
    getCalculatorPage(req, res, next) {

        const filePath = path.join(__dirname, '..', 'public', 'index.html');
        res
            .status(200)
            .sendFile(filePath, err => {
            if (err) next(err);
        })
    }

    getLoginPage(req, res, next) {
        const filePath = path.join(__dirname, '..', 'public', 'login.html');
        res.status(200)
            .sendFile(filePath, err => {
                if (err) next(err);
            })
    }

    getRegisterPage(req, res, next) {
        const filePath = path.join(__dirname, '..', 'public', 'register.html');
        res.status(200)
            .sendFile(filePath, err => {
                if (err) next(err);
            })
    }
}

module.exports = new ViewController();