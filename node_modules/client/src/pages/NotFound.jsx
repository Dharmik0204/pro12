import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <Compass size={64} className="mx-auto text-orange-accent animate-bounce" />
        <h1 className="text-4xl font-extrabold text-navy-dark">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The route or holiday destination you are searching for might have been relocated.
        </p>
        <div className="pt-4">
          <Link to="/" className="inline-flex items-center bg-navy-light text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-orange-accent hover:text-navy-dark transition shadow">
            <Home size={14} className="mr-1.5" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
