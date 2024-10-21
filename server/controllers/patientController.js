const Patient = require('../models/Patient');
const auth = require('./authController');

exports.createPatient = async (req, res) => {
    try {
        const { name, email, password, userType, phone, medicalHistory } = req.body;
        const lastPatient = await Patient.findOne().sort({ _id: -1 });
        const lastId = lastPatient ? parseInt(lastPatient.patientId.slice(1)) : 0;
        const newId = `P${String(lastId + 1).padStart(4, '0')}`;

        const patient = new Patient({ name, email, medicalHistory, phone, patientId: newId });
        await patient.save();
        await auth.register(email, password, userType);
        res.status(201).json({ message: 'Patient created successfully', patient });
    } catch (error) {
        res.status(400).json({ message: 'Error creating patient', error: error.message });
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching patients', error: error.message });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({ message: 'Error updating patient', error: error.message });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting patient', error: error.message });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        console.log('Fetching patient by ID:', req.params.id);
        const patient = await Patient.findOne({ patientId: req.params.id });
        if (!patient) { return res.status(404).json({ message: 'Patient not found' }); }
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error fetching patient by ID:', error);
        res.status(400).json({ message: 'Error fetching patient', error: error.message });
    }
};


exports.getPatientByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching patient by email:', email);
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching patient', error: error.message });
    }
};
