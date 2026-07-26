import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import {
  LayoutDashboard,
  Users,
  Package,
  MapPin,
  Briefcase,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  HelpCircle,
  CalendarCheck,
  CreditCard,
  Mail,
  Settings,
  Sun,
  Moon,
  Search,
  Bell,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Packages', path: '/admin/packages', icon: Package },
  { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
  { name: 'Services', path: '/admin/services', icon: Briefcase },
  { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Blog', path: '/admin/blog', icon: FileText },
  { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Enquiries', path: '/admin/enquiries', icon: Mail },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('adminDarkMode') === 'true';
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminDarkMode', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar */}
      <aside
        className={`bg-navy-dark text-white border-r border-slate-800 transition-all duration-300 flex flex-col z-30 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <img src={logoImg} alt="Dhanish Travel Co." className="h-12 w-auto object-contain" />
            </div>
          ) : (
            <img src={logoImg} alt="Dhanish Travel Co." className="mx-auto h-9 w-auto object-contain" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white transition hidden md:block ml-auto"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-orange-accent text-navy-dark font-bold shadow-md shadow-orange-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className={`shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Quick Profile */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate leading-tight">
                <p className="text-xs font-bold truncate text-white">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className={`h-16 border-b flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-md ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
        }`}>
          {/* Global Search Bar */}
          <div className="relative w-64 md:w-80">
            <input
              type="text"
              placeholder="Search packages, bookings, users..."
              className={`w-full text-xs rounded-xl pl-9 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-navy-light ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            
            {/* View Live Website Button */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                darkMode
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span>Live Site</span>
              <ExternalLink size={13} />
            </a>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className={`p-2 rounded-xl border relative transition ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-accent rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-accent rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border p-4 z-50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-700/50">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider">Notifications</h4>
                    <span className="text-[10px] bg-orange-accent/20 text-orange-accent px-2 py-0.5 rounded-full font-bold">
                      3 New
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      <p className="font-bold">New Booking Received</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Booking #DTC-884920 for Goa Honeymoon Tour.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      <p className="font-bold">New User Registered</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">meet.patel@gmail.com joined Dhanish Travel.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      <p className="font-bold">Review Pending Approval</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">5-star rating submitted by Rahul S.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-accent flex items-center justify-center text-navy-dark font-extrabold text-xs shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border p-2 z-50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
                }`}>
                  <div className="p-2.5 border-b border-slate-700/50 mb-1">
                    <p className="text-xs font-bold">{user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full text-left flex items-center px-3 py-2 text-xs font-semibold rounded-xl hover:bg-slate-800/50 transition"
                  >
                    <Settings size={14} className="mr-2" /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 text-xs font-semibold text-rose-500 rounded-xl hover:bg-rose-500/10 transition mt-1"
                  >
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Main View */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
