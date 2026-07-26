import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Compass, ShieldCheck, Award, HeartHandshake, ArrowRight, Star, Calendar, Users, MapPin } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  // Search Widget State
  const [searchParams, setSearchParams] = useState({
    destination: '',
    category: 'All',
    date: '',
    travelers: '1',
  });

  useEffect(() => {
    // Fetch packages for featured section
    api.get('/packages?limit=6')
      .then(res => {
        if (res.data?.success && res.data.data?.packages) {
          setPackages(res.data.data.packages);
        }
      })
      .catch(err => console.log('Failed to fetch packages:', err.message));

    // Fetch destinations
    api.get('/destinations')
      .then(res => {
        if (res.data?.success && res.data.data) {
          setDestinations(res.data.data.slice(0, 6));
        }
      })
      .catch(err => console.log('Failed to fetch destinations:', err.message));

    // Fetch testimonials
    api.get('/testimonials')
      .then(res => {
        if (res.data?.success && res.data.data) {
          setTestimonials(res.data.data.slice(0, 3));
        }
      })
      .catch(err => console.log('Failed to fetch testimonials:', err.message));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.destination) query.set('search', searchParams.destination);
    if (searchParams.category && searchParams.category !== 'All') query.set('category', searchParams.category);
    navigate(`/packages?${query.toString()}`);
  };

  const categories = [
    'All', 'Domestic', 'International', 'Honeymoon', 'Family', 'Group', 'Weekend', 'Adventure', 'Pilgrimage', 'Corporate', 'Customized'
  ];

  return (
    <div className="overflow-x-hidden">
      
      {/* 1. Hero Section with Search Widget */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/60"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none mb-6"
          >
            Explore The World With <span className="text-orange-accent">Dhanish Travel Co.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light"
          >
            Discover handpicked premium tour packages, luxury accommodations, and customized travel itineraries tailored just for you.
          </motion.p>

          {/* Search Widget */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-800 text-left max-w-5xl mx-auto border border-white/20"
          >
            {/* Input 1: Destination */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                <MapPin size={12} className="mr-1 text-orange-accent" /> Destination
              </label>
              <input 
                type="text" 
                placeholder="Where to go?" 
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light focus:border-transparent"
              />
            </div>

            {/* Input 2: Travel Type */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                <Compass size={12} className="mr-1 text-orange-accent" /> Travel Type
              </label>
              <select
                value={searchParams.category}
                onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light focus:border-transparent"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Input 3: Travel Date */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                <Calendar size={12} className="mr-1 text-orange-accent" /> Travel Date
              </label>
              <input 
                type="date" 
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full bg-orange-accent text-navy-dark font-bold rounded-xl py-3 flex items-center justify-center hover:bg-yellow-500 transition shadow-md hover:shadow-lg transform active:scale-95"
              >
                <Search size={18} className="mr-2" /> Search
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* 2. Services summary row */}
      <section className="py-12 bg-navy-dark text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Visa Assistance', val: 'Fast & Secure' },
              { label: 'Hotel Bookings', val: '5-Star Lodging' },
              { label: 'Corporate Tours', val: 'MICE Excellence' },
              { label: 'Foreign Exchange', val: 'Best Forex Rates' },
            ].map((srv, idx) => (
              <div key={idx} className="p-4 border-r last:border-0 border-slate-800">
                <p className="text-orange-accent font-bold text-lg sm:text-xl">{srv.val}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{srv.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Tour Packages */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Top Offers</span>
              <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1">Featured Holiday Packages</h2>
            </div>
            <Link to="/packages" className="mt-4 md:mt-0 flex items-center text-sm font-semibold text-navy-light hover:text-orange-accent transition">
              View All Packages <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 flex flex-col card-hover">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover" 
                  />
                  {pkg.featured && (
                    <span className="absolute top-4 left-4 bg-orange-accent text-navy-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                      FEATURED
                    </span>
                  )}
                  <span className="absolute top-4 right-4 bg-navy-dark/85 text-white text-xs px-2.5 py-1 rounded-md font-semibold uppercase">
                    {pkg.category}
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1 text-slate-400" /> {pkg.duration?.days || 3} Days / {pkg.duration?.nights || 2} Nights
                    </div>
                    <h3 className="text-lg font-bold text-navy-dark mb-1 leading-snug">{pkg.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{pkg.destinationRoute || pkg.title}</p>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between border-t border-slate-100 pt-4 mt-2">
                      <div>
                        {pkg.discountPrice > 0 ? (
                          <>
                            <span className="text-xs text-gray-400 line-through">₹{pkg.price?.toLocaleString()}</span>
                            <p className="text-lg font-extrabold text-navy-light">₹{pkg.discountPrice?.toLocaleString()}<span className="text-xs text-gray-400 font-normal"> / person</span></p>
                          </>
                        ) : (
                          <p className="text-lg font-extrabold text-navy-light">₹{pkg.price?.toLocaleString()}<span className="text-xs text-gray-400 font-normal"> / person</span></p>
                        )}
                      </div>
                      <Link 
                        to={`/packages/${pkg.slug}`} 
                        className="bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-orange-accent hover:text-navy-dark transition duration-300"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Destinations Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Dream Destinations</span>
            <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1">Explore Popular Hotspots</h2>
            <p className="text-slate-500 text-sm mt-3">Travel to the most breathtaking locations around the globe with our certified guides.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(destinations.length > 0 ? destinations : [
              { name: 'Kashmir', images: ['https://images.unsplash.com/photo-1598305372100-877a4a762820?auto=format&fit=crop&w=600&q=80'], slug: 'kashmir' },
              { name: 'Bali', images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80'], slug: 'bali' },
              { name: 'Maldives', images: ['https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80'], slug: 'maldives' },
            ]).map((dest, idx) => (
              <Link 
                key={dest._id || idx} 
                to={`/destinations/${dest.slug}`} 
                className="group relative h-80 rounded-2xl overflow-hidden shadow-md flex items-end p-6 transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${dest.images?.[0] || dest.image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="relative text-white z-10">
                  <h3 className="text-xl font-bold">{dest.name || dest.title}</h3>
                  <p className="text-xs text-gray-300 mt-1 flex items-center">
                    Discover attractions <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Unmatched Standards</span>
              <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1 mb-6">Why Holiday Seekers Trust Dhanish Travel Co.</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                We craft journeys of lifetime comfort. From securing visa permits instantly to selecting certified resorts, our dedicated travel professionals ensure zero hiccups during your vacation.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Best Price Guarantee', desc: 'Premium luxury tours at competitive packages, with no hidden rates.', icon: <Award size={20} className="text-white" /> },
                  { title: 'Secure Payments', desc: 'Encrypted tokenized Razorpay gateway for seamless double confirmations.', icon: <ShieldCheck size={20} className="text-white" /> },
                  { title: '24/7 Expert Support', desc: 'Real-time booking support via Dedicated helpline or WhatsApp chats.', icon: <HeartHandshake size={20} className="text-white" /> }
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="bg-navy-light rounded-full p-2.5 mr-4 flex-shrink-0">
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-navy-dark">{feat.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80" 
                alt="Traveller with map" 
                className="rounded-3xl shadow-xl w-full h-[450px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block max-w-[200px] text-center">
                <span className="block text-4xl font-extrabold text-orange-accent">15+</span>
                <span className="text-xs font-bold text-navy-dark uppercase tracking-wide">Years of Travel Expertise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Special Offers Banner */}
      <section className="py-16 bg-navy-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80")' }}></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <span className="bg-orange-accent text-navy-dark font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Limited Time Offer</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">Get Flat 15% Off On Your Next Honeymoon Tour</h2>
          <p className="text-gray-300 text-sm mt-3 max-w-lg mx-auto">Use coupon code <strong className="text-orange-accent text-base">WANDER15</strong> on the booking flow to activate the instant discount. Valid for first 50 travelers only.</p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/packages?category=Honeymoon" className="bg-orange-accent text-navy-dark px-6 py-3 rounded-full text-sm font-semibold hover:bg-yellow-500 transition shadow-md active:scale-95">
              Explore Packages
            </Link>
            <Link to="/contact" className="border border-slate-600 px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition">
              Enquire Details
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Testimonials block */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1">What Happy Travelers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(testimonials.length > 0 ? testimonials : [
              { name: 'Rahul Sharma', location: 'Delhi, India', message: 'Our Kashmir honeymoon was perfectly managed by Dhanish Travel Co. The houseboat was beautiful, the food was delicious, and the driver was extremely helpful.', rating: 5, tourTaken: 'Splendors of Kashmir' },
              { name: 'Sophia Patel', location: 'Mumbai, India', message: 'The Bali trip was amazing. Kelingking Beach was breathtaking, and the private pool villa in Seminyak was clean and luxurious.', rating: 5, tourTaken: 'Tropical Bali Getaway' },
              { name: 'Amit Verma', location: 'Bangalore, India', message: 'Highly satisfied with the Kerala family package. Kids loved the Alleppey backwaters houseboat stay. Will book again with Dhanish Travel Co!', rating: 5, tourTaken: 'Kerala Scenic Backwaters' }
            ]).map((test, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-orange-accent mb-4">
                    {[...Array(test.rating || 5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">"{test.message || test.reviewText}"</p>
                </div>
                <div className="border-t border-slate-200/60 pt-4 mt-6 flex items-center">
                  <div className="bg-navy-light text-white font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm mr-3">
                    {test.name ? test.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-dark">{test.name}</h4>
                    <p className="text-xs text-gray-400">{test.location || 'India'} &bull; <span className="text-orange-accent font-semibold">{test.tourTaken || 'Holiday Tour'}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trusted Partner Logos */}
      <section className="py-12 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Our Trusted Tourism Partners</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-50 grayscale hover:opacity-75 transition-opacity">
            {['Incredible India', 'Wonderful Indonesia', 'Visit Bali', 'Maldives Tourism', 'Kerala Tourism'].map((partner, i) => (
              <span key={i} className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">{partner}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
