const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

/** @type {import('express').Router}*/
module.exports = router;