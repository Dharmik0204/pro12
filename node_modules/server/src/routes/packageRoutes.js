const express = require('express');
const {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.route('/')
  .get(getPackages)
  .post(protect, adminOnly, createPackage);

router.route('/:id')
  .get(getPackageBySlug)
  .put(protect, adminOnly, updatePackage)
  .delete(protect, adminOnly, deletePackage);

module.exports = router;
