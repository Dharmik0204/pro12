import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import api from '../services/api';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const topics = ['All', 'General Booking', 'Payments & Refunds', 'Travel Documents', 'Cancellations'];

  useEffect(() => {
    api.get('/faqs')
      .then((res) => {
        if (res.data && res.data.success) {
          setFaqs(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load FAQs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = (faqs.length > 0 ? faqs : [
    { topic: 'General Booking', question: 'How do I book a tour package with Dhanish Travel Co.?', answer: 'You can browse our tour packages from the website, select your favorite package, and click the "Book Now" button. Follow the 5-step wizard to choose your travel dates, input traveler details, select optional add-ons, and complete secure payments. You can also send customized package inquiries from the "Contact Us" or "Customize Tour" page.' },
    { topic: 'General Booking', question: 'Can I customize a package itinerary?', answer: 'Yes! We specialize in customized tours. On the details page of any package or from our services page, you can request custom edits. Our travel agents will coordinate with hotels and transport providers to tailor the itinerary exactly to your choice.' },
    { topic: 'Payments & Refunds', question: 'What payment modes do you accept?', answer: 'We accept Credit Cards, Debit Cards, Netbanking, and UPI transfers through our secure integration with Razorpay. During development and testing, you can choose "Pay Simulation" to confirm bookings without a real transaction.' },
    { topic: 'Payments & Refunds', question: 'What is your cancellation and refund policy?', answer: 'Cancellations made 30 days or more prior to departure receive a 100% refund (minus booking charges). Cancellations between 15-29 days receive a 50% refund, while cancellations less than 15 days prior to departure are non-refundable. Please refer to our full Cancellation policy page for more details.' },
    { topic: 'Travel Documents', question: 'Do you assist with Visas and Passports?', answer: 'Yes, Dhanish Travel Co. provides complete Visa support, Passport application guidance, and foreign exchange (Forex) assistance. You can submit a service query under our Services section.' }
  ]).filter(faq => {
    const matchesTopic = selectedTopic === 'All' || faq.topic === selectedTopic;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Help & FAQs</h1>
          <p className="text-gray-300 text-sm mt-3">Find instant answers to common questions about tour booking policies.</p>
        </div>
      </section>

      {/* Grid Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Topics Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            
            {/* Search FAQ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy-dark mb-4 flex items-center">
                <Search size={14} className="text-orange-accent mr-2" /> Search FAQs
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy-dark mb-4">Topics</h3>
              <div className="flex flex-col space-y-1">
                {topics.map((top) => (
                  <button
                    key={top}
                    onClick={() => setSelectedTopic(top)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      selectedTopic === top 
                        ? 'bg-navy-light text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Accordion List */}
          <div className="w-full lg:w-3/4 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            
            <h2 className="text-lg font-bold text-navy-dark mb-6 flex items-center">
              <HelpCircle className="text-orange-accent mr-2" size={20} /> Accordion Q&A
            </h2>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No matching questions found. Try modifying your search.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="border-b last:border-0 border-slate-100 pb-4">
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className="w-full flex items-center justify-between text-left focus:outline-none py-2"
                      >
                        <span className="text-xs font-bold text-navy-dark pr-4">{faq.question}</span>
                        {isOpen ? <ChevronUp size={16} className="text-orange-accent flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                      </button>
                      
                      {isOpen && (
                        <div className="text-xs text-slate-500 leading-relaxed mt-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default FAQs;
