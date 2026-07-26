import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MapPin, Calendar, Award } from 'lucide-react';
import api from '../services/api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/testimonials')
      .then((res) => {
        if (res.data && res.data.success) {
          setReviews(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load testimonials:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Customer Testimonials</h1>
          <p className="text-gray-300 text-sm mt-3">Read reviews and stories written by verified travelers.</p>
        </div>
      </section>

      {/* Trust Blocks & Google Score */}
      <section className="max-w-5xl mx-auto px-4 py-12 relative -mt-8 z-10">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Google Review Score</span>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-3xl font-extrabold text-navy-dark">4.9</span>
              <span className="text-sm font-bold text-slate-500">/ 5.0</span>
            </div>
            <div className="flex justify-center text-orange-accent mt-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 block">Based on 1,240+ verified ratings</span>
          </div>

          <div className="pt-6 md:pt-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Travelers</span>
            <span className="text-3xl font-extrabold text-navy-dark">50,000+</span>
            <span className="text-[10px] text-gray-400 mt-1.5 block">Custom vacation bookings completed</span>
          </div>

          <div className="pt-6 md:pt-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Service Rating</span>
            <span className="text-3xl font-extrabold text-navy-dark">99.4%</span>
            <span className="text-[10px] text-gray-400 mt-1.5 block">Customer satisfaction index</span>
          </div>
        </div>
      </section>

      {/* Grid of Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-light"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(reviews.length > 0 ? reviews : [
              { name: 'Rahul Sharma', location: 'Delhi, India', message: 'Our Kashmir honeymoon was perfectly managed by Dhanish Travel Co. The houseboat was beautiful, the food was delicious, and the driver was extremely professional and helpful. Highly recommended!', rating: 5, tourTaken: 'Splendors of Kashmir', source: 'website' },
              { name: 'Sophia Patel', location: 'Mumbai, India', message: 'The Bali trip was amazing. Kelingking Beach was breathtaking, and the private pool villa in Seminyak was clean and luxurious. Standard booking flow was very smooth!', rating: 5, tourTaken: 'Tropical Bali Getaway', source: 'google' },
              { name: 'Amit Verma', location: 'Bangalore, India', message: 'Highly satisfied with the Kerala family package. Kids loved the Alleppey backwaters houseboat stay. Driver drove very safely on Munnar ghats. Will book again with Dhanish Travel Co!', rating: 5, tourTaken: 'Kerala Scenic Backwaters', source: 'website' }
            ]).map((test, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm flex flex-col justify-between card-hover">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-orange-accent">
                      {[...Array(test.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="bg-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Via {test.source}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{test.message}"</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center">
                  <div className="bg-navy-light text-white font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm mr-3">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-dark">{test.name}</h4>
                    <p className="text-[10px] text-gray-400 flex items-center">
                      <MapPin size={10} className="mr-0.5" /> {test.location} &bull; <strong className="text-orange-600 font-semibold ml-1">{test.tourTaken}</strong>
                    </p>
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

export default Testimonials;
