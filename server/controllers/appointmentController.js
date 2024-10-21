const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
    const { date, time, doctor, patient, reason } = req.body;
    try {
      if (!date || !time || !doctor || !patient || !reason) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const appointment = new Appointment({ date, time, doctor, patient, reason });
      const savedAppointment = await appointment.save();
      res.status(201).json({ message: 'Appointment created successfully', appointment: savedAppointment });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(400).json({ message: 'Error creating appointment', error: error.message });
    }
  };

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching appointments' });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating appointment' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting appointment' });
    }
};


exports.getLastWeekAppointmentCount = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    
    const appointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            interval: {
              $switch: {
                branches: [
                  { case: { $and: [{ $gte: [{ $hour: "$date" }, 0] }, { $lt: [{ $hour: "$date" }, 6] }] }, then: "00:00-06:00" },
                  { case: { $and: [{ $gte: [{ $hour: "$date" }, 6] }, { $lt: [{ $hour: "$date" }, 12] }] }, then: "06:00-12:00" },
                  { case: { $and: [{ $gte: [{ $hour: "$date" }, 12] }, { $lt: [{ $hour: "$date" }, 18] }] }, then: "12:00-18:00" },
                  { case: { $and: [{ $gte: [{ $hour: "$date" }, 18] }, { $lt: [{ $hour: "$date" }, 24] }] }, then: "18:00-24:00" }
                ]
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1, "_id.interval": 1 }
      }
    ]);

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching appointment count', error: error.message });
  }
};

