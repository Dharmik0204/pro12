import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Settings, Upload, Save, Building, Phone, Mail, MapPin, Share2 } from 'lucide-react';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'Dhanish Travel Co.',
    tagline: 'Your Smart Travel Partner',
    siteLogo: '',
    heroBanner: '',
    phone: '+91 84848 59316',
    email: 'info@dhanisotravel.com',
    address: 'Gurukrupa Apt, Hirawadi road, Panchvati, Nashik (MH)-422003',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      whatsapp: '+918484859316',
      youtube: 'https://youtube.com',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.data) {
          setFormData(res.data.data);
        }
      } catch (error) {
        showToast(error.response?.data?.error || 'Failed to load site settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e) => {
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
        setFormData((prev) => ({ ...prev, siteLogo: res.data.url }));
        showToast('Logo uploaded successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Logo upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', formData);
      if (res.data.success) {
        showToast('Site settings updated successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <Settings className="mr-2 text-orange-accent" size={22} /> Website & Branding Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage brand logo, contact details, and social media handles.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand & Logo Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800 flex items-center">
            <Building className="mr-2 text-orange-accent" size={16} /> Brand Identity & Logo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-500 block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-500 block mb-1 text-xs">Website Logo Upload</label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                <Upload size={14} className="mr-1.5" /> {uploading ? 'Uploading...' : 'Upload Brand Logo'}
                <input type="file" onChange={handleLogoUpload} accept="image/*" className="hidden" disabled={uploading} />
              </label>
              {formData.siteLogo && <img src={formData.siteLogo} alt="Logo" className="h-8 object-contain" />}
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800 flex items-center">
            <Phone className="mr-2 text-orange-accent" size={16} /> Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Official Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-500 block mb-1">Official Support Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-500 block mb-1 text-xs">Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Social Links Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800 flex items-center">
            <Share2 className="mr-2 text-orange-accent" size={16} /> Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-500 block mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center bg-orange-accent text-navy-dark font-extrabold px-6 py-3 rounded-2xl text-xs hover:bg-yellow-500 transition shadow-lg disabled:opacity-50"
          >
            <Save size={16} className="mr-2" /> {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettings;
