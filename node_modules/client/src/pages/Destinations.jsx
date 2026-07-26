import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/destinations')
      .then((res) => {
        if (res.data && res.data.success) {
          setDestinations(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load destinations:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Dream Destinations</h1>
          <p className="text-gray-300 text-sm mt-3">Browse tourist hotspots, top attractions, and seasonal guidelines.</p>
        </div>
      </section>

      {/* Grid Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-light"></div>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-navy-dark">No Destinations Found</h3>
            <p className="text-xs text-slate-500 mt-1">Check back later once the admin registers tourist hotspots.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div key={dest._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col justify-between card-hover">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={dest.images[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'} 
                    alt={dest.name} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-navy-dark/80 text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                    {dest.country}
                  </span>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-navy-dark mb-2">{dest.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{dest.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 bg-slate-50 p-3 rounded-lg mb-4">
                      <div>
                        <span className="block text-gray-400 font-bold uppercase">Best Season</span>
                        <span className="font-semibold text-slate-700 truncate block">{dest.bestTimeToVisit || 'All Year'}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 font-bold uppercase">Ideal Stay</span>
                        <span className="font-semibold text-slate-700 truncate block">{dest.duration || '5-7 Days'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="text-xs text-orange-accent font-bold uppercase tracking-wider flex items-center">
                      <Compass size={14} className="mr-1" /> Guidebook
                    </span>
                    <Link 
                      to={`/destinations/${dest.slug}`}
                      className="text-xs font-bold text-navy-light hover:text-orange-accent transition flex items-center"
                    >
                      Read Details <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Destinations;
