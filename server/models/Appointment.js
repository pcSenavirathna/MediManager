const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  patient: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
