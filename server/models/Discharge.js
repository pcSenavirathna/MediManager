// models/Discharge.js
const mongoose = require('mongoose');

const dischargeSchema = new mongoose.Schema({
  patientId: {
    type: String, 
    required: true
  },
  dischargeDate: {
    type: Date, 
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  notes: { 
    type: String
  },
  paid: {
    type: Boolean, 
    default: false
  } // Add this line
});

const Discharge = mongoose.model('Discharge', dischargeSchema);
module.exports = Discharge;
