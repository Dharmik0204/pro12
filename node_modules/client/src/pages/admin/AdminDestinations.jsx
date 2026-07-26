import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MapPin, Plus, Search, Edit3, Trash2, Upload, X } from 'lucide-react';

const AdminDestinations = () => {
  const { showToast } = useToast();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDest, setEditDest] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    country: 'India',
    state: '',
    bestTimeToVisit: 'October to March',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000',
    description: '',
    topAttractions: ['Historical Monuments', 'Local Markets'],
  });

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/destinations');
      if (res.data.success) {
        setDestinations(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load destinations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenModal = (dest = null) => {
    if (dest) {
      setEditDest(dest);
      setFormData({
        title: dest.name || dest.title || '',
        country: dest.country || 'India',
        state: dest.state || '',
        bestTimeToVisit: dest.bestTimeToVisit || 'October to March',
        image: dest.images?.[0] || dest.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000',
        description: dest.description || '',
        topAttractions: dest.topAttractions || ['Historical Monuments'],
      });
    } else {
      setEditDest(null);
      setFormData({
        title: '',
        country: 'India',
        state: '',
        bestTimeToVisit: 'October to March',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000',
        description: '',
        topAttractions: ['Historical Monuments', 'Scenic Views'],
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
        setFormData((prev) => ({ ...prev, image: res.data.url }));
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
      const payload = {
        name: formData.title,
        title: formData.title,
        country: formData.country,
        state: formData.state,
        bestTimeToVisit: formData.bestTimeToVisit,
        description: formData.description,
        image: formData.image,
        images: [formData.image],
        topAttractions: formData.topAttractions,
      };

      if (editDest) {
        const res = await api.put(`/destinations/${editDest._id}`, payload);
        if (res.data.success) {
          showToast('Destination updated successfully', 'success');
          fetchDestinations();
        }
      } else {
        const res = await api.post('/destinations', payload);
        if (res.data.success) {
          showToast('Destination added successfully', 'success');
          fetchDestinations();
        }
      }
      setShowModal(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save destination', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/destinations/${deleteId}`);
      if (res.data.success) {
        showToast('Destination deleted successfully', 'success');
        setDestinations(destinations.filter((d) => d._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete destination', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <MapPin className="mr-2 text-orange-accent" size={22} /> Destinations Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage travel destinations, locations, and top attractions.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-orange-accent text-navy-dark font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition shadow-md shrink-0"
        >
          <Plus size={16} className="mr-1.5" /> Add Destination
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading travel destinations...</div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No destinations found. Add your first destination.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <div
                key={d._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img src={d.images?.[0] || d.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000'} alt={d.name || d.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-navy-dark/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {d.country} {d.state ? `• ${d.state}` : ''}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{d.name || d.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{d.description}</p>
                    <p className="text-[10px] text-orange-accent font-bold">Best Time: {d.bestTimeToVisit}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end space-x-2 border-t border-slate-200/60 dark:border-slate-700/40 mt-2">
                  <button
                    onClick={() => handleOpenModal(d)}
                    className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition text-xs font-bold flex items-center"
                  >
                    <Edit3 size={14} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(d._id)}
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

      {/* Add / Edit Destination Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                {editDest ? 'Edit Destination' : 'Add New Destination'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Manali, Himachal Pradesh"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">State / Region</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Himachal Pradesh"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Best Time To Visit</label>
                <input
                  type="text"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                  placeholder="e.g. September to May"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Destination Image</label>
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                    <Upload size={14} className="mr-1.5" /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" disabled={uploading} />
                  </label>
                  {formData.image && <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-xl object-cover" />}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold rounded-xl bg-orange-accent text-navy-dark hover:bg-yellow-500 shadow-md">
                  {editDest ? 'Update Destination' : 'Add Destination'}
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
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete Destination?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to delete this destination?</p>
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

export default AdminDestinations;
