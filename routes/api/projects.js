const router = require('express').Router();
const authentication = require('./middlewares/authentication');
const projectsController = require('./controllers/projects.controller');

router.get('/', function(req, res, next) {
  console.log(req.user);
  res.send({ result: req.user });
});

router.post('/', authentication.ensureLoggedIn, projectsController.create);
router.get('/:user_email', projectsController.getProjects);
router.put('/', projectsController.update);

module.exports = router;
