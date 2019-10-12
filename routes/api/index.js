const router = require('express').Router();
const auth = require('./auth');
const projects = require('./projects');
const users = require('./users');

router.use('/auth', auth);
router.use('/projects', projects);
router.use('/users', users);

module.exports = router;
