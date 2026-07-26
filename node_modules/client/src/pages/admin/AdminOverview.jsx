import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Users,
  Package,
  MapPin,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalPackages: 0,
    totalDestinations: 0,
    totalReviews: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, bookingsRes, pkgRes, destRes, revRes] = await Promise.allSettled([
          api.get('/users?limit=1'),
          api.get('/bookings?limit=10'),
          api.get('/packages?limit=1'),
          api.get('/destinations?limit=1'),
          api.get('/testimonials'),
        ]);

        const usersCount = usersRes.status === 'fulfilled' ? usersRes.value.data.data?.pagination?.totalUsers || 0 : 0;
        const bookingsData = bookingsRes.status === 'fulfilled' ? bookingsRes.value.data.data || [] : [];
        const bookingsCount = bookingsRes.status === 'fulfilled' ? bookingsRes.value.data.pagination?.totalBookings || bookingsData.length : 0;
        const pkgCount = pkgRes.status === 'fulfilled' ? pkgRes.value.data.pagination?.totalPackages || 0 : 0;
        const destCount = destRes.status === 'fulfilled' ? destRes.value.data.count || 0 : 0;
        const revCount = revRes.status === 'fulfilled' ? revRes.value.data.data?.length || 0 : 0;

        // Exclude cancelled bookings from revenue total
        const calculatedRevenue = bookingsData
          .filter(b => b.bookingStatus !== 'cancelled' && b.status !== 'cancelled')
          .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

        setStats({
          totalUsers: usersCount,
          totalBookings: bookingsCount,
          totalRevenue: calculatedRevenue,
          totalPackages: pkgCount,
          totalDestinations: destCount,
          totalReviews: revCount,
        });

        setRecentBookings(bookingsData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard overview stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-navy-dark via-navy-light to-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Console Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">Real-time booking metrics, revenue stats, and system activity.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center">
            <TrendingUp size={14} className="mr-1.5 text-emerald-400" />
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* 6 Key Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Stat Card 1: Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Users</p>
            <p className="text-xl font-extrabold mt-1 text-slate-800 dark:text-white">{stats.totalUsers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
        </div>

        {/* Stat Card 2: Bookings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bookings</p>
            <p className="text-xl font-extrabold mt-1 text-slate-800 dark:text-white">{stats.totalBookings}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-accent/10 text-orange-accent flex items-center justify-center font-bold">
            <CalendarCheck size={20} />
          </div>
        </div>

        {/* Stat Card 3: Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
            <p className="text-xl font-extrabold mt-1 text-emerald-500">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <IndianRupee size={20} />
          </div>
        </div>

        {/* Stat Card 4: Packages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Packages</p>
            <p className="text-xl font-extrabold mt-1 text-slate-800 dark:text-white">{stats.totalPackages}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Package size={20} />
          </div>
        </div>

        {/* Stat Card 5: Destinations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destinations</p>
            <p className="text-xl font-extrabold mt-1 text-slate-800 dark:text-white">{stats.totalDestinations}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <MapPin size={20} />
          </div>
        </div>

        {/* Stat Card 6: Reviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reviews</p>
            <p className="text-xl font-extrabold mt-1 text-slate-800 dark:text-white">{stats.totalReviews}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

      </div>

      {/* SVG Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Chart (SVG) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Monthly Booking Trends</h3>
              <p className="text-[11px] text-slate-400">Recorded bookings and revenue trajectory</p>
            </div>
            <span className="text-xs font-bold text-orange-accent bg-orange-accent/10 px-2.5 py-1 rounded-xl">
              2026 Analytics
            </span>
          </div>

          <div className="h-48 w-full pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A623" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="500" y2="30" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />

              <path
                d="M 0 120 Q 80 40, 160 80 T 320 30 T 500 70 L 500 140 L 0 140 Z"
                fill="url(#gradient)"
              />
              <path
                d="M 0 120 Q 80 40, 160 80 T 320 30 T 500 70"
                fill="none"
                stroke="#F5A623"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="120" r="4" fill="#F5A623" />
              <circle cx="120" cy="65" r="4" fill="#F5A623" />
              <circle cx="240" cy="70" r="4" fill="#F5A623" />
              <circle cx="320" cy="30" r="5" fill="#0B2447" stroke="#F5A623" strokeWidth="3" />
              <circle cx="500" cy="70" r="4" fill="#F5A623" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-1">Quick Admin Actions</h3>
            <p className="text-[11px] text-slate-400 mb-4">Direct shortcuts to key modules</p>

            <div className="space-y-2.5">
              <a href="/admin/packages" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-accent/10 hover:border-orange-accent/40 border border-slate-200 dark:border-slate-700/60 transition group text-xs font-bold">
                <span className="flex items-center text-slate-700 dark:text-slate-200 group-hover:text-orange-accent">
                  <Package size={15} className="mr-2" /> Add New Tour Package
                </span>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-orange-accent" />
              </a>

              <a href="/admin/bookings" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-accent/10 hover:border-orange-accent/40 border border-slate-200 dark:border-slate-700/60 transition group text-xs font-bold">
                <span className="flex items-center text-slate-700 dark:text-slate-200 group-hover:text-orange-accent">
                  <CalendarCheck size={15} className="mr-2" /> Process Customer Bookings
                </span>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-orange-accent" />
              </a>

              <a href="/admin/users" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-accent/10 hover:border-orange-accent/40 border border-slate-200 dark:border-slate-700/60 transition group text-xs font-bold">
                <span className="flex items-center text-slate-700 dark:text-slate-200 group-hover:text-orange-accent">
                  <Users size={15} className="mr-2" /> Manage User Accounts
                </span>
                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-orange-accent" />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
            Dhanish Travel Co. &copy; 2026 Admin Portal
          </div>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Recent Customer Bookings</h3>
            <p className="text-[11px] text-slate-400">Latest reservations placed across the portal</p>
          </div>
          <a href="/admin/bookings" className="text-xs font-bold text-navy-light dark:text-orange-accent hover:underline">
            View All Bookings &rarr;
          </a>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading recent bookings...</div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No recent bookings found. Real data will appear when customers book tours.</div>
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
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {recentBookings.map((b) => {
                  const statusVal = b.bookingStatus || b.status || 'pending';
                  const isCancelled = statusVal === 'cancelled';

                  return (
                    <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-orange-accent">{b.bookingRef}</td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200">{b.user?.name || 'Customer'}</td>
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          statusVal === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                          isCancelled ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {statusVal}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminOverview;
