import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Compass, Calendar, MapPin, Award, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const DestinationDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/destinations/${slug}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setDest(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load destination:', err);
        setError('Destination not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-light"></div>
      </div>
    );
  }

  if (error || !dest) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-screen">
        <p className="text-red-500 font-bold">{error || 'Destination not found'}</p>
        <button onClick={() => navigate('/destinations')} className="mt-4 bg-navy-light text-white px-5 py-2.5 rounded-xl">
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[350px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${dest.images[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'})` }}>
        <div className="absolute inset-0 bg-navy-dark/65"></div>
        <div className="relative text-center text-white max-w-4xl mx-auto px-4 z-10">
          <span className="bg-orange-accent/20 text-orange-400 border border-orange-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {dest.country} {dest.state ? `• ${dest.state}` : ''}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-3">{dest.name} Travel Guide</h1>
          <p className="text-gray-300 text-sm mt-3 max-w-xl mx-auto font-light">Explore tourist hotspots, best season guides, and linked packages.</p>
        </div>
      </section>

      {/* Main Content Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-navy-dark mb-4 flex items-center">
                <Compass size={18} className="text-orange-accent mr-2" /> Overview of {dest.name}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{dest.description}</p>
            </div>

            {/* Attractions & Things to Do */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-navy-dark mb-6 flex items-center">
                <Award size={18} className="text-orange-accent mr-2" /> Top Attractions & Things To Do
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Attractions</h4>
                  <ul className="space-y-2">
                    {dest.topAttractions.map((attr, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-600 font-semibold">
                        <CheckCircle2 size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{attr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Activities</h4>
                  <ul className="space-y-2">
                    {dest.thingsToDo.map((act, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-600 font-semibold">
                        <CheckCircle2 size={14} className="text-orange-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Itinerary Timeline */}
            {dest.sampleItinerary && dest.sampleItinerary.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-navy-dark mb-6">Sample Recommendation Itinerary</h2>
                <div className="relative border-l-2 border-slate-200 pl-6 ml-3 space-y-6">
                  {dest.sampleItinerary.map((day) => (
                    <div key={day.day} className="relative">
                      <span className="absolute -left-10 top-0.5 bg-navy-light text-white h-7 w-7 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                        {day.day}
                      </span>
                      <h4 className="text-xs font-bold text-navy-dark">Day {day.day} Recommended Activities</h4>
                      <ul className="list-disc list-inside text-xs text-slate-500 mt-1.5 space-y-1">
                        {day.activities.map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Quick stats cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-dark border-b border-slate-100 pb-3">Destination Details</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="block text-gray-400">Best Time to Visit</span>
                  <span className="font-semibold text-slate-700">{dest.bestTimeToVisit || 'All Year'}</span>
                </div>
                {dest.duration && (
                  <div>
                    <span className="block text-gray-400">Recommended Duration</span>
                    <span className="font-semibold text-slate-700">{dest.duration}</span>
                  </div>
                )}
                {dest.height && (
                  <div>
                    <span className="block text-gray-400">Altitude / Elevation</span>
                    <span className="font-semibold text-slate-700">{dest.height}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Tips Card */}
            {dest.travelTips && dest.travelTips.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-navy-dark border-b border-slate-100 pb-3 mb-3">Important Tips</h3>
                <ul className="space-y-2 text-xs text-slate-500">
                  {dest.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <ShieldCheck size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Linked Packages */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy-dark border-b border-slate-100 pb-3 mb-4">Related Tours</h3>
              
              {dest.linkedPackages && dest.linkedPackages.length > 0 ? (
                <div className="space-y-3">
                  {dest.linkedPackages.map((pkg) => (
                    <div key={pkg._id} className="border border-slate-100 p-3 rounded-xl flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-xs font-bold text-navy-dark truncate leading-snug">{pkg.title}</h4>
                        <span className="text-[10px] text-orange-600 font-bold block mt-0.5">₹{pkg.price.toLocaleString()}</span>
                      </div>
                      <Link 
                        to={`/packages/${pkg.slug}`} 
                        className="text-xs bg-navy-light text-white p-1.5 rounded-lg hover:bg-orange-accent hover:text-navy-dark transition ml-2 flex-shrink-0"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[11px] text-gray-400">No active packages connected to this destination. Enquire to customize!</p>
                  <Link to="/contact" className="mt-3 inline-block bg-orange-accent text-navy-dark text-[10px] font-bold px-3 py-1.5 rounded-full">
                    Custom Inquiry
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default DestinationDetail;
