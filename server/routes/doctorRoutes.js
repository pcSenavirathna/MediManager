const express = require('express');
const {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  searchDoctorById,
} = require('../controllers/doctorController');

const router = express.Router();

router.post('/', createDoctor);
router.get('/', getAllDoctors);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);
router.get('/:id', searchDoctorById);

module.exports = router;
