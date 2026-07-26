import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Package, FileText, Printer, Mail, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my-bookings')
      .then((res) => {
        if (res.data && res.data.success) {
          setBookings(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user bookings:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    api.get('/contact/my-inquiries')
      .then((res) => {
        if (res.data && res.data.success) {
          setInquiries(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user inquiries:', err);
      })
      .finally(() => {
        setInquiriesLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <section className="bg-navy-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-orange-accent text-xs font-bold uppercase tracking-wider">User Portal</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name}!</h1>
              <p className="text-xs text-gray-300 mt-1">{user?.email} &bull; Phone: {user?.phone}</p>
            </div>
            <div className="bg-navy-light border border-slate-700 px-5 py-3 rounded-2xl text-center">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Total Bookings</span>
              <span className="text-xl font-extrabold text-white">{bookings.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-lg font-bold text-navy-dark mb-6 flex items-center">
          <FileText className="text-orange-accent mr-2" size={20} /> My Booking History & Invoices
        </h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-light"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <Package size={42} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-navy-dark">No Active Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1">You haven't booked any holiday tours yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="bg-navy-dark text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                      REF: {b.bookingRef}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                      b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Payment: {b.paymentStatus}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                      Status: {b.bookingStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-dark">{b.package?.title || 'Tour Package'}</h3>
                  
                  <div className="flex flex-wrap items-center text-xs text-slate-500 gap-4">
                    <span className="flex items-center"><Calendar size={14} className="mr-1 text-slate-400" /> Start: {new Date(b.travelDate.start).toDateString()}</span>
                    <span className="flex items-center"><Package size={14} className="mr-1 text-slate-400" /> Travelers: {b.travelers.length} Persons</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-400 block">Total Charged</span>
                    <span className="text-lg font-extrabold text-navy-light">INR {b.totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={() => window.print()}
                    className="mt-2 text-xs border border-slate-200 text-navy-dark px-3 py-1.5 rounded-lg hover:bg-slate-50 font-semibold flex items-center"
                  >
                    <Printer size={12} className="mr-1" /> Invoice
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Service Inquiries & Admin Replies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-lg font-bold text-navy-dark mb-6 flex items-center">
          <Mail className="text-orange-accent mr-2" size={20} /> My Service Inquiries & Responses
        </h2>

        {inquiriesLoading ? (
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-light"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
            <MessageSquare size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-navy-dark">No Inquiries Yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Submit a service enquiry from Contact or Services page using your account email ({user?.email}).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-navy-dark">{inq.subject}</h3>
                    <span className="text-[10px] text-slate-400 flex items-center mt-1">
                      <Clock size={12} className="mr-1" />
                      Sent: {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    inq.status === 'replied'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inq.status === 'replied' ? 'Answered' : 'Pending'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Your Message</p>
                  <p className="text-xs text-slate-600">{inq.message}</p>
                </div>

                {inq.adminReply ? (
                  <div className="bg-orange-accent/5 border border-orange-accent/20 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-orange-600 uppercase mb-1 flex items-center">
                      <CheckCircle2 size={12} className="mr-1" /> Admin Response
                    </p>
                    <p className="text-xs text-slate-700">{inq.adminReply}</p>
                    {inq.repliedAt && (
                      <span className="text-[10px] text-slate-400 block mt-2">
                        Replied: {new Date(inq.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Waiting for admin response. You will see the reply here once our team responds.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default UserDashboard;
