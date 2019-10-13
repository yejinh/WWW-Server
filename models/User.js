const mongoose = require('mongoose');

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
  ]
});

module.exports = mongoose.model('User', userSchema);
