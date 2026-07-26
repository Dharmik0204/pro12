import React, { useState } from 'react';
import { X, Search, ZoomIn, Film, Image } from 'lucide-react';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const tabs = ['All', 'Destinations', 'Customer Memories', 'Events', 'Videos'];

  const mediaList = [
    { type: 'image', category: 'Destinations', url: 'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=800&q=80', caption: 'Shikara boats on Dal Lake, Kashmir' },
    { type: 'image', category: 'Destinations', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', caption: 'Balinese Temple gates' },
    { type: 'image', category: 'Customer Memories', url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80', caption: 'Happy family trekking in Gulmarg' },
    { type: 'image', category: 'Customer Memories', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', caption: 'Sunset dinner in Maldives' },
    { type: 'image', category: 'Events', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', caption: 'Annual travel MICE summit 2026' },
    { type: 'image', category: 'Events', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', caption: 'Corporate tour departure orientation' },
    { type: 'video', category: 'Videos', url: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80', caption: 'Dhanish Travel Co. Promo Video' }
  ];

  const filteredMedia = activeTab === 'All' 
    ? mediaList 
    : mediaList.filter(item => item.category === activeTab);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-navy-dark text-white text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80")' }}>
        <div className="absolute inset-0 bg-navy-dark/75"></div>
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Our Media Gallery</h1>
          <p className="text-gray-300 text-sm mt-3">Watch scenic videos, check customer memories, and check highlights.</p>
        </div>
      </section>

      {/* Media Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center space-x-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-navy-light text-white shadow-md' 
                  : 'bg-white border text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMedia.map((media, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedMedia(media)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-72 cursor-pointer card-hover"
            >
              <img 
                src={media.type === 'video' ? media.poster : media.url} 
                alt={media.caption} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <span className="bg-orange-accent/90 text-navy-dark p-2 rounded-full shadow">
                    {media.type === 'video' ? <Film size={14} /> : <Image size={14} />}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest">{media.category}</span>
                  <h4 className="text-white font-bold text-sm mt-1">{media.caption}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Popup Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 text-white hover:text-orange-accent bg-black/40 p-2.5 rounded-full"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl w-full flex flex-col items-center">
            {selectedMedia.type === 'video' ? (
              <video 
                src={selectedMedia.url} 
                controls 
                autoPlay 
                className="max-h-[70vh] rounded-2xl shadow-2xl w-full"
              />
            ) : (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.caption} 
                className="max-h-[70vh] rounded-2xl shadow-2xl object-contain"
              />
            )}
            <p className="text-white text-center text-sm font-semibold mt-4">{selectedMedia.caption}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
