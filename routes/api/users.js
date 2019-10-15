const router = require('express').Router();
const authentication = require('./middlewares/authentication');
const userController = require('./controllers/user.controller');

router.get('/', authentication.ensureLoggedIn, userController.getLoggedinUser);
router.get('/:user_email', authentication.ensureLoggedIn, userController.getOne);

module.exports = router;
