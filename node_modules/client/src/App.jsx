import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import About from './pages/About';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Testimonials from './pages/Testimonials';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import BookingWizard from './pages/BookingWizard';
import LegalPage from './pages/LegalPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';

// Admin Modules
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPackages from './pages/admin/AdminPackages';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminBlog from './pages/admin/AdminBlog';
import AdminReviews from './pages/admin/AdminReviews';
import AdminFAQs from './pages/admin/AdminFAQs';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Main Website Layout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="packages/:slug" element={<PackageDetail />} />
                  <Route path="destinations" element={<Destinations />} />
                  <Route path="destinations/:slug" element={<DestinationDetail />} />
                  <Route path="services" element={<Services />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPostDetail />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="faqs" element={<FAQs />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="booking" element={<BookingWizard />} />
                  <Route path="privacy-policy" element={<LegalPage />} />
                  <Route path="terms-and-conditions" element={<LegalPage />} />
                  <Route path="cancellation-refund-policy" element={<LegalPage />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Enterprise Admin Dashboard Layout (13 Modules) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="packages" element={<AdminPackages />} />
                  <Route path="destinations" element={<AdminDestinations />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="faqs" element={<AdminFAQs />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="enquiries" element={<AdminEnquiries />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
