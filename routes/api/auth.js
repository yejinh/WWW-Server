const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth.controller');

router.post('/authenticate', authController.authenticate);

module.exports = router;
