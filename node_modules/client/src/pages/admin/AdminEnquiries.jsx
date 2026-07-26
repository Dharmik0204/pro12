import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Mail, Search, Reply, Trash2, CheckCircle2, X } from 'lucide-react';

const AdminEnquiries = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMsg, setReplyMsg] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendReply = async () => {
    if (!replyText.trim() || !replyMsg) return;
    try {
      const res = await api.patch(`/contact/${replyMsg._id}`, {
        status: 'replied',
        replyMessage: replyText.trim(),
      });
      if (res.data.success) {
        showToast(res.data.message || `Reply sent successfully to ${replyMsg.email}`, 'success');
        setMessages(messages.map((m) => (
          m._id === replyMsg._id
            ? { ...m, status: 'replied', adminReply: replyText.trim(), repliedAt: new Date().toISOString() }
            : m
        )));
        setReplyMsg(null);
        setReplyText('');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send reply', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/contact/${deleteId}`);
      if (res.data.success) {
        showToast('Inquiry deleted successfully', 'success');
        setMessages(messages.filter((m) => m._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete inquiry', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <Mail className="mr-2 text-orange-accent" size={22} /> Customer Inquiries & Service Requests
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">View user inquiries submitted via the website contact form.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading customer inquiries...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No contact inquiries found. Inquiries submitted by users on the website will appear here instantly.</div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m._id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white">{m.name}</span>
                    <span className="text-[11px] text-slate-400">({m.email} • {m.phone})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      m.status === 'replied' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-accent/10 text-orange-accent border border-orange-accent/20'
                    }`}>
                      {m.status || 'pending'}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-orange-accent">{m.subject || 'General Inquiry'}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{m.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">Received on: {new Date(m.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setReplyMsg(m)}
                    className="px-3 py-1.5 rounded-xl bg-orange-accent/10 text-orange-accent font-bold text-xs hover:bg-orange-accent/20 transition flex items-center"
                  >
                    <Reply size={14} className="mr-1" /> Reply
                  </button>
                  <button
                    onClick={() => setDeleteId(m._id)}
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

      {/* Reply Modal */}
      {replyMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                Reply to {replyMsg.name}
              </h3>
              <button onClick={() => setReplyMsg(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <p className="font-bold text-slate-400 text-[10px]">Original Inquiry:</p>
                <p className="text-slate-700 dark:text-slate-200 mt-0.5">{replyMsg.message}</p>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Your Official Response Email</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official response..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button onClick={() => setReplyMsg(null)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                Cancel
              </button>
              <button onClick={handleSendReply} className="px-5 py-2 text-xs font-extrabold rounded-xl bg-orange-accent text-navy-dark hover:bg-yellow-500 shadow-md">
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete Inquiry?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to remove this message?</p>
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

export default AdminEnquiries;
