import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Star, ShieldCheck, CheckCircle2, XCircle, Clock, Utensils, Hotel, Car } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import api from '../services/api';

const PackageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { selectPackage, travelDate, handleStartDateChange, travelerCount, setTravelerCount, pricing } = useBooking();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/packages/${slug}`)
      .then((res) => {
        if (res.data && res.data.success) {
          const packageData = res.data.data;
          setPkg(packageData);
          const firstImg = packageData.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
          setActiveImage(firstImg);
          selectPackage(packageData);

          // Set default start date to tomorrow if not set
          if (!travelDate.start) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            handleStartDateChange(tomorrow.toISOString().split('T')[0]);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load package details:', err);
        setError('Failed to retrieve package information.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleBookNow = () => {
    if (!travelDate.start) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      handleStartDateChange(tomorrow.toISOString().split('T')[0]);
    }
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-light"></div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-screen">
        <p className="text-red-500 font-bold">{error || 'Package not found'}</p>
        <button onClick={() => navigate('/packages')} className="mt-4 bg-navy-light text-white px-5 py-2.5 rounded-xl font-bold">
          Back to Packages
        </button>
      </div>
    );
  }

  const tabs = ['Overview', 'Itinerary', 'Inclusions & Exclusions', 'Hotels & Transit', 'Meals & FAQs'];

  const basePrice = pkg.discountPrice > 0 ? pkg.discountPrice : (pkg.price || 0);

  const imagesList = (pkg.images && pkg.images.length > 0) ? pkg.images : [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
  ];

  const highlightsList = (pkg.highlights && pkg.highlights.length > 0) ? pkg.highlights : [
    'Premium Accommodations Included',
    'Guided Sightseeing & Local Transfers',
    'Daily Breakfast at Resort / Hotel',
    'Dedicated Travel Support Manager'
  ];

  const itineraryList = (pkg.itinerary && pkg.itinerary.length > 0) ? pkg.itinerary : [
    { day: 1, title: 'Arrival & Welcome', description: 'Check-in to hotel and leisure evening sightseeing.', overnightAt: 'Hotel' }
  ];

  const inclusionsList = (pkg.inclusions && pkg.inclusions.length > 0) ? pkg.inclusions : [
    'Hotel Accommodations',
    'Daily Breakfast',
    'Private Vehicle Transfers',
    'Sightseeing & Driver Allowances'
  ];

  const exclusionsList = (pkg.exclusions && pkg.exclusions.length > 0) ? pkg.exclusions : [
    'Airfare / Train Tickets',
    'Personal Shopping & Tips',
    'Optional Entry Tickets'
  ];

  const hotelsList = (pkg.hotels && pkg.hotels.length > 0) ? pkg.hotels : [
    'Premium 4-Star Resort / Deluxe Hotel'
  ];

  const durationDays = pkg.duration?.days || pkg.durationDays || 3;
  const durationNights = pkg.duration?.nights || pkg.durationNights || 2;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner & Gallery */}
      <section className="bg-white border-b border-slate-100 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            <Link to="/packages" className="hover:underline">Packages</Link>
            <span>&bull;</span>
            <span className="text-navy-light font-medium">{pkg.category || 'Tour'}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-dark leading-tight">{pkg.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="bg-orange-accent/15 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {pkg.badge || pkg.category || 'SPECIAL'}
              </span>
              <p className="text-xs text-gray-500 flex items-center">
                <MapPin size={14} className="mr-1 text-slate-400" /> {pkg.destinationRoute || pkg.title}
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-sm">
              <Star size={16} className="text-orange-accent fill-orange-accent" />
              <span className="font-bold text-navy-dark">{pkg.rating || 5}</span>
              <span className="text-gray-400">({pkg.reviewCount || 12} reviews)</span>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div className="lg:col-span-2 h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img src={activeImage || imagesList[0]} alt={pkg.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:h-[400px] overflow-y-auto no-scrollbar pr-1">
              {imagesList.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`h-24 sm:h-28 lg:h-[120px] rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img ? 'border-orange-accent shadow-md scale-98' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Sidebar Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Info Columns */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Tabs Header */}
            <div className="bg-white border border-slate-100 rounded-xl p-2 flex overflow-x-auto no-scrollbar space-x-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'bg-navy-light text-white' 
                      : 'text-slate-500 hover:text-navy-dark hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content displays */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy-dark mb-3">About this holiday package</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{pkg.description || pkg.overview}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-dark mb-3">Package Highlights</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {highlightsList.map((high, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-600">
                          <CheckCircle2 size={16} className="text-orange-accent mr-2.5 mt-0.5 flex-shrink-0" />
                          <span>{high}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: ITINERARY */}
              {activeTab === 'Itinerary' && (
                <div>
                  <h3 className="text-lg font-bold text-navy-dark mb-6">Day-Wise Tour Itinerary</h3>
                  <div className="relative border-l-2 border-slate-200 pl-6 ml-3 space-y-8">
                    {itineraryList.map((day, idx) => (
                      <div key={day.day || idx} className="relative">
                        <span className="absolute -left-10 top-0.5 bg-orange-accent text-navy-dark h-8 w-8 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {day.day || (idx + 1)}
                        </span>
                        <h4 className="text-base font-bold text-navy-dark">Day {day.day || (idx + 1)}: {day.title}</h4>
                        {day.overnightAt && (
                          <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 mb-2 uppercase">
                            Overnight: {day.overnightAt}
                          </span>
                        )}
                        <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{day.description || day.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
              {activeTab === 'Inclusions & Exclusions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-base font-bold text-green-700 mb-4 flex items-center">
                      <CheckCircle2 className="mr-2" size={18} /> What is Included
                    </h3>
                    <ul className="space-y-3">
                      {inclusionsList.map((inc, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-600">
                          <span className="bg-green-100 text-green-700 p-0.5 rounded-full mr-2.5 flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                          </span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-red-700 mb-4 flex items-center">
                      <XCircle className="mr-2" size={18} /> What is Excluded
                    </h3>
                    <ul className="space-y-3">
                      {exclusionsList.map((exc, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-600">
                          <span className="bg-red-100 text-red-700 p-0.5 rounded-full mr-2.5 flex-shrink-0 mt-0.5">
                            <XCircle size={12} fill="currentColor" className="text-white" />
                          </span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: HOTELS & TRANSIT */}
              {activeTab === 'Hotels & Transit' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-navy-dark mb-4 flex items-center">
                      <Hotel className="text-orange-accent mr-2" size={18} /> Hotel Accommodation
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">Recommended hotels or resorts selected for this itinerary:</p>
                    <ul className="space-y-2">
                      {hotelsList.map((hot, i) => (
                        <li key={i} className="bg-slate-50 border rounded-xl p-3 text-xs text-slate-600 font-semibold flex items-center">
                          <Hotel size={14} className="text-slate-400 mr-2.5" /> {hot}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-base font-bold text-navy-dark mb-3 flex items-center">
                      <Car className="text-orange-accent mr-2" size={18} /> Transportation & Transfers
                    </h3>
                    <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border leading-relaxed">
                      {pkg.transportation || 'Sightseeing transfers will be managed via private AC vehicles with dedicated drivers.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: MEALS & FAQS */}
              {activeTab === 'Meals & FAQs' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-navy-dark mb-3 flex items-center">
                      <Utensils className="text-orange-accent mr-2" size={18} /> Meals Plan
                    </h3>
                    <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border leading-relaxed">
                      {pkg.meals || 'Breakfast is included daily at all hotels. Lunch and Dinner rules apply as per the MAP/CP itineraries.'}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-base font-bold text-navy-dark mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {[
                        { q: 'Is travel insurance included in the package?', a: 'Basic travel insurance cover is optional and can be checked under add-ons during checkout.' },
                        { q: 'Can I choose different hotels?', a: 'Yes. Enquire from our support to customize hotel selections to 4-star or 5-star properties.' }
                      ].map((item, i) => (
                        <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                          <h4 className="text-xs font-bold text-navy-dark mb-1">{item.q}</h4>
                          <p className="text-xs text-gray-500">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Sticky booking side widget column */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 bg-white border border-slate-100 p-6 rounded-2xl shadow-lg space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  {pkg.price > basePrice && (
                    <span className="text-[10px] text-gray-400 line-through">₹{pkg.price?.toLocaleString()}</span>
                  )}
                  <p className="text-2xl font-extrabold text-navy-light">
                    ₹{basePrice.toLocaleString()}
                    <span className="text-xs text-gray-400 font-normal"> / person</span>
                  </p>
                </div>
                <div className="bg-orange-accent/10 px-3 py-1.5 rounded-lg text-center">
                  <span className="block text-xs font-bold text-orange-600">{durationDays}D / {durationNights}N</span>
                </div>
              </div>

              {/* Date Input */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 mb-1 flex items-center">
                  <Calendar size={14} className="mr-1 text-orange-accent" /> Select Travel Date
                </label>
                <input 
                  type="date" 
                  value={travelDate.start || ''}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                {travelDate.end && (
                  <span className="text-[10px] text-slate-400 mt-1">
                    Ending Date: <strong className="text-slate-600">{new Date(travelDate.end).toDateString()}</strong>
                  </span>
                )}
              </div>

              {/* Traveler count input */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 mb-1 flex items-center">
                  <Users size={14} className="mr-1 text-orange-accent" /> Count of Travelers
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
              </div>

              {/* Pricing breakdown summary */}
              <div className="bg-slate-50 p-4 rounded-xl border space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Base Price</span>
                  <span>₹{basePrice.toLocaleString()} &times; {travelerCount}</span>
                </div>
                <div className="flex justify-between font-extrabold text-navy-dark pt-2 border-t border-slate-200">
                  <span>Subtotal Amount</span>
                  <span>₹{(basePrice * travelerCount).toLocaleString()}</span>
                </div>
              </div>

              {/* Call to action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBookNow}
                  className="w-full bg-orange-accent text-navy-dark font-bold rounded-xl py-3 text-xs hover:bg-yellow-500 transition shadow active:scale-95 flex items-center justify-center"
                >
                  Book Online Now
                </button>
                <Link
                  to="/contact?subject=Tour Inquiry"
                  className="w-full border border-slate-300 text-navy-dark font-semibold rounded-xl py-3 text-xs hover:bg-slate-50 transition text-center block"
                >
                  Enquire Details
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center text-[10px] text-gray-400 space-x-2">
                <ShieldCheck size={14} className="text-green-500" />
                <span>SSL Secured & Verified checkout</span>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PackageDetail;
