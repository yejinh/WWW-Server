const User = require('../../../models/User');
const sendMessage = require('../../../constants/sendMessage');

exports.getLoggedinUser = (req, res, next) => {
  res.json({
    message: 'User Found successfully',
    userData: res.locals.userData
  });
}

exports.getOne = async(req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.user_email });

    if (!user) {
      return res.json({ message: sendMessage.USER_NOT_FOUND });
    }

    res.json({
      message: sendMessage.USER_FOUND,
      userData: user
    });
  } catch(err) {
    next(new Error(err));
  }
};
