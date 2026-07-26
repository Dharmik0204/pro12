import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 rounded-3xl shadow-lg space-y-6">
        
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-navy-dark">Recover Password</h2>
          <p className="text-xs text-gray-500 mt-2">Enter your email and we'll send recovery links.</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 size={36} className="text-green-500 mx-auto" />
            <h4 className="text-xs font-bold text-green-800">Recovery email dispatched!</h4>
            <p className="text-[11px] text-green-700 leading-relaxed">Check your mailbox for instructions to configure a new credential pass.</p>
            <Link to="/login" className="inline-block text-xs font-bold text-navy-light hover:text-orange-accent pt-2">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-accent text-navy-dark font-bold rounded-xl py-3 text-xs hover:bg-yellow-500 transition shadow"
            >
              Send Reset Code
            </button>
          </form>
        )}

        <div className="text-center border-t border-slate-100 pt-4">
          <Link to="/login" className="inline-flex items-center text-xs font-semibold text-navy-light hover:text-orange-accent">
            <ArrowLeft size={14} className="mr-1.5" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
