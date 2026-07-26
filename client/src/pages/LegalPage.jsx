import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const LegalPage = () => {
  const location = useLocation();
  const [legalData, setLegalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map route path to DB document type
  let type = 'privacy';
  if (location.pathname.includes('terms-and-conditions')) {
    type = 'terms';
  } else if (location.pathname.includes('cancellation-refund-policy')) {
    type = 'cancellation';
  }

  const pageTitles = {
    privacy: 'Privacy & Cookie Policy',
    terms: 'Terms of Service & Conditions',
    cancellation: 'Cancellation & Refund Policy',
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/legal/${type}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setLegalData(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load legal content:', err);
        setError('Failed to fetch legal page. Showing offline fallback.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [type]);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Header Banner */}
      <section className="relative py-16 bg-navy-dark text-white text-center">
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">{pageTitles[type]}</h1>
          {legalData && (
            <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-center">
              <Calendar size={12} className="mr-1" /> Last Updated: {new Date(legalData.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-6">
          
          {loading ? (
            <div className="flex items-center justify-center min-h-[150px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-light"></div>
            </div>
          ) : error || !legalData ? (
            <div className="text-center py-6 text-slate-500 space-y-2">
              <ShieldAlert className="mx-auto text-orange-accent" size={36} />
              <p className="text-xs font-semibold">Offline documentation template loaded.</p>
            </div>
          ) : (
            <div className="space-y-8 divide-y divide-slate-100">
              {legalData.sections.map((sec, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                  <h3 className="text-sm font-bold text-navy-dark mb-2.5">{sec.heading}</h3>
                  <p 
                    className="text-xs text-slate-600 leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: sec.body }}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default LegalPage;
