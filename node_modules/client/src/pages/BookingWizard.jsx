import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, CreditCard, Gift, Printer } from 'lucide-react';
import api from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    currentStep,
    setCurrentStep,
    selectedPackage,
    travelDate,
    handleStartDateChange,
    travelerCount,
    setTravelerCount,
    travelers,
    updateTravelerInfo,
    addons,
    toggleAddon,
    pricing,
    createdBooking,
    setCreatedBooking,
    createBookingRequest,
    resetBooking,
    loading
  } = useBooking();

  const [idConfirmed, setIdConfirmed] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Available addons list with description
  const availableAddons = [
    { name: 'Premium Travel Insurance', price: 999, desc: 'Covers medical emergency, trip delays, and luggage losses.' },
    { name: 'Luxury Private Sedan Upgrade', price: 2499, desc: 'Upgrade sightseeing transfers to a private luxury vehicle.' },
    { name: 'Full Board Premium Meals', price: 3999, desc: 'Includes lunch and local gourmet dinners daily.' }
  ];

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate(`/login?from=/booking&message=auth_required`);
    }
    if (!selectedPackage) {
      navigate('/packages');
    }
  }, [user, selectedPackage, navigate]);

  if (!selectedPackage) return null;

  const basePrice = selectedPackage.discountPrice > 0 ? selectedPackage.discountPrice : selectedPackage.price;

  // Step Navigations
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!travelDate.start) {
        alert('Please select your starting travel date.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const invalid = travelers.some(t => !t.name || !t.age || !t.gender);
      if (invalid) {
        alert('Please complete all traveler information fields.');
        return;
      }
      if (!idConfirmed) {
        alert('Please check the ID confirmation box.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const res = await createBookingRequest();
      if (res.success) {
        setCurrentStep(4);
      } else {
        alert(res.error || 'Failed to initialize booking. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Payment Execution (Mock / Live Integration)
  const handlePayment = async () => {
    if (!createdBooking) return;
    
    setPaymentLoading(true);
    try {
      // 1. Create order
      const orderRes = await api.post('/payments/create-order', {
        bookingId: createdBooking._id,
      });

      if (orderRes.data && orderRes.data.success) {
        const orderData = orderRes.data.data;

        // If running in Mock sandbox mode
        if (orderData.isMock) {
          const verifyRes = await api.post('/payments/verify', {
            bookingId: createdBooking._id,
            razorpay_order_id: orderData.id,
            razorpay_payment_id: `pay_sim_${Math.random().toString(36).substring(2, 9)}`,
            isMock: true,
          });

          if (verifyRes.data && verifyRes.data.success) {
            setCreatedBooking(verifyRes.data.data);
            setCurrentStep(5);
          } else {
            alert('Simulation payment verification failed.');
          }
        } else {
          // Ensure Razorpay SDK script is loaded
          const res = await loadRazorpayScript();
          if (!res) {
            alert('Razorpay SDK failed to load. Check your internet connection.');
            return;
          }

          // Live Razorpay SDK checkout modal
          const options = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'Dhanish Travel Co.',
            description: `Booking for ${selectedPackage.title}`,
            order_id: orderData.id,
            handler: async (response) => {
              try {
                const verifyRes = await api.post('/payments/verify', {
                  bookingId: createdBooking._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  isMock: false,
                });

                if (verifyRes.data && verifyRes.data.success) {
                  setCreatedBooking(verifyRes.data.data);
                  setCurrentStep(5);
                }
              } catch (err) {
                alert('Payment verification failed: ' + (err.response?.data?.error || err.message));
              }
            },
            prefill: {
              name: user.name || '',
              email: user.email || '',
              contact: user.phone || '',
            },
            theme: {
              color: '#0B2447',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            alert(`Payment Failed: ${response.error.description || response.error.reason}`);
          });
          rzp.open();
        }
      }
    } catch (err) {
      console.error(err);
      alert('Payment Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setPaymentLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Dates' },
    { num: 2, label: 'Travellers' },
    { num: 3, label: 'Addons' },
    { num: 4, label: 'Payment' },
    { num: 5, label: 'Done' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Step Indicators Timeline Header */}
      <section className="bg-navy-dark text-white py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 sm:space-x-12">
            {steps.map((st) => (
              <div key={st.num} className="flex items-center space-x-2">
                <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === st.num 
                    ? 'bg-orange-accent text-navy-dark shadow-md scale-110' 
                    : currentStep > st.num 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-700 text-gray-400'
                }`}>
                  {st.num}
                </span>
                <span className={`text-[10px] sm:text-xs font-bold ${currentStep === st.num ? 'text-white' : 'text-gray-400'}`}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Wrapper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Active Panel Layout */}
          <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            
            {/* STEP 1: DATES */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-dark mb-2">Step 1: Choose Travel Date & Count</h3>
                  <p className="text-xs text-gray-500">Pick the date to commence your vacation with Dhanish Travel Co.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center">
                      <Calendar size={14} className="mr-1.5 text-orange-accent" /> Start Date
                    </label>
                    <input 
                      type="date" 
                      value={travelDate.start}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    {travelDate.end && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                        <span className="text-gray-400 block">End Date (Auto calculated)</span>
                        <strong className="text-slate-700">{new Date(travelDate.end).toDateString()}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 flex items-center">
                    <Users size={14} className="mr-1.5 text-orange-accent" /> Number of Travellers
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light max-w-[200px]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: TRAVELLER DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-dark mb-2">Step 2: Traveler Information</h3>
                  <p className="text-xs text-gray-500">Input official traveler details. Traveler #1 is marked as the lead coordinator.</p>
                </div>

                <div className="space-y-6">
                  {travelers.map((traveler, idx) => (
                    <div key={idx} className="bg-slate-50 border rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-navy-light">
                        Traveler #{idx + 1} {traveler.isLead ? '(Lead Traveler)' : ''}
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={traveler.name}
                            onChange={(e) => updateTravelerInfo(idx, 'name', e.target.value)}
                            placeholder="Passport name"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-navy-light"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Age</label>
                          <input 
                            type="number" 
                            value={traveler.age}
                            onChange={(e) => updateTravelerInfo(idx, 'age', e.target.value)}
                            placeholder="Age"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-navy-light"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Gender</label>
                          <select
                            value={traveler.gender}
                            onChange={(e) => updateTravelerInfo(idx, 'gender', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-navy-light"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start bg-orange-accent/5 p-4 rounded-xl border border-orange-200/50">
                  <input 
                    type="checkbox" 
                    id="idVerify" 
                    checked={idConfirmed}
                    onChange={(e) => setIdConfirmed(e.target.checked)}
                    className="h-4 w-4 text-navy-light focus:ring-navy-light border-gray-300 rounded mt-0.5" 
                  />
                  <label htmlFor="idVerify" className="ml-2.5 text-[11px] text-slate-600 font-medium select-none">
                    I confirm that traveler names and age matches passport ID proofs correctly.
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: ADDONS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-dark mb-2">Step 3: Optional Add-on Services</h3>
                  <p className="text-xs text-gray-500">Enhance your tour experience with our handpicked travel utilities.</p>
                </div>

                <div className="space-y-3">
                  {availableAddons.map((addon) => {
                    const isSelected = addons.some(a => a.name === addon.name);
                    return (
                      <div 
                        key={addon.name}
                        onClick={() => toggleAddon(addon)}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-start justify-between transition ${
                          isSelected ? 'border-orange-accent bg-orange-accent/5' : 'border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-4">
                          <h4 className="text-xs font-bold text-navy-dark">{addon.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{addon.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="block text-xs font-extrabold text-navy-light">₹{addon.price.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{addon.name.includes('Sedan') ? 'Flat rate' : 'per traveler'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT OPTIONS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-dark mb-2">Step 4: Secure Checkout Payment</h3>
                  <p className="text-xs text-gray-500">Complete booking confirmation using our secure checkout portal.</p>
                </div>

                {createdBooking && (
                  <div className="bg-slate-50 border rounded-2xl p-5 space-y-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Booking Reference Code</span>
                      <strong className="text-navy-dark font-extrabold">{createdBooking.bookingRef}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient Email Address</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-navy-dark pt-2.5 border-t border-slate-200">
                      <span>Total Invoice Due</span>
                      <span>INR {createdBooking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="bg-white border rounded-2xl p-6 text-center space-y-4 shadow-sm">
                  <CreditCard className="mx-auto text-orange-accent" size={36} />
                  <h4 className="text-xs font-bold text-navy-dark">Real-Time Razorpay Payment Gateway (UPI / Credit Card / NetBanking)</h4>
                  <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                    Click below to open the official Razorpay checkout window for real-time payment processing.
                  </p>
                  
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="bg-navy-light text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-orange-accent hover:text-navy-dark transition shadow-md disabled:opacity-50 inline-block"
                  >
                    {paymentLoading ? 'Launching Razorpay Gateway...' : 'Pay Now with Razorpay'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CONFIRMATION */}
            {currentStep === 5 && createdBooking && (
              <div className="text-center space-y-6 py-10">
                <CheckCircle2 size={54} className="text-green-500 mx-auto" />
                
                <div>
                  <h2 className="text-xl font-extrabold text-navy-dark">Congratulations! Booking Confirmed</h2>
                  <p className="text-xs text-gray-500 mt-2">
                    Your holiday reservation has been completed successfully. A validation PDF invoice has been emailed to you.
                  </p>
                </div>

                <div className="bg-slate-50 border rounded-2xl p-6 max-w-md mx-auto space-y-3 text-xs text-slate-600 text-left">
                  <div className="flex justify-between">
                    <span>Invoice Reference</span>
                    <strong className="text-navy-dark font-extrabold">{createdBooking.bookingRef}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Package Booked</span>
                    <span className="font-semibold text-navy-dark">{selectedPackage.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commence Date</span>
                    <span>{new Date(createdBooking.travelDate.start).toDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount Charged</span>
                    <strong className="text-navy-dark">INR {createdBooking.totalAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Reference ID</span>
                    <span className="text-slate-400 select-all">{createdBooking.paymentId}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={() => window.print()}
                    className="border border-slate-300 text-navy-dark font-semibold px-4 py-2 rounded-xl text-xs flex items-center hover:bg-slate-50 transition"
                  >
                    <Printer size={14} className="mr-1.5" /> Print Summary
                  </button>
                  <Link 
                    to="/dashboard"
                    onClick={resetBooking}
                    className="bg-navy-light text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-orange-accent hover:text-navy-dark transition"
                  >
                    Go to My Bookings
                  </Link>
                </div>
              </div>
            )}

            {/* Back/Next Buttons Footer */}
            {currentStep < 5 && (
              <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="border border-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-50 transition disabled:opacity-40 flex items-center"
                >
                  <ArrowLeft size={14} className="mr-1.5" /> Back
                </button>
                
                {currentStep < 4 && (
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-orange-accent text-navy-dark font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition flex items-center"
                  >
                    {loading ? 'Processing...' : <>Next <ArrowRight size={14} className="ml-1.5" /></>}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right Side persistent Trip Summary Sidebar */}
          {currentStep < 5 && (
            <div className="w-full lg:w-1/3">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-lg space-y-6">
                
                <h3 className="text-sm font-bold text-navy-dark border-b border-slate-100 pb-3 flex items-center">
                  <Gift size={16} className="text-orange-accent mr-2" /> Booking Summary
                </h3>

                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedPackage.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=150&q=80'} 
                    alt={selectedPackage.title}
                    className="h-16 w-20 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-navy-dark truncate leading-snug">{selectedPackage.title}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {selectedPackage.duration?.days || 3} Days / {selectedPackage.duration?.nights || 2} Nights
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
                  {travelDate.start && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Travel Start Date</span>
                      <strong className="text-slate-600">{new Date(travelDate.start).toDateString()}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Count of Travelers</span>
                    <strong className="text-slate-600">{travelerCount} Persons</strong>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Package Cost</span>
                    <span>₹{basePrice.toLocaleString()} &times; {travelerCount}</span>
                  </div>
                  {addons.length > 0 && (
                    <div className="space-y-1 pl-2">
                      <span className="text-[10px] text-slate-400 block font-semibold">Selected Add-ons:</span>
                      {addons.map((a) => (
                        <div key={a.name} className="flex justify-between text-[10px] text-slate-500">
                          <span>+ {a.name}</span>
                          <span>₹{a.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between font-extrabold text-navy-dark pt-3 border-t border-slate-200 text-sm">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{pricing.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center text-[9px] text-gray-400 space-x-2">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span>Dhanish Travel Co. Safe Booking Guarantee</span>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default BookingWizard;
