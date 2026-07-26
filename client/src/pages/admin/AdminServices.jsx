import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Plus, Edit3, Trash2, CheckCircle2, X, Compass, Plane, Hotel, ShieldCheck, Bus, Train, ShieldAlert } from 'lucide-react';

const availableIcons = ['Plane', 'Hotel', 'Compass', 'ShieldCheck', 'Bus', 'Train', 'Briefcase'];

const AdminServices = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    icon: 'Plane',
    category: 'Travel Service',
    isActive: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (srv = null) => {
    if (srv) {
      setEditService(srv);
      setFormData({
        title: srv.title || '',
        desc: srv.desc || '',
        icon: srv.icon || 'Plane',
        category: srv.category || 'Travel Service',
        isActive: srv.isActive !== undefined ? srv.isActive : true,
      });
    } else {
      setEditService(null);
      setFormData({
        title: '',
        desc: '',
        icon: 'Plane',
        category: 'Travel Service',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editService) {
        const res = await api.put(`/services/${editService._id}`, formData);
        if (res.data.success) {
          showToast('Service updated successfully', 'success');
          setServices(services.map((s) => (s._id === editService._id ? res.data.data : s)));
        }
      } else {
        const res = await api.post('/services', formData);
        if (res.data.success) {
          showToast('Service added successfully', 'success');
          setServices([res.data.data, ...services]);
        }
      }
      setShowModal(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save service', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/services/${deleteId}`);
      if (res.data.success) {
        showToast('Service deleted successfully', 'success');
        setServices(services.filter((s) => s._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete service', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <Briefcase className="mr-2 text-orange-accent" size={22} /> Services Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage 12 custom travel services offered by Dhanish Travel Co.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-orange-accent text-navy-dark font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition shadow-md shrink-0"
        >
          <Plus size={16} className="mr-1.5" /> Add Service
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading travel services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No services found. Click "Add Service" to create one.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-accent/10 text-orange-accent flex items-center justify-center font-bold">
                      <Briefcase size={20} />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      srv.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {srv.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{srv.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{srv.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                  <button
                    onClick={() => handleOpenModal(srv)}
                    className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition text-xs font-bold flex items-center"
                  >
                    <Edit3 size={14} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(srv._id)}
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                {editService ? 'Edit Travel Service' : 'Add Travel Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Flight Ticketing Assistance"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Detailed service explanation..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-orange-accent focus:ring-0"
                />
                <label htmlFor="isActive" className="font-bold text-slate-700 dark:text-slate-200">
                  Service is Active and Visible to Customers
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold rounded-xl bg-orange-accent text-navy-dark hover:bg-yellow-500 shadow-md">
                  {editService ? 'Update Service' : 'Add Service'}
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
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete Travel Service?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to remove this service offering?</p>
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

export default AdminServices;
