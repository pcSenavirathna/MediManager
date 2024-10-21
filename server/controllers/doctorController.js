const Doctor = require('../models/Doctor');
const auth = require('./authController');
const sendMail = require('../utils/sendMail');

exports.createDoctor = async (req, res) => {
  try {
    const { name, email, speciality, schedule, phone } = req.body;
    const lastDoctor = await Doctor.findOne().sort({ _id: -1 });
    const lastId = lastDoctor ? parseInt(lastDoctor.doctorId.slice(1)) : 0;
    const newId = `D${String(lastId + 1).padStart(4, '0')}`;

    let password = Math.random().toString(36).slice(2, 8);

    await auth.register(email, password, 'Doctor');
    const doctor = new Doctor({ name, email, password, speciality, phone, schedule, doctorId: newId });
    await doctor.save();
    
    sendMail.sendEmployeeInitialPassword(name, email, password);

    res.status(201).json({ message: 'Doctor member created successfully' });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error creating Doctor' });
    
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching doctors', error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate({ doctorId: req.params.id }, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor', error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({ doctorId: req.params.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting doctor', error: error.message });
  }
};

exports.searchDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorId: req.params.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: 'Error searching for doctor', error: error.message });
  }
};
