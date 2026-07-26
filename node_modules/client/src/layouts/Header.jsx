import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Packages', path: '/packages' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Reviews', path: '/testimonials' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group py-2">
            <img 
              src={logoImg} 
              alt="Dhanish Travel Co. Logo" 
              className="h-16 sm:h-18 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 py-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-accent after:transition-all after:duration-250 ${
                    isActive 
                      ? 'text-orange-accent after:w-full' 
                      : 'text-gray-300 hover:text-white after:w-0 hover:after:w-full'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* User Section (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-navy-light px-4 py-2 rounded-full hover:bg-slate-800 transition focus:outline-none border border-slate-700"
                >
                  <UserIcon size={18} className="text-orange-accent" />
                  <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white text-slate-800 shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <LayoutDashboard size={16} className="mr-2 text-navy-light" />
                      My Bookings
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-orange-600 font-medium transition"
                      >
                        <LayoutDashboard size={16} className="mr-2 text-orange-accent" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-accent text-navy-dark px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-yellow-500 transition shadow-md hover:shadow-lg transform active:scale-95"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-light border-t border-slate-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-navy-dark text-orange-accent font-semibold border-l-4 border-orange-accent' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <hr className="border-slate-800 my-3" />
          {user ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs text-gray-400">
                Logged in as <strong className="text-white">{user.name}</strong>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
              >
                My Bookings
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-orange-accent hover:bg-slate-800"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center px-4 py-2.5 border border-slate-700 text-base font-medium rounded-lg text-white hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center px-4 py-2.5 bg-orange-accent text-navy-dark text-base font-medium rounded-lg hover:bg-yellow-500 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
