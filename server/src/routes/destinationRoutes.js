const express = require('express');
const {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.route('/')
  .get(getDestinations)
  .post(protect, adminOnly, createDestination);

router.route('/:id')
  .get(getDestinationBySlug)
  .put(protect, adminOnly, updateDestination)
  .delete(protect, adminOnly, deleteDestination);

module.exports = router;
