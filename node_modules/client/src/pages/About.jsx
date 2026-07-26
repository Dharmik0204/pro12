import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Compass, HeartHandshake, Smile, Plane, ShieldAlert } from 'lucide-react';

const About = () => {
  const stats = [
    { value: '50K+', label: 'Happy Travelers', icon: <Smile className="text-orange-accent" size={24} /> },
    { value: '250+', label: 'Tour Packages', icon: <Plane className="text-orange-accent" size={24} /> },
    { value: '45+', label: 'Destinations', icon: <Compass className="text-orange-accent" size={24} /> },
    { value: '15+', label: 'Years of Service', icon: <Award className="text-orange-accent" size={24} /> },
  ];

  const team = [
    { name: 'Dhanish', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80' },
    { name: 'Rohan Sharma', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80' },
    { name: 'Priya Verma', role: 'Lead Travel Consultant', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80' },
    { name: 'Alex Johnson', role: 'Visa & Logistics Expert', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Banner */}
      <section className="relative py-24 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            About Dhanish Travel Co.
          </motion.h1>
          <p className="text-gray-300 text-sm mt-4 max-w-xl mx-auto">
            Learn about our vision, our professional travel planners, and our commitment to providing premium holiday experiences since 2011.
          </p>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-white shadow-sm relative -mt-8 max-w-5xl mx-auto rounded-2xl z-20 px-6 border border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-orange-accent/10 p-3 rounded-full mb-3">
                {stat.icon}
              </div>
              <span className="text-3xl font-extrabold text-navy-dark">{stat.value}</span>
              <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl font-extrabold text-navy-dark mt-1 mb-6">Redefining Modern Travel & Hospitality</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Founded in 2011, Dhanish Travel Co. set out with a simple mission: to simplify vacation planning by offering transparent, top-tier services under one digital roof. What started as a boutique visa consulting office in Noida has grown into India's leading custom tour booking operator.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              We manage everything from flight ticketing, direct hotel reservations, fast-track visa approvals, foreign exchange currency exchange, and comprehensive travel insurance coverages.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100">
                <h4 className="text-base font-bold text-navy-dark mb-1">Our Mission</h4>
                <p className="text-xs text-gray-500">To inspire exploration by offering highly curated packages with absolute safety and reliability.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100">
                <h4 className="text-base font-bold text-navy-dark mb-1">Our Vision</h4>
                <p className="text-xs text-gray-500">To become the world's most trusted MERN-powered travel partner, integrating payments and custom plan creations.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" 
              alt="Globe and map" 
              className="rounded-3xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-navy-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Our Ethics</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">Core Pillars of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Customer First', desc: 'Every booking gets a dedicated relationship specialist available 24/7 on call.', icon: <HeartHandshake size={24} className="text-orange-accent" /> },
              { title: 'Complete Transparency', desc: 'Recalculated pricing models mean no hidden taxes, booking fees, or surprise surcharges.', icon: <ShieldCheck size={24} className="text-orange-accent" /> },
              { title: 'Global Coverage', desc: 'Strong alliances with top hoteliers and local operators across Kashmir, Kerala, Bali, and the Maldives.', icon: <Compass size={24} className="text-orange-accent" /> },
            ].map((val, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl">
                <div className="mb-4">{val.icon}</div>
                <h3 className="text-lg font-bold mb-2">{val.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Our Specialists</span>
          <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1">Meet the Executive Team</h2>
          <p className="text-slate-500 text-sm mt-3">Experienced travelers and logistical operators managing your custom tours.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm text-center p-6 hover:shadow-lg transition">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-2 border-orange-accent/50"
              />
              <h3 className="text-base font-bold text-navy-dark">{member.name}</h3>
              <p className="text-xs text-orange-accent font-medium mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
