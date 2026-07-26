import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, Landmark, CreditCard, Shield, Briefcase, Users, Ship, Train, Car, Bus, Scroll } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();

  const servicesList = [
    { title: 'Flight Ticketing', desc: 'Domestic and International flight reservations at competitive rates.', icon: <Plane className="text-white" size={24} />, category: 'Flights' },
    { title: 'Hotel Bookings', desc: 'Handpicked verified 3-star, 4-star, and luxury 5-star properties.', icon: <Hotel className="text-white" size={24} />, category: 'Hotels' },
    { title: 'Visa Assistance', desc: 'Fast-track visa consultation, documentation reviews, and filings.', icon: <Scroll className="text-white" size={24} />, category: 'Visa' },
    { title: 'Passport Services', desc: 'Guidance on fresh applications, renewals, and Tatkal submissions.', icon: <Landmark className="text-white" size={24} />, category: 'Passport' },
    { title: 'Car Rentals', desc: 'Clean, reliable AC cabs, SUVs and luxury sedans with professional drivers.', icon: <Car className="text-white" size={24} />, category: 'Car' },
    { title: 'Bus Bookings', desc: 'Interstate AC Volvo sleeper bookings and group coach transfers.', icon: <Bus className="text-white" size={24} />, category: 'Bus' },
    { title: 'Train Reservation', desc: 'E-ticket confirmations for standard express and luxury tourist trains.', icon: <Train className="text-white" size={24} />, category: 'Train' },
    { title: 'Cruise Vacations', desc: 'Luxury ocean liners and scenic river cruise bookings globally.', icon: <Ship className="text-white" size={24} />, category: 'Cruise' },
    { title: 'Travel Insurance', desc: 'Comprehensive medical protection, flight delay, and luggage loss plans.', icon: <Shield className="text-white" size={24} />, category: 'Insurance' },
    { title: 'Forex Exchanges', desc: 'Best rates for currency notes, multi-currency prepaid travel cards.', icon: <CreditCard className="text-white" size={24} />, category: 'Forex' },
    { title: 'Corporate Travels', desc: 'Streamlined employee business tours, travel policy implementations.', icon: <Briefcase className="text-white" size={24} />, category: 'Corporate' },
    { title: 'MICE Excellence', desc: 'Specialized arrangements for Meetings, Incentives, Conferences, and Events.', icon: <Users className="text-white" size={24} />, category: 'MICE' },
  ];

  const handleEnquire = (serviceTitle) => {
    // Redirect to contact form pre-filled with subject
    navigate(`/contact?subject=Enquiry for ${serviceTitle}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Our Travel Services</h1>
          <p className="text-gray-300 text-sm mt-3">From visa applications to luxury cruises, we handle everything under one roof.</p>
        </div>
      </section>

      {/* Services Grid (12 services) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">End-To-End Hospitality</span>
          <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1">12 Comprehensive Solutions</h2>
          <p className="text-slate-500 text-sm mt-3">We eliminate logistical friction so you can focus entirely on creating memories.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {servicesList.map((srv, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between card-hover text-center">
              <div className="flex flex-col items-center">
                <div className="bg-navy-light rounded-full p-4 mb-4 flex items-center justify-center shadow-md">
                  {srv.icon}
                </div>
                <h3 className="text-base font-bold text-navy-dark mb-2">{srv.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6">
                <button
                  onClick={() => handleEnquire(srv.title)}
                  className="bg-slate-100 hover:bg-orange-accent hover:text-navy-dark text-navy-light font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl transition duration-300 w-full"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Services;
