const express = require('express');
const {
    createAppointment, deleteAppointment, getAllAppointments, updateAppointment, getLastWeekAppointmentCount
} = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/count', getLastWeekAppointmentCount);

module.exports = router;
