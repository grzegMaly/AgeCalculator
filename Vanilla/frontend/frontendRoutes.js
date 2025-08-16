const router = require('express').Router();

const pagesRoutes = require('./pagesRoutes');
const authRoutes = require('./authRoutes');

router.use('/', pagesRoutes);
router.use('/', authRoutes);

/** @type {import('express').Router}*/
module.exports = router;