const Discharge = require('../models/Discharge');

exports.createDischarge = async (req, res) => {
    console.log('Received request to create discharge:', req.body);
    const { patientId, dischargeDate, amountPaid, notes } = req.body;
    try {
        if (!patientId || !dischargeDate || !amountPaid) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const discharge = new Discharge({ patientId, dischargeDate, amountPaid, notes, paid: false });
        await discharge.save();
        res.status(201).json({ message: 'Discharge record created successfully', discharge });
    } catch (error) {
        console.error('Error creating discharge record:', error);
        res.status(400).json({ message: 'Error creating discharge record', error: error.message });
    }
};

exports.getDischargeByPatientId = async (req, res) => {
    try {
        const discharges = await Discharge.find({ patientId: req.params.patientId });
        if (!discharges.length) {
            return res.status(404).json({ message: 'No discharge records found for this patient' });
        }
        res.status(200).json(discharges);
    } catch (error) {
        console.error('Error fetching discharge record:', error);
        res.status(400).json({ message: 'Error fetching discharge record', error: error.message });
    }
};

exports.markDischargeAsPaid = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the discharge record
        const discharge = await Discharge.findByIdAndUpdate(id, { paid: true }, { new: true });
        if (!discharge) {
            return res.status(404).json({ message: 'Discharge record not found' });
        }
        res.status(200).json({ message: 'Payment recorded successfully', discharge });
    } catch (error) {
        console.error('Error marking discharge as paid:', error);
        res.status(400).json({ message: 'Error marking discharge as paid', error: error.message });
    }
};
