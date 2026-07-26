import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CreditCard, Search, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const AdminPayments = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (id) => {
    try {
      const res = await api.patch(`/bookings/${id}/status`, { status: 'cancelled', paymentStatus: 'refunded' });
      if (res.data.success) {
        showToast('Payment marked as refunded', 'success');
        setPayments(payments.map((p) => (p._id === id ? { ...p, status: 'cancelled', paymentStatus: 'refunded' } : p)));
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to process refund', 'error');
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.bookingRef?.toLowerCase().includes(search.toLowerCase()) ||
      p.razorpayPaymentId?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <CreditCard className="mr-2 text-orange-accent" size={22} /> Payment Transactions & Refunds
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Razorpay payment logs, transaction IDs, and refund statuses.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search transaction ID or Ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-light dark:text-white"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading payment transactions...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No payment transactions recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Booking Ref</th>
                  <th className="py-3 px-3">Payment ID / Gateway</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-orange-accent">{p.bookingRef}</td>
                    <td className="py-3 px-3">
                      <p className="font-mono text-slate-800 dark:text-slate-200">{p.razorpayPaymentId || 'pay_sim_99841'}</p>
                      <p className="text-[10px] text-slate-400">Razorpay Gateway</p>
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{p.user?.name || 'Customer'}</td>
                    <td className="py-3 px-3 font-bold text-emerald-500">₹{p.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.paymentStatus === 'refunded' ? 'bg-purple-500/10 text-purple-500' :
                        p.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {p.paymentStatus || (p.status === 'confirmed' ? 'Paid' : 'Pending')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {p.paymentStatus !== 'refunded' && (
                        <button
                          onClick={() => handleRefund(p._id)}
                          className="p-1.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition font-bold text-xs inline-flex items-center"
                        >
                          <RefreshCw size={13} className="mr-1" /> Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPayments;
