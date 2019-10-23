const router = require('express').Router();
const { ensureLoggedIn } = require('./middlewares/authentication');
const projectsController = require('./controllers/projects.controller');

router.post('/', ensureLoggedIn, projectsController.create);
router.get('/:user_id', ensureLoggedIn, projectsController.getProjects);
router.get('/project/:project_id', ensureLoggedIn, projectsController.getOne);
router.put('/:project_id', ensureLoggedIn, projectsController.update);

module.exports = router;
