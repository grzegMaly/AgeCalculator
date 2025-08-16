const router = require('express').Router();

const pagesRoutes = require('./routes/pagesRoutes');
const authRoutes = require('./routes/authRoutes');

router.use('/', pagesRoutes);
router.use('/', authRoutes);

/** @type {import('express').Router}*/
module.exports = router;