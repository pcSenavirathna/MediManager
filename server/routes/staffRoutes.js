const express = require('express');
const {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  getStaffById,
} = require('../controllers/staffController');

const router = express.Router();

router.post('/', createStaff);
router.get('/', getAllStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
router.get('/:id', getStaffById);

module.exports = router;


