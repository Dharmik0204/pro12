import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, FileText, MessageSquare, Star, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Package Form State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [newPackage, setNewPackage] = useState({
    title: '',
    category: 'Domestic',
    description: '',
    price: '',
    discountPrice: '',
    destinationRoute: '',
    days: 5,
    nights: 4,
    badge: 'BEST SELLER',
    image: '',
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/bookings').catch(() => ({ data: { data: [] } })),
      api.get('/packages?limit=100').catch(() => ({ data: { data: { packages: [] } } })),
      api.get('/destinations').catch(() => ({ data: { data: [] } })),
      api.get('/contact').catch(() => ({ data: { data: [] } })),
      api.get('/testimonials/admin').catch(() => ({ data: { data: [] } })),
    ]).then(([bRes, pRes, dRes, mRes, tRes]) => {
      if (bRes.data?.success) setBookings(bRes.data.data);
      if (pRes.data?.success) setPackages(pRes.data.data.packages || []);
      if (dRes.data?.success) setDestinations(dRes.data.data);
      if (mRes.data?.success) setMessages(mRes.data.data);
      if (tRes.data?.success) setTestimonials(tRes.data.data);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border rounded-2xl p-8 max-w-md text-center shadow-sm space-y-4">
          <ShieldAlert className="mx-auto text-red-500" size={48} />
          <h2 className="text-lg font-bold text-navy-dark">Access Denied</h2>
          <p className="text-xs text-slate-500">You must be logged in as an Administrator to view this console.</p>
        </div>
      </div>
    );
  }

  // Handle status update for bookings
  const handleUpdateBooking = async (bookingId, paymentStatus, bookingStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { paymentStatus, bookingStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  // Delete Package
  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete package');
    }
  };

  // Create Package
  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newPackage.title,
        category: newPackage.category,
        description: newPackage.description,
        price: Number(newPackage.price),
        discountPrice: Number(newPackage.discountPrice) || 0,
        destinationRoute: newPackage.destinationRoute,
        duration: { days: Number(newPackage.days), nights: Number(newPackage.nights) },
        images: newPackage.image ? [newPackage.image] : ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'],
        badge: newPackage.badge,
        highlights: ['Guided tours', 'Hotel stays included'],
        inclusions: ['Breakfast & Dinner', 'Private Cab'],
        exclusions: ['Flight fare'],
      };

      const res = await api.post('/packages', payload);
      if (res.data?.success) {
        alert('Package created successfully!');
        setShowPackageModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create package');
    }
  };

  // Approve testimonial
  const handleApproveTestimonial = async (id, isApproved) => {
    try {
      await api.put(`/testimonials/${id}`, { isApproved: !isApproved });
      fetchData();
    } catch (err) {
      alert('Failed to update testimonial');
    }
  };

  const navItems = [
    { id: 'bookings', label: 'Bookings', count: bookings.length, icon: <FileText size={16} /> },
    { id: 'packages', label: 'Packages', count: packages.length, icon: <Package size={16} /> },
    { id: 'destinations', label: 'Destinations', count: destinations.length, icon: <MapPin size={16} /> },
    { id: 'messages', label: 'Messages', count: messages.length, icon: <MessageSquare size={16} /> },
    { id: 'testimonials', label: 'Reviews', count: testimonials.length, icon: <Star size={16} /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <section className="bg-navy-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="bg-orange-accent text-navy-dark text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">Admin Control Panel</span>
            <h1 className="text-2xl font-extrabold mt-1">WanderVista Management</h1>
          </div>
          <button
            onClick={() => setShowPackageModal(true)}
            className="bg-orange-accent text-navy-dark font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-yellow-500 transition flex items-center shadow"
          >
            <Plus size={16} className="mr-1.5" /> Add Tour Package
          </button>
        </div>
      </section>

      {/* Main Console */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Tabs */}
        <div className="bg-white border rounded-xl p-2 flex overflow-x-auto no-scrollbar space-x-2 shadow-sm mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeTab === item.id 
                  ? 'bg-navy-light text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              <span className="bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-dark mb-4">All Customer Bookings</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b font-bold uppercase text-[10px]">
                    <th className="p-3">Ref</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Package</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-navy-dark">{b.bookingRef}</td>
                      <td className="p-3">{b.user?.name || 'User'} ({b.user?.email})</td>
                      <td className="p-3 font-semibold">{b.package?.title}</td>
                      <td className="p-3 font-bold">₹{b.totalAmount.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{b.bookingStatus}</td>
                      <td className="p-3 space-x-2">
                        {b.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handleUpdateBooking(b._id, 'paid', 'confirmed')}
                            className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded hover:bg-green-700"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Packages Management */}
        {activeTab === 'packages' && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-navy-dark">Active Tour Packages</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg._id} className="border rounded-xl p-4 space-y-3 relative bg-slate-50">
                  <img src={pkg.images[0]} alt="" className="h-36 w-full object-cover rounded-lg" />
                  <h4 className="font-bold text-xs text-navy-dark">{pkg.title}</h4>
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>₹{pkg.price.toLocaleString()}</span>
                    <span className="text-orange-600">{pkg.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePackage(pkg._id)}
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs py-1.5 rounded-lg flex items-center justify-center border border-red-200"
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Contact Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-dark mb-4">Customer Inquiries</h3>
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m._id} className="border rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-navy-dark">
                    <span>{m.name} ({m.email}) &bull; {m.phone}</span>
                    <span className="text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-orange-600">Subject: {m.subject}</h4>
                  <p className="text-xs text-slate-600">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* Create Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm text-navy-dark">Create New Package</h3>
              <button onClick={() => setShowPackageModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">X</button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newPackage.title}
                  onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select 
                    value={newPackage.category}
                    onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2"
                  >
                    {['Domestic', 'International', 'Honeymoon', 'Family', 'Group', 'Weekend', 'Adventure', 'Pilgrimage', 'Corporate', 'Customized'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Badge</label>
                  <select 
                    value={newPackage.badge}
                    onChange={(e) => setNewPackage({ ...newPackage, badge: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2"
                  >
                    {['BEST SELLER', 'POPULAR', 'TRENDING', 'FAMILY PICK', ''].map(b => (
                      <option key={b} value={b}>{b || 'None'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Discount Price (₹)</label>
                  <input 
                    type="number" 
                    value={newPackage.discountPrice}
                    onChange={(e) => setNewPackage({ ...newPackage, discountPrice: e.target.value })}
                    className="w-full bg-slate-50 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Destination Route</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Srinagar - Gulmarg"
                  value={newPackage.destinationRoute}
                  onChange={(e) => setNewPackage({ ...newPackage, destinationRoute: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={newPackage.image}
                  onChange={(e) => setNewPackage({ ...newPackage, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea 
                  rows="3"
                  required
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  className="w-full bg-slate-50 border rounded-lg p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-accent text-navy-dark font-bold text-xs py-2.5 rounded-lg hover:bg-yellow-500"
              >
                Create Package
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
