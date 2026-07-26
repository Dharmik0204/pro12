import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { HelpCircle, Plus, Edit3, Trash2, X } from 'lucide-react';

const AdminFAQs = () => {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    topic: 'Booking & Payments',
    question: '',
    answer: '',
    order: 1,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faqs');
      if (res.data.success) {
        setFaqs(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditFaq(faq);
      setFormData({
        topic: faq.topic || 'Booking & Payments',
        question: faq.question || '',
        answer: faq.answer || '',
        order: faq.order || 1,
      });
    } else {
      setEditFaq(null);
      setFormData({
        topic: 'Booking & Payments',
        question: '',
        answer: '',
        order: 1,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editFaq) {
        const res = await api.put(`/faqs/${editFaq._id}`, formData);
        if (res.data.success) {
          showToast('FAQ updated successfully', 'success');
          setFaqs(faqs.map((f) => (f._id === editFaq._id ? res.data.data : f)));
        }
      } else {
        const res = await api.post('/faqs', formData);
        if (res.data.success) {
          showToast('FAQ created successfully', 'success');
          setFaqs([...faqs, res.data.data]);
        }
      }
      setShowModal(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save FAQ', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/faqs/${deleteId}`);
      if (res.data.success) {
        showToast('FAQ deleted successfully', 'success');
        setFaqs(faqs.filter((f) => f._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete FAQ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <HelpCircle className="mr-2 text-orange-accent" size={22} /> Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage support questions and answers grouped by topic.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-orange-accent text-navy-dark font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition shadow-md shrink-0"
        >
          <Plus size={16} className="mr-1.5" /> Add FAQ
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No FAQs found. Add your first FAQ.</div>
        ) : (
          <div className="space-y-4">
            {faqs.map((f) => (
              <div
                key={f._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="bg-navy-dark text-white dark:bg-orange-accent dark:text-navy-dark text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                    {f.topic}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-white pt-1">{f.question}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{f.answer}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleOpenModal(f)}
                    className="p-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(f._id)}
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                {editFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Topic Category</label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Booking & Payments, Visas, Cancellations"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How do I get my booking invoice?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed answer text..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold rounded-xl bg-orange-accent text-navy-dark hover:bg-yellow-500 shadow-md">
                  {editFaq ? 'Update FAQ' : 'Add FAQ'}
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
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete FAQ?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to remove this FAQ item?</p>
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

export default AdminFAQs;
