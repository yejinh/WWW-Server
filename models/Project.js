const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const ProjectSchema = new mongoose.Schema({
  creator_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  members: [
    {
      member: {
        type: ObjectId,
        ref: 'User'
      },
      time_tracking: [
        {
          domain: {
          type: String,
          required: true
          },
          time: {
            type: Number,
            required: true
          }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Project', ProjectSchema);
