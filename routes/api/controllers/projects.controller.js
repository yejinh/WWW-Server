const mongoose = require('mongoose');
const User = require('../../../models/User');
const Project = require('../../../models/Project');

exports.create = async (req, res, next) => {
  try {
    const { title, addedMembers } = req.body;
    const project = await new Project({
      title,
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

    res.send({
      message: 'Create New Project successfully'
    });
  } catch(err) {
    console.log(err);
    next(new Error(err));
  }
};

exports.getOne = async(req, res, next) => {
  try {
    console.log(req.params.project_id);
    const project = await Project.findById(req.params.project_id);
    console.log(project);

    res.json({ result: 'ok' });
  } catch(err) {
    next(new Error(err));
  }
}

exports.getProjects = async(req, res, next) => {
  try {
    // populate로 바꿀 수 있을 거 같음..
    const user = await User.findById(req.params.user_id);
    const projects = await Promise.all(user.projects.map(async project => {
      try {
        return await Project.findById(project._id);
      } catch(err) {
        next(new Error(err));
      }
    }));

    const members = await Promise.all(projects.map(async project => {
      return await Promise.all(project.members.map(async memberData => {
        return await User.findById(memberData.member);
      }));
    }));

    res.send({
      message: 'Found Projects successfully',
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
      return toString(check.member) === toString(userId);
    });

    // const project = await Project.findById(req.params.project_id).populate('members');

    // console.log(project, 'test');
    let timeTracking = member.time_tracking;

    extensionData.map(data => {
      const domain = Object.keys(data)[0];
      const time = Object.values(data)[0];

      const hasBeen = timeTracking.map(tracked => {
        if (tracked.domain === domain) {
          if (tracked.time > 0) {
            console.log(tracked.time);
            tracked.time += (time - tracked.time);
            return true;
          }

          tracked.time += time;
          return true;
        }

        return false;
      });

      console.log(hasBeen);
      console.log(timeTracking, 'check');

      if (hasBeen.every(been => been === false)) {
        timeTracking.push({
          domain: domain,
          time: time
        });
      }
    });

    project.save();
    res.send({ result: timeTracking });
  } catch(err) {
    console.log(err);
    next(new Error(err));
  }
};

// console.log(project.members, 'members?');
// console.log(userId);
