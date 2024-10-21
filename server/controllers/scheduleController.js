const Schedule = require('../models/Schedule');

exports.createSchedule = async (req, res) => {
  const { staffId, date, shiftStart, shiftEnd } = req.body;
  try {
    const schedule = new Schedule({ staffId, date, shiftStart, shiftEnd });
    await schedule.save();
    res.status(201).json({ message: 'Schedule created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating schedule' });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('staffId', 'name email phone role staffId');
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching schedules' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ message: 'Error updating schedule' });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting schedule' });
  }
};
