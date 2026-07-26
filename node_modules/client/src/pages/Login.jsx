import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const redirectMsg = searchParams.get('message');
  const from = searchParams.get('from') || '/dashboard';

  useEffect(() => {
    // If already logged in, redirect away
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : from);
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    } else {
      // Navigate on success
      navigate(from);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-3xl shadow-lg space-y-6">
        
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-navy-dark">Sign In to Your Account</h2>
          <p className="text-xs text-gray-500 mt-2">Manage your bookings, invoices, and travel packages.</p>
        </div>

        {redirectMsg === 'session_expired' && (
          <div className="bg-orange-accent/15 border border-orange-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-orange-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>Your session expired. Please sign in again.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center">
              <input type="checkbox" id="remember-me" className="h-4 w-4 text-navy-light focus:ring-navy-light border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 text-slate-500">Remember me</label>
            </div>
            <Link to="/forgot-password" className="font-semibold text-navy-light hover:text-orange-accent">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-accent text-navy-dark font-bold rounded-xl py-3 text-xs hover:bg-yellow-500 transition shadow flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : <><LogIn size={16} className="mr-2" /> Sign In</>}
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          New to Dhanish Travel Co.? <Link to={`/register?from=${encodeURIComponent(from)}`} className="font-bold text-navy-light hover:text-orange-accent">Create account</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
