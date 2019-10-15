const User = require('../../../models/User');
const Project = require('../../../models/Project');

exports.create = async (req, res, next) => {
  try {
    const { title, projectMembers } = req.body;
    const project = await new Project({
      title,
      members: projectMembers.map(member => ({ member: member._id, time_tracking: [] }))
    }).save();

    await Promise.all(projectMembers.map(async member => {
      try {
        await User.update(
          {
            _id: member._id
          },
          {
            $push: { projects: project._id }
          }
        );
      } catch(err) {
        next(new Error(err));
      }
    }));

    res.send({
      message: 'Create New Project successfully'
    });
  } catch(err) {
    next(new Error(err));
  }
};

exports.getProjects = async(req, res, next) => {
  const user = await User.findOne({ email: req.params.user_email });
  const projects = await Promise.all(user.projects.map(async project => {
    try {
      return await Project.findById(project._id);
    } catch(err) {
      next(new Error(err));
    }
  }));

  res.send({
    message: 'Found Projects successfully',
    projects
  });
  console.log('projects', projects);
}

exports.update = async(req, res, next) => {
  try {
    console.log(req.body);
    res.send({ result: 'ok' });
    // const { time, domain } = req.body;
    // const user = await User.findOne({ email: email });
    // const project = await Project.findById(user.projects[0]);
    // console.log(project);
  } catch(err) {
    next(new Error(err));
  }
};
