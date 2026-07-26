import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All', 'Travel Guide', 'Honeymoon Tips', 'Destination Hacks', 'Local Foods']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);

    api.get(`/blog?${params.toString()}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setPosts(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load blog posts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Simple local filter or query API
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Travel Blogs & Stories</h1>
          <p className="text-gray-300 text-sm mt-3">Read hacks, itineraries, and guides written by our specialists.</p>
        </div>
      </section>

      {/* Grid Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main List */}
          <div className="w-full lg:w-3/4 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-light"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="text-lg font-bold text-navy-dark">No Articles Found</h3>
                <p className="text-xs text-slate-500 mt-1">Please try modifying your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <div key={post._id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between card-hover">
                    <div>
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={post.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-4 right-4 bg-navy-dark/80 text-white text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase">
                          {post.category}
                        </span>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-[10px] text-gray-500 space-x-3 mb-2">
                          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span className="flex items-center"><User size={12} className="mr-1" /> {post.author}</span>
                          <span className="flex items-center"><Eye size={12} className="mr-1" /> {post.views} views</span>
                        </div>
                        
                        <h3 className="text-base font-bold text-navy-dark mb-2 leading-snug line-clamp-2">{post.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-xs font-bold text-navy-light hover:text-orange-accent transition flex items-center"
                      >
                        Read Full Article <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            
            {/* Search */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy-dark mb-4 flex items-center">
                <Search size={14} className="text-orange-accent mr-2" /> Search Blogs
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type search terms..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-light"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy-dark mb-4">Categories</h3>
              <div className="flex flex-col space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      selectedCategory === cat 
                        ? 'bg-navy-light text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Blog;
