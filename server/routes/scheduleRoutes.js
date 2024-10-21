const express = require('express');
const {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');

const router = express.Router();

router.post('/', createSchedule);
router.get('/', getAllSchedules);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
