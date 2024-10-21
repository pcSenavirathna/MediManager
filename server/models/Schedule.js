const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  shiftStart: {
    type: String,
    required: true,
  },
  shiftEnd: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
