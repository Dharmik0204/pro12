import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, MapPin, SlidersHorizontal, Search, ArrowRight, Grid, List } from 'lucide-react';
import api from '../services/api';

const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read search variables from URL
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const categories = [
    'All', 'Domestic', 'International', 'Honeymoon', 'Family', 'Group', 'Weekend', 'Adventure', 'Pilgrimage', 'Corporate', 'Customized'
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', currentPage.toString());
    params.set('limit', '9');

    api.get(`/packages?${params.toString()}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setPackages(res.data.data.packages);
          setPagination(res.data.data.pagination);
        }
      })
      .catch((err) => {
        console.error('Failed to load packages:', err);
        setError('Could not retrieve packages. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, currentPage]);

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('category', category);
    nextParams.set('page', '1'); // Reset to page 1
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = e.target.search.value;
    const nextParams = new URLSearchParams(searchParams);
    if (term) {
      nextParams.set('search', term);
    } else {
      nextParams.delete('search');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', page.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Our Tour Packages</h1>
          <p className="text-gray-300 text-sm mt-3">Browse our premium custom packages crafted by travel design specialists.</p>
        </div>
      </section>

      {/* Main Filter & List Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters Column */}
          <div className="w-full lg:w-1/4 space-y-6">
            
            {/* Search Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-navy-dark mb-4 flex items-center">
                <Search size={16} className="text-orange-accent mr-2" /> Search Package
              </h3>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input 
                    type="text" 
                    name="search" 
                    defaultValue={searchQuery}
                    placeholder="Enter keywords..."
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                  />
                  <button type="submit" className="absolute right-2.5 top-2.5 text-slate-400 hover:text-navy-dark">
                    <Search size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Category Filter Desktop */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hidden lg:block">
              <h3 className="text-base font-bold text-navy-dark mb-4 flex items-center">
                <SlidersHorizontal size={16} className="text-orange-accent mr-2" /> Categories
              </h3>
              <div className="flex flex-col space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-navy-light text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-navy-dark'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Package Grid Column */}
          <div className="w-full lg:w-3/4">
            
            {/* Category Tabs Mobile */}
            <div className="lg:hidden mb-6 overflow-x-auto no-scrollbar flex space-x-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border transition ${
                    selectedCategory === cat
                      ? 'bg-navy-light text-white border-navy-light'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Stats Header bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 mb-8 flex items-center justify-between text-xs text-slate-500 font-semibold shadow-sm">
              <span>Showing {packages.length} tour packages</span>
              <div className="flex items-center space-x-2">
                <span>Filter: <strong className="text-navy-dark">{selectedCategory}</strong></span>
              </div>
            </div>

            {/* Loading / Error States */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 animate-pulse">
                    <div className="bg-slate-200 h-48 rounded-xl w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-8 bg-slate-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-2xl border shadow-sm p-6">
                <p className="text-red-500 font-semibold">{error}</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border shadow-sm p-8">
                <h3 className="text-lg font-bold text-navy-dark">No Packages Found</h3>
                <p className="text-xs text-slate-500 mt-2">We couldn't find any packages matching your search criteria. Try modifying your filters.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="mt-6 bg-orange-accent text-navy-dark font-bold text-xs px-5 py-2.5 rounded-full hover:bg-yellow-500 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Packages Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col card-hover">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover" 
                      />
                      {pkg.badge && (
                        <span className="absolute top-3 left-3 bg-orange-accent text-navy-dark text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                          {pkg.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-navy-dark/80 text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                        {pkg.category}
                      </span>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center text-[10px] text-gray-500 mb-1.5">
                          <Calendar size={12} className="mr-1 text-slate-400" /> {pkg.duration.days} Days / {pkg.duration.nights} Nights
                        </div>
                        <h3 className="text-base font-bold text-navy-dark mb-1 leading-snug line-clamp-2">{pkg.title}</h3>
                        <p className="text-[11px] text-gray-500 flex items-center">
                          <MapPin size={10} className="mr-1 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{pkg.destinationRoute}</span>
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <p className="text-base font-extrabold text-navy-light">
                            ₹{(pkg.discountPrice > 0 ? pkg.discountPrice : pkg.price).toLocaleString()}
                            <span className="text-[9px] text-gray-400 font-normal">/person</span>
                          </p>
                        </div>
                        <Link
                          to={`/packages/${pkg.slug}`}
                          className="bg-navy-light text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-accent hover:text-navy-dark transition duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                {[...Array(pagination.totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 rounded-full text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-navy-light text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
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

export default Packages;
