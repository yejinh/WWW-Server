const User = require('../../../models/User');
const Project = require('../../../models/Project');
const sendMessage = require('../../../constants/sendMessage');

exports.create = async (req, res, next) => {
  try {
    const { title, endDate, addedMembers } = req.body;
    const project = await new Project({
      title,
      end_date: endDate,
      members: addedMembers.map(member => ({ member: member._id, time_tracking: [] }))
    }).save();

    await Promise.all(addedMembers.map(async member => {
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

    res.send({ message: sendMessage.NEW_PROJECT_CREATED });
  } catch(err) {
    next(new Error(err));
  }
};

exports.getOne = async(req, res, next) => {
  try {
    const project = await Project.findById(req.params.project_id);

    res.send({
      message: sendMessage.PROJECT_FOUND,
      project
    });
  } catch(err) {
    next(new Error(err));
  }
};

exports.getProjects = async(req, res, next) => {
  try {
    // populate로 바꿀 수 있을 거 같음..
    const user = await User.findById(req.params.user_id);
    const projects = await Promise.all(user.projects.map(async project => {
      return await Project.findById(project._id);
    }));

    const members = await Promise.all(projects.map(async project => {
      return await Promise.all(project.members.map(async memberData => {
        return await User.findById(memberData.member);
      }));
    }));

    res.send({
      message: sendMessage.PROJECTS_FOUND,
      projects,
      members
    });

  } catch(err) {
    next(new Error(err));
  }
}

exports.update = async(req, res, next) => {
  try {
    const project = await Project.findById(req.params.project_id);
    const userId = res.locals.userData._id;
    const extensionData = req.body;
    const member = project.members.find(check => {
      return check.member.toString() === userId.toString();
    });

    // const project = await Project.findById(req.params.project_id).populate('members');

    const timeTracking = member.time_tracking;

    extensionData.map(data => {
      const domain = Object.keys(data)[0];
      const time = Object.values(data)[0];

      const hasBeen = timeTracking.map(tracked => {
        if (tracked.domain === domain) {
          tracked.time += time;
          return true;
        }

        return false;
      });

      if (hasBeen.every(been => been === false)) {
        timeTracking.push({
          domain: domain,
          time: time
        });
      }
    });

    project.save();
    res.send({
      message: sendMessage.PROJECTS_UPDATED,
      timeTracking
    });
  } catch(err) {
    next(new Error(err));
  }
};
