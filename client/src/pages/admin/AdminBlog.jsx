import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FileText, Plus, Search, Edit3, Trash2, Upload, X } from 'lucide-react';

const AdminBlog = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Travel Guide',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000',
    author: 'Dhanish Travel Team',
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog');
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (b = null) => {
    if (b) {
      setEditBlog(b);
      setFormData({
        title: b.title || '',
        category: b.category || 'Travel Guide',
        excerpt: b.excerpt || '',
        content: b.content || '',
        coverImage: b.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000',
        author: b.author || 'Dhanish Travel Team',
      });
    } else {
      setEditBlog(null);
      setFormData({
        title: '',
        category: 'Travel Guide',
        excerpt: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000',
        author: 'Dhanish Travel Team',
      });
    }
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, coverImage: res.data.url }));
        showToast('Cover image uploaded successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBlog) {
        const res = await api.put(`/blog/${editBlog._id}`, formData);
        if (res.data.success) {
          showToast('Blog article updated successfully', 'success');
          setBlogs(blogs.map((b) => (b._id === editBlog._id ? res.data.data : b)));
        }
      } else {
        const res = await api.post('/blog', formData);
        if (res.data.success) {
          showToast('Blog article created successfully', 'success');
          setBlogs([res.data.data, ...blogs]);
        }
      }
      setShowModal(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save blog post', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/blog/${deleteId}`);
      if (res.data.success) {
        showToast('Blog article deleted successfully', 'success');
        setBlogs(blogs.filter((b) => b._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete blog post', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <FileText className="mr-2 text-orange-accent" size={22} /> Blog & Articles Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Publish travel guides, tips, and promotional stories.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-orange-accent text-navy-dark font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition shadow-md shrink-0"
        >
          <Plus size={16} className="mr-1.5" /> Add Blog Post
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading blog posts...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No blog posts found. Click "Add Blog Post" to publish one.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div
                key={b._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-navy-dark/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {b.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white line-clamp-1">{b.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{b.excerpt || b.content}</p>
                    <p className="text-[10px] text-slate-400 font-bold">By {b.author} • {new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end space-x-2 border-t border-slate-200/60 dark:border-slate-700/40 mt-2">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition text-xs font-bold flex items-center"
                  >
                    <Edit3 size={14} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(b._id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition text-xs font-bold flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                {editBlog ? 'Edit Blog Article' : 'Add Blog Article'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 10 Essential Travel Tips for Kashmir Trip"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Short Excerpt</label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for card preview..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Article Body Content</label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full article body text..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Cover Image</label>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                    <Upload size={14} className="mr-1.5" /> {uploading ? 'Uploading...' : 'Upload Cover'}
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" disabled={uploading} />
                  </label>
                  {formData.coverImage && <img src={formData.coverImage} alt="Cover" className="w-10 h-10 rounded-xl object-cover" />}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold rounded-xl bg-orange-accent text-navy-dark hover:bg-yellow-500 shadow-md">
                  {editBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete Blog Article?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to delete this published article?</p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBlog;
