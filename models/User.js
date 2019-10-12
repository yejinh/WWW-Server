const mongoose = require('mongoose');
const { vaildEmail } = require('../constants/reg-ex');

const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  projects: [
    {
      type: ObjectId,
      ref: 'Project',
      required: true
    }
  ],
  login_with: String
});

module.exports = mongoose.model('User', userSchema);
