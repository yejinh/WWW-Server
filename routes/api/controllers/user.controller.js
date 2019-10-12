const User = require('../../../models/User');

exports.getOne = async(req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.user_email });

    if (!user) {
      return res.json({
        message: 'User Not Found',
        access_token: token,
        userId: userData._id
      });
    }

    res.json({
      message: 'User Found successfully',
      userData: user
    });
  } catch(err) {
    next(new Error(err));
  }
};
