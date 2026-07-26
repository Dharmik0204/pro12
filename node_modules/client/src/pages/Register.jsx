import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = searchParams.get('from') || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, phone);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate(from);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-3xl shadow-lg space-y-6">
        
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-navy-dark">Create Your Account</h2>
          <p className="text-xs text-gray-500 mt-2">Join Dhanish Travel Co. for custom MERN travel experiences.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                name="name"
                required
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
              />
              <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                name="email"
                required
                placeholder="e.g. john@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
              />
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
            <div className="relative">
              <input 
                type="text" 
                name="phone"
                required
                placeholder="e.g. +91 8484859316"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
              />
              <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-accent text-navy-dark font-bold rounded-xl py-3 text-xs hover:bg-yellow-500 transition shadow flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Registering...' : <><UserPlus size={16} className="mr-2" /> Sign Up</>}
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          Already have an account? <Link to={`/login?from=${encodeURIComponent(from)}`} className="font-bold text-navy-light hover:text-orange-accent">Sign in</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
