import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // Date selection
  const [travelDate, setTravelDate] = useState({
    start: '',
    end: '',
  });

  // Traveler Details
  const [travelerCount, setTravelerCount] = useState(1);
  const [travelers, setTravelers] = useState([
    { name: '', age: '', gender: 'male', isLead: true, idProof: '' },
  ]);

  // Add-ons Selection
  const [addons, setAddons] = useState([]);

  // Final Billing Amounts
  const [pricing, setPricing] = useState({
    packageCost: 0,
    addonCost: 0,
    extraTravelerCost: 0,
    totalAmount: 0,
  });

  const [createdBooking, setCreatedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync travelers list length with travelerCount
  useEffect(() => {
    setTravelers((prev) => {
      const count = Number(travelerCount) || 1;
      const updated = [...prev];
      
      if (updated.length < count) {
        // Add new blank traveler forms
        while (updated.length < count) {
          updated.push({ name: '', age: '', gender: 'male', isLead: false, idProof: '' });
        }
      } else if (updated.length > count) {
        // Shrink the list
        updated.splice(count);
      }
      
      // Ensure first traveler is lead
      if (updated.length > 0) {
        updated[0].isLead = true;
      }
      
      return updated;
    });
  }, [travelerCount]);

  // Recalculate totals live
  useEffect(() => {
    if (!selectedPackage) return;

    const basePrice = selectedPackage.discountPrice > 0 ? selectedPackage.discountPrice : selectedPackage.price;
    const pCost = basePrice * travelers.length;
    const aCost = addons.reduce((sum, item) => sum + item.price, 0);
    const extraCost = 0; // Flat base
    const total = pCost + aCost + extraCost;

    setPricing({
      packageCost: pCost,
      addonCost: aCost,
      extraTravelerCost: extraCost,
      totalAmount: total,
    });
  }, [selectedPackage, travelers, addons]);

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentStep(1);
    
    // Auto-calculate end date based on package duration if start date exists
    if (travelDate.start && pkg.duration?.days) {
      const start = new Date(travelDate.start);
      const end = new Date(start);
      end.setDate(start.getDate() + pkg.duration.days - 1);
      setTravelDate((prev) => ({
        ...prev,
        end: end.toISOString().split('T')[0],
      }));
    }
  };

  const handleStartDateChange = (startDateString) => {
    if (!startDateString) return;
    
    setTravelDate((prev) => {
      const updated = { ...prev, start: startDateString };
      if (selectedPackage?.duration?.days) {
        const start = new Date(startDateString);
        const end = new Date(start);
        end.setDate(start.getDate() + selectedPackage.duration.days - 1);
        updated.end = end.toISOString().split('T')[0];
      }
      return updated;
    });
  };

  const toggleAddon = (addonItem) => {
    setAddons((prev) => {
      const exists = prev.find((a) => a.name === addonItem.name);
      if (exists) {
        return prev.filter((a) => a.name !== addonItem.name);
      } else {
        return [...prev, addonItem];
      }
    });
  };

  const updateTravelerInfo = (index, field, value) => {
    setTravelers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const createBookingRequest = async () => {
    if (!selectedPackage) return { success: false, error: 'No package selected' };

    setLoading(true);
    try {
      const payload = {
        packageId: selectedPackage._id,
        travelDate,
        travelers: travelers.map((t) => ({
          ...t,
          age: Number(t.age),
        })),
        addons,
      };

      const response = await api.post('/bookings', payload);
      if (response.data && response.data.success) {
        setCreatedBooking(response.data.data);
        return { success: true, booking: response.data.data };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Booking creation failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedPackage(null);
    setTravelDate({ start: '', end: '' });
    setTravelerCount(1);
    setTravelers([{ name: '', age: '', gender: 'male', isLead: true, idProof: '' }]);
    setAddons([]);
    setCreatedBooking(null);
    setPricing({ packageCost: 0, addonCost: 0, extraTravelerCost: 0, totalAmount: 0 });
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        selectedPackage,
        selectPackage,
        travelDate,
        setTravelDate,
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
        loading,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
