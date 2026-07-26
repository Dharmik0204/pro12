import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/admin');
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id, currentApproved) => {
    try {
      const res = await api.patch(`/testimonials/${id}/approve`, { isApproved: !currentApproved });
      if (res.data.success) {
        showToast(`Review ${!currentApproved ? 'approved' : 'hidden'}`, 'success');
        setReviews(reviews.map((r) => (r._id === id ? { ...r, isApproved: !currentApproved } : r)));
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update review status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/testimonials/${deleteId}`);
      if (res.data.success) {
        showToast('Review deleted successfully', 'success');
        setReviews(reviews.filter((r) => r._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <MessageSquare className="mr-2 text-orange-accent" size={22} /> Customer Reviews & Testimonials
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Approve, reject, or delete ratings and travel reviews.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No reviews submitted yet.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white">{r.name}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          className={idx < (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{r.message || r.comment || r.reviewText}</p>
                  <p className="text-[10px] text-slate-400 font-bold">Tour: {r.tourTaken || 'General Tour'} • Source: {r.source || 'Website'}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleToggleApprove(r._id, r.isApproved)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center ${
                      r.isApproved
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                    }`}
                  >
                    {r.isApproved ? (
                      <><CheckCircle2 size={14} className="mr-1" /> Approved</>
                    ) : (
                      <><XCircle size={14} className="mr-1" /> Pending Approval</>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteId(r._id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete Review?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to permanently remove this customer review?</p>
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

export default AdminReviews;
