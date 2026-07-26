const express = require('express');
const {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.route('/')
  .get(getBlogPosts)
  .post(protect, adminOnly, createBlogPost);

router.route('/:id')
  .get(getBlogPostBySlug)
  .put(protect, adminOnly, updateBlogPost)
  .delete(protect, adminOnly, deleteBlogPost);

module.exports = router;
