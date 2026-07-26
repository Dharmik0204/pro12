const express = require('express');
const { getLegalPage, updateLegalPage } = require('../controllers/legalController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getLegalPage)
  .put(protect, adminOnly, updateLegalPage);

module.exports = router;
