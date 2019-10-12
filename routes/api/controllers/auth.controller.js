const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const { vaildEmail } = require('../../../constants/reg-ex');

exports.authenticate = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!vaildEmail.test(email)) {
      throw new Error('Invaild Email');
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const userData = await new User({ email, name, projects: [] }).save();
      const { email, name, _id } = userData;
      const token = jwt.sign({ email, name, _id }, process.env.SECRET_KEY, { expiresIn: '7d' });

      return res.json({
        message: 'logged in successfully',
        access_token: token,
        userId: userData._id
      });
    }

    const token = jwt.sign({ email, name, _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
    res.json({
      message: 'logged in successfully',
      access_token: token,
      userId: user._id
    });

  } catch(err) {
    next(new Error(err));
  }
};
