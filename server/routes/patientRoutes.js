const express = require('express');
const {
  createPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
  getPatientById,
  getPatientByEmail
} = require('../controllers/patientController');

const router = express.Router();

router.post('/', createPatient);
router.get('/', getAllPatients);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);
router.get('/:id', getPatientById);
router.get('/email/:email', getPatientByEmail);

module.exports = router;
