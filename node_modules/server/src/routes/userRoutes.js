const express = require('express');
const {
  getUsers,
  toggleBlockUser,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getUsers);
router.patch('/:id/block', toggleBlockUser);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
