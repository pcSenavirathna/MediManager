const Staff = require('../models/Staff');
const auth = require('./authController');

exports.createStaff = async (req, res) => {
  const { name, email, phone, role } = req.body;
  try {
    const staff = new Staff({ name, email, phone, role });
    let password = Math.random().toString(36).slice(2, 8);
    await auth.register(email, password, 'Staff');
    await staff.save();
    res.status(201).json({ message: 'Staff member created successfully', staffId: staff.staffId });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error creating staff member' });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {

    res.status(400).json({ message: 'Error fetching staff' });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ message: 'Error updating staff' });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Staff member deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting staff member' });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching staff member' });
  }
};
