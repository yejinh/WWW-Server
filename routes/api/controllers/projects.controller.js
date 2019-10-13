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
      const user = await User.update(
        {
          _id: member._id
        },
        {
          $push: { projects: project._id }
        }
      );
      console.log(user);
    }));

  } catch(err) {
    console.log(err);
    next(new Error(err));
  }
};
