const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const asyncHandler = require('../utils/asyncHandler');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
const getBlogPosts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category && category !== 'All') {
    filter.category = category;
  }
  const posts = await BlogPost.find(filter).sort({ publishedAt: -1 });
  res.status(200).json({
    success: true,
    data: posts,
  });
});

// @desc    Get single blog post by slug or ID
// @route   GET /api/blog/:id
// @access  Public
const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const identifier = req.params.id;
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

  const post = await BlogPost.findOne({
    $or: isObjectId ? [{ _id: identifier }, { slug: identifier }] : [{ slug: identifier }],
  });

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  // Increment views
  post.views = (post.views || 0) + 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Create a blog post (admin only)
// @route   POST /api/blog
// @access  Private/Admin
const createBlogPost = asyncHandler(async (req, res) => {
  const { title, category, excerpt, content, coverImage, author } = req.body;

  const slug = generateSlug(title || 'blog-post');

  const post = await BlogPost.create({
    title,
    slug,
    category: category || 'Travel Guide',
    excerpt: excerpt || content?.slice(0, 120) || 'Travel article.',
    content: content || 'Article content.',
    coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000',
    author: author || 'Admin',
  });

  res.status(201).json({
    success: true,
    data: post,
    message: 'Blog post created successfully',
  });
});

// @desc    Update a blog post (admin only)
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (req.body.title && req.body.title !== post.title) {
    req.body.slug = generateSlug(req.body.title);
  }

  const updatedPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedPost,
    message: 'Blog post updated successfully',
  });
});

// @desc    Delete a blog post (admin only)
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  await BlogPost.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Blog post deleted successfully',
  });
});

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
