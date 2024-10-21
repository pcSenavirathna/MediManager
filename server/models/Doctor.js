const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }]  
  
});

module.exports = mongoose.model('Doctor', DoctorSchema);
