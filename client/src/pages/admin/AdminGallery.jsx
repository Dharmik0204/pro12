import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Image as ImageIcon, Upload, Trash2, Filter } from 'lucide-react';

const initialGalleryItems = [
  { id: '1', title: 'Manali Snow Peak', category: 'Destinations', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800' },
  { id: '2', title: 'Goa Sunset Beach', category: 'Destinations', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800' },
  { id: '3', title: 'Happy Group Tour', category: 'Customer Memories', url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800' },
  { id: '4', title: 'Kerala Houseboat', category: 'Destinations', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800' },
];

const AdminGallery = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState(initialGalleryItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploading, setUploading] = useState(false);

  const categories = ['All', 'Destinations', 'Customer Memories', 'Events'];

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        const newItem = {
          id: String(Date.now()),
          title: file.name.split('.')[0],
          category: selectedCategory === 'All' ? 'Destinations' : selectedCategory,
          url: res.data.url,
        };
        setItems([newItem, ...items]);
        showToast('Gallery image uploaded successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    showToast('Image removed from gallery', 'success');
  };

  const filteredItems = selectedCategory === 'All' ? items : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <ImageIcon className="mr-2 text-orange-accent" size={22} /> Gallery Media Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Upload photos, group tour memories, and destination highlights.</p>
        </div>

        <label className="cursor-pointer bg-orange-accent text-navy-dark font-extrabold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-500 transition shadow-md flex items-center justify-center shrink-0">
          <Upload size={16} className="mr-1.5" /> {uploading ? 'Uploading...' : 'Upload Media'}
          <input type="file" onChange={handleUpload} accept="image/*" className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-navy-dark text-white dark:bg-orange-accent dark:text-navy-dark shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Masonry Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-52 bg-slate-100 dark:bg-slate-800">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-between">
                <span className="bg-orange-accent text-navy-dark text-[9px] font-extrabold px-2 py-0.5 rounded-md w-max uppercase">
                  {item.category}
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-white text-xs font-bold truncate">{item.title}</p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminGallery;
