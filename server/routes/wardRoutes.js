const express = require('express');
const {
  createWard,
  getAllWards,
  updateWard,
  deleteWard,
  getWardById,
  updateBedOccupancy,
  addBed,
  removeBed
} = require('../controllers/wardController');

const router = express.Router();

router.post('/', createWard);
router.get('/', getAllWards);
router.put('/:id', updateWard);
router.delete('/:id', deleteWard);
router.get('/:id', getWardById);
router.put('/bed/occupancy', updateBedOccupancy);
router.post('/bed', addBed);
router.delete('/bed', removeBed);

module.exports = router;