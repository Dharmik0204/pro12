import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Tour Packages', path: '/packages' },
    { name: 'Travel Services', path: '/services' },
    { name: 'Customer Reviews', path: '/testimonials' },
    { name: 'Help FAQs', path: '/faqs' },
    { name: 'Contact Support', path: '/contact' },
  ];

  const topDestinations = [
    { name: 'Kashmir Valley', path: '/destinations/kashmir' },
    { name: 'Tropical Bali', path: '/destinations/bali' },
    { name: 'Maldives Paradise', path: '/destinations/maldives' },
    { name: 'Scenic Kerala', path: '/packages?category=Family' },
    { name: 'Ladakh Odyssey', path: '/packages?category=Adventure' },
  ];

  const travelServices = [
    { name: 'Flight Ticketing', path: '/services' },
    { name: 'Hotel Bookings', path: '/services' },
    { name: 'Visa & Passport Support', path: '/services' },
    { name: 'Foreign Exchange (Forex)', path: '/services' },
    { name: 'Corporate Travel (MICE)', path: '/services' },
  ];

  return (
    <footer className="bg-navy-dark text-gray-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Info */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src={logoImg} 
                alt="Dhanish Travel Co." 
                className="h-20 w-auto object-contain mb-2"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Dhanish Travel Co. is your trusted partner for memorable holiday tours, flight/hotel bookings, visa solutions, and premium travel management services.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-slate-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm hover:text-orange-accent hover:pl-1 transition-all duration-200 flex items-center"
                  >
                    <ArrowRight size={12} className="mr-1.5 opacity-50 text-orange-accent" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Destinations */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-slate-800">
              Top Destinations
            </h3>
            <ul className="space-y-3">
              {topDestinations.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm hover:text-orange-accent hover:pl-1 transition-all duration-200 flex items-center"
                  >
                    <ArrowRight size={12} className="mr-1.5 opacity-50 text-orange-accent" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Services */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-slate-800">
              Services
            </h3>
            <ul className="space-y-3">
              {travelServices.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm hover:text-orange-accent hover:pl-1 transition-all duration-200 flex items-center"
                  >
                    <ArrowRight size={12} className="mr-1.5 opacity-50 text-orange-accent" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-6 pb-2 border-b border-slate-800">
              Contact Office
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-orange-accent mr-3 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Gurukrupa Apt, Hirawadi road,<br />
                  Panchvati, Nashik (MH)-422003
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-orange-accent mr-3 flex-shrink-0" />
                <a href="tel:+918484859316" className="text-sm hover:text-orange-accent transition">
                  +91 84848 59316
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-orange-accent mr-3 flex-shrink-0" />
                <a href="mailto:info@dhanisotravel.com" className="text-sm hover:text-orange-accent transition">
                  info@dhanisotravel.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-10"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Dhanish Travel Co. (WanderVista). All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-orange-accent transition">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-orange-accent transition">
              Terms of Use
            </Link>
            <Link to="/cancellation-refund-policy" className="hover:text-orange-accent transition">
              Cancellation & Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
