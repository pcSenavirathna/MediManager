const Ward = require('../models/Ward');

exports.createWard = async (req, res) => {
  try {
    const lastWard = await Ward.findOne().sort({ _id: -1 });
    const lastId = lastWard ? parseInt(lastWard.wardNo.slice(1)) : 0;
    const newId = `W${String(lastId + 1).padStart(3, '0')}`;

    const ward = new Ward({ ...req.body, wardNo: newId });
    await ward.save();
    res.status(201).json({ message: 'Ward created successfully', ward });
  } catch (error) {
    res.status(400).json({ message: 'Error creating ward', error: error.message });
  }
};

exports.getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find();
    res.status(200).json(wards);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching wards', error: error.message });
  }
};

exports.updateWard = async (req, res) => {
  try {
    const ward = await Ward.findOneAndUpdate({ wardNo: req.params.id }, req.body, { new: true });
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.status(200).json(ward);
  } catch (error) {
    res.status(400).json({ message: 'Error updating ward', error: error.message });
  }
};

exports.deleteWard = async (req, res) => {
  try {
    const ward = await Ward.findOneAndDelete({ wardNo: req.params.id });
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.status(200).json({ message: 'Ward deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting ward', error: error.message });
  }
};

exports.getWardById = async (req, res) => {
  try {
    const ward = await Ward.findOne({ wardNo: req.params.id });
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.status(200).json(ward);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching ward', error: error.message });
  }
};

exports.updateBedOccupancy = async (req, res) => {
  try {
    const { wardNo, bedNo, isOccupied, patientId } = req.body;
    const ward = await Ward.findOne({ wardNo });
    if (!ward) return res.status(404).json({ message: 'Ward not found' });

    const bed = ward.beds.find(b => b.bedNo === bedNo);
    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    bed.isOccupied = isOccupied;
    bed.patientId = patientId;

    await ward.save();
    res.status(200).json({ message: 'Bed occupancy updated successfully', ward });
  } catch (error) {
    res.status(400).json({ message: 'Error updating bed occupancy', error: error.message });
  }
};

exports.addBed = async (req, res) => {
    try {
      const { wardNo, rowNo, columnNo } = req.body;
      const ward = await Ward.findOne({ wardNo });
      if (!ward) return res.status(404).json({ message: 'Ward not found' });
  
      const bedNo = `${wardNo.slice(1)}${String(columnNo).padStart(2, '0')}${String(rowNo).padStart(2, '0')}`;
  
      if (ward.beds.some(bed => bed.bedNo === bedNo)) {
        return res.status(400).json({ message: 'Bed already exists in this ward' });
      }
  
      ward.beds.push({ bedNo, isOccupied: false });
      await ward.save();
      res.status(200).json({ message: 'Bed added successfully', ward });
    } catch (error) {
      res.status(400).json({ message: 'Error adding bed', error: error.message });
    }
  };
  
  exports.removeBed = async (req, res) => {
    try {
      const { wardNo, rowNo, columnNo } = req.body;
      const ward = await Ward.findOne({ wardNo });
      if (!ward) return res.status(404).json({ message: 'Ward not found' });
  
      const bedNo = `${wardNo.slice(1)}${String(columnNo).padStart(2, '0')}${String(rowNo).padStart(2, '0')}`;
  
      const bedIndex = ward.beds.findIndex(bed => bed.bedNo === bedNo);
      if (bedIndex === -1) return res.status(404).json({ message: 'Bed not found in this ward' });
  
      ward.beds.splice(bedIndex, 1);
      await ward.save();
      res.status(200).json({ message: 'Bed removed successfully', ward });
    } catch (error) {
      res.status(400).json({ message: 'Error removing bed', error: error.message });
    }
  };
  
  