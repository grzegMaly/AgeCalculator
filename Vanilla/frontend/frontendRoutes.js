const router = require('express').Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', authController.protect, viewController.getCalculatorPage);
router.get('/login', viewController.getLoginPage)
router.get('/register', viewController.getRegisterPage)

/** @type {import('express').Router}*/
module.exports = router;