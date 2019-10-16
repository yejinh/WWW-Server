const router = require('express').Router();
const authentication = require('./middlewares/authentication');
const projectsController = require('./controllers/projects.controller');

router.post('/', authentication.ensureLoggedIn, projectsController.create);
router.get('/:project_id', authentication.ensureLoggedIn, projectsController.getOne);
router.get('/:user_id', authentication.ensureLoggedIn, projectsController.getProjects);
router.put('/:project_id', authentication.ensureLoggedIn, projectsController.update);

module.exports = router;
