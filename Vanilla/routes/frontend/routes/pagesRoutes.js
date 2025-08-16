const router = require('express').Router();
const viewController = require('../../../controllers/viewController');
const authController = require('../../../controllers/authController');

router.get('/', authController.protect, viewController.getCalculatorPage);

/** @type {import('express').Router}*/
module.exports = router;