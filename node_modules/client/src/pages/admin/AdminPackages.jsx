import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Package, Plus, Search, Edit3, Trash2, Star, Upload, X } from 'lucide-react';

const AdminPackages = () => {
  const { showToast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Domestic',
    durationDays: 3,
    durationNights: 2,
    price: 9999,
    discountPrice: 8499,
    featured: false,
    overview: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000'],
    inclusions: ['Hotels', 'Meals', 'Sightseeing'],
    exclusions: ['Flights', 'Personal Expenses'],
    itinerary: [{ day: 1, title: 'Arrival & Welcome', desc: 'Transfer to hotel and leisure evening.' }],
  });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/packages?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setPackages(res.data.data.packages);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [search]);

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditPackage(pkg);
      setFormData({
        title: pkg.title || '',
        category: pkg.category || 'Domestic',
        durationDays: pkg.duration?.days || pkg.durationDays || 3,
        durationNights: pkg.duration?.nights || pkg.durationNights || 2,
        price: pkg.price || 0,
        discountPrice: pkg.discountPrice || 0,
        featured: pkg.featured || false,
        overview: pkg.description || pkg.overview || '',
        description: pkg.description || pkg.overview || '',
        images: pkg.images && pkg.images.length > 0 ? pkg.images : ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000'],
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        itinerary: pkg.itinerary || [],
      });
    } else {
      setEditPackage(null);
      setFormData({
        title: '',
        category: 'Domestic',
        durationDays: 3,
        durationNights: 2,
        price: 9999,
        discountPrice: 8499,
        featured: false,
        overview: '',
        description: '',
        images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000'],
        inclusions: ['Hotels', 'Meals', 'Sightseeing'],
        exclusions: ['Flights', 'Personal Expenses'],
        itinerary: [{ day: 1, title: 'Arrival & Welcome', desc: 'Transfer to hotel and leisure evening.' }],
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
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.data.url],
        }));
        showToast('Image uploaded successfully', 'success');
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
      const descText = formData.description || formData.overview || formData.title || 'Tour package details.';
      const payload = {
        ...formData,
        description: descText,
        overview: descText,
        destinationRoute: formData.title || 'India',
      };

      if (editPackage) {
        const res = await api.put(`/packages/${editPackage._id}`, payload);
        if (res.data.success) {
          showToast('Package updated successfully', 'success');
          fetchPackages();
        }
      } else {
        const res = await api.post('/packages', payload);
        if (res.data.success) {
          showToast('Package created successfully', 'success');
          fetchPackages();
        }
      }
      setShowModal(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save package', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/packages/${deleteId}`);
      if (res.data.success) {
        showToast('Package deleted successfully', 'success');
        setPackages(packages.filter((p) => p._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete package', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <Package className="mr-2 text-orange-accent" size={22} /> Tour Packages Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Create, edit, and update tour packages & itinerary days.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs rounded-xl pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-light dark:text-white"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={15} />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center bg-orange-accent text-navy-dark font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition shadow-md shrink-0"
          >
            <Plus size={16} className="mr-1.5" /> Add Package
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading tour packages...</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No packages found. Click "Add Package" to create your first package.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img
                      src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000'}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-navy-dark/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                      {pkg.category}
                    </div>
                    {pkg.featured && (
                      <div className="absolute top-3 right-3 bg-orange-accent text-navy-dark text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center shadow">
                        <Star size={12} className="mr-1 fill-navy-dark" /> Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white line-clamp-1">{pkg.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{pkg.description || pkg.overview}</p>
                    
                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="font-bold text-slate-400">{pkg.duration?.days || pkg.durationDays || 3}D / {pkg.duration?.nights || pkg.durationNights || 2}N</span>
                      <div className="text-right">
                        {pkg.discountPrice > 0 && (
                          <span className="text-[10px] text-slate-400 line-through mr-1.5">₹{pkg.price?.toLocaleString()}</span>
                        )}
                        <span className="font-extrabold text-sm text-emerald-500">₹{(pkg.discountPrice || pkg.price)?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-200/60 dark:border-slate-700/40 mt-3 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(pkg)}
                    className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition text-xs font-bold flex items-center"
                  >
                    <Edit3 size={14} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(pkg._id)}
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

      {/* Add / Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full my-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                {editPackage ? 'Edit Tour Package' : 'Add New Tour Package'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kashmir Paradise Honeymoon Special"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Religious">Religious</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Package Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || formData.overview}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value, overview: e.target.value })}
                  placeholder="Comprehensive tour description..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Image Upload Integration */}
              <div>
                <label className="font-bold text-slate-500 block mb-1">Package Images (Multer / Cloudinary)</label>
                <div className="flex items-center space-x-3 mb-2">
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                    <Upload size={14} className="mr-1.5" /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" disabled={uploading} />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700">
                      <img src={img} alt="Package" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-orange-accent focus:ring-0"
                />
                <label htmlFor="featured" className="font-bold text-slate-700 dark:text-slate-200">
                  Mark as Featured Package on Homepage
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold rounded-xl bg-orange-accent text-navy-dark hover:bg-yellow-500 shadow-md"
                >
                  {editPackage ? 'Update Package' : 'Create Package'}
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
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete Tour Package?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to delete this package listing?</p>
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

export default AdminPackages;
