import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CalendarCheck, Search, Eye, CheckCircle, XCircle, Clock, X, User } from 'lucide-react';

const AdminBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/bookings/${id}/status`, { status, bookingStatus: status });
      if (res.data.success) {
        showToast(`Booking status updated to ${status}`, 'success');
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, bookingStatus: status, status } : b))
        );
        if (selectedBooking?._id === id) {
          setSelectedBooking((prev) => ({ ...prev, bookingStatus: status, status }));
        }
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update booking status', 'error');
    }
  };

  const formatTravelDate = (travelDate) => {
    if (!travelDate) return 'Flexible';
    if (typeof travelDate === 'string') {
      const parsed = new Date(travelDate);
      return isNaN(parsed.getTime()) ? 'Flexible' : parsed.toLocaleDateString();
    }
    if (travelDate.start) {
      const parsed = new Date(travelDate.start);
      return isNaN(parsed.getTime()) ? 'Flexible' : parsed.toLocaleDateString();
    }
    return 'Flexible';
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.bookingRef?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.package?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <CalendarCheck className="mr-2 text-orange-accent" size={22} /> Customer Bookings Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Track, confirm, and update travel reservations.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by ref, customer, or package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-light dark:text-white"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No customer bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Booking Ref</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Tour Package</th>
                  <th className="py-3 px-3">Travel Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Booking Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {filteredBookings.map((b) => {
                  const currentStatus = b.bookingStatus || b.status || 'pending';
                  const isCancelled = currentStatus === 'cancelled';

                  return (
                    <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-orange-accent">{b.bookingRef}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{b.user?.name || 'Customer'}</p>
                        <p className="text-[10px] text-slate-400">{b.user?.email}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{b.package?.title || 'Tour Package'}</td>
                      <td className="py-3 px-3 text-slate-500">{formatTravelDate(b.travelDate)}</td>
                      <td className="py-3 px-3 font-bold">
                        {isCancelled ? (
                          <div>
                            <span className="line-through text-slate-400 font-normal mr-1 text-[11px]">₹{b.totalAmount?.toLocaleString()}</span>
                            <span className="font-extrabold text-rose-500">₹0</span>
                          </div>
                        ) : (
                          <span className="text-emerald-500 font-extrabold">₹{b.totalAmount?.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={`border rounded-lg text-[11px] px-2 py-1 font-bold focus:outline-none ${
                            currentStatus === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : isCancelled
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition font-bold text-xs inline-flex items-center"
                        >
                          <Eye size={14} className="mr-1" /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                  Booking #{selectedBooking.bookingRef}
                </h3>
                <p className="text-[10px] text-slate-400">Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1">
                <p className="font-bold text-slate-500 uppercase text-[10px]">Customer Info</p>
                <p className="font-bold text-slate-800 dark:text-white">{selectedBooking.user?.name}</p>
                <p className="text-slate-400">{selectedBooking.user?.email} • {selectedBooking.user?.phone}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1">
                <p className="font-bold text-slate-500 uppercase text-[10px]">Tour Details</p>
                <p className="font-bold text-slate-800 dark:text-white">{selectedBooking.package?.title}</p>
                <p className="text-slate-400">Travel Date: {formatTravelDate(selectedBooking.travelDate)}</p>
                <p className="text-slate-400">Travelers: {selectedBooking.travelers?.length || 1} Persons</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1">
                <p className="font-bold text-slate-500 uppercase text-[10px]">Payment Summary</p>
                <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                  <span>Total Payable Amount</span>
                  {(selectedBooking.bookingStatus === 'cancelled' || selectedBooking.status === 'cancelled') ? (
                    <span className="text-rose-500 font-extrabold">₹0 (Cancelled)</span>
                  ) : (
                    <span className="text-emerald-500 font-extrabold">₹{selectedBooking.totalAmount?.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Payment Status: {selectedBooking.paymentStatus || 'Pending'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-navy-dark text-white hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBookings;
