import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').trim(),
  subject: z.string().min(1, 'Subject is required').trim(),
  message: z.string().min(5, 'Message must be at least 5 characters').trim(),
});

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialSubject = searchParams.get('subject') || '';

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: initialSubject,
      message: '',
    },
  });

  useEffect(() => {
    if (initialSubject) {
      setValue('subject', initialSubject);
    }
  }, [initialSubject, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    try {
      const response = await api.post('/contact', data);
      if (response.data && response.data.success) {
        setSubmitSuccess(true);
        reset();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit form. Please check rate limits.';
      setSubmitError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = '+918484859316';
  const whatsappMessage = encodeURIComponent('Hello Dhanish Travel Co., I would like to inquire about holiday packages.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-gray-300 text-sm mt-3">Reach out to our Nashik office or chat directly via WhatsApp.</p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Office Info & Details */}
          <div className="space-y-8">
            <div>
              <span className="text-orange-accent font-bold text-xs uppercase tracking-wider">Get In Touch</span>
              <h2 className="text-3xl font-extrabold text-navy-dark tracking-tight mt-1">Dhanish Travel Corporate Office</h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Our main office is located in Nashik. Drop by to discuss customized package options or submit physical passport documents.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-3">
                <MapPin size={22} className="text-orange-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-navy-dark">Office Address</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Gurukrupa Apt, Hirawadi road, Panchvati, Nashik (MH)-422003
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-3">
                <Phone size={22} className="text-orange-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-navy-dark">Call Support</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    +91 84848 59316
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-3">
                <Mail size={22} className="text-orange-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-navy-dark">Email Enquiries</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    info@dhanisotravel.com
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-3">
                <MessageSquare size={22} className="text-orange-accent mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-navy-dark">WhatsApp Deep Link</h4>
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-green-600 hover:text-green-700 mt-1 block"
                  >
                    Chat live now
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Static Map Representation */}
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <iframe 
                title="Dhanish Travel Co. Nashik Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.826723223019!2d73.8051419760777!3d20.01570538138248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb2d02c00001%3A0x6b8017c66708304a!2sPanchavati%2C%20Nashik%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg">
            <h3 className="text-lg font-bold text-navy-dark mb-6 flex items-center">
              <Send size={18} className="text-orange-accent mr-2" /> Send Enquiry Message
            </h3>

            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                <p className="text-xs text-green-700">Inquiry submitted successfully! A traveler manager will email you shortly.</p>
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-red-600">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                {errors.name && <span className="text-[10px] text-red-500 mt-1 block">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    {...register('email')}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 mt-1 block">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    {...register('phone')}
                    placeholder="e.g. +91 8484859316"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500 mt-1 block">{errors.phone.message}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Inquiry Subject</label>
                <input 
                  type="text" 
                  {...register('subject')}
                  placeholder="e.g. Kashmir Custom Package"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                {errors.subject && <span className="text-[10px] text-red-500 mt-1 block">{errors.subject.message}</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Message Description</label>
                <textarea 
                  rows="4"
                  {...register('message')}
                  placeholder="Detail your requests here (travel dates, count, special meals, hotel category requests)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
                {errors.message && <span className="text-[10px] text-red-500 mt-1 block">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-accent text-navy-dark font-bold rounded-xl py-3 text-xs hover:bg-yellow-500 transition shadow disabled:opacity-50"
              >
                {loading ? 'Sending Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;
