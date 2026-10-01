import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Plus, Minus, MapPin, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { MenuItem, OrderFormData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface OrderModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_CUSTOMER_KEY = 'princelys_kitchen_customer_info';

export const OrderModal: React.FC<OrderModalProps> = ({ item, isOpen, onClose }) => {
  const { isTerracotta } = useTheme();
  const { settings, formatWhatsApp } = useSiteSettings();
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    deliveryLocation: '',
    phoneNumber: '',
    quantity: 1,
    additionalNotes: ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Restore saved details for fast repeat ordering
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setFormErrors({});
      try {
        const saved = localStorage.getItem(RECENT_CUSTOMER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({
            ...prev,
            customerName: parsed.customerName || '',
            deliveryLocation: parsed.deliveryLocation || '',
            phoneNumber: parsed.phoneNumber || '',
            quantity: 1,
            additionalNotes: ''
          }));
        } else {
          setFormData({
            customerName: '',
            deliveryLocation: '',
            phoneNumber: '',
            quantity: 1,
            additionalNotes: ''
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleQuantityChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Please enter your name.';
    }
    if (!formData.deliveryLocation.trim()) {
      errors.deliveryLocation = 'Please provide your delivery address or area.';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter your contact phone number.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Save info for future visits
    try {
      localStorage.setItem(
        RECENT_CUSTOMER_KEY,
        JSON.stringify({
          customerName: formData.customerName,
          deliveryLocation: formData.deliveryLocation,
          phoneNumber: formData.phoneNumber
        })
      );
    } catch (err) {
      // ignore
    }

    // Format text message strictly according to prompt specification:
    let text = `Hello ${settings.brandName}, I am ${formData.customerName.trim()}. I would like to order ${formData.quantity} portion${formData.quantity > 1 ? 's' : ''} of ${item.name} to ${formData.deliveryLocation.trim()}. My phone number is ${formData.phoneNumber.trim()}.`;

    if (formData.additionalNotes && formData.additionalNotes.trim()) {
      text += ` Additional notes: ${formData.additionalNotes.trim()}.`;
    }

    const totalPrice = item.price * formData.quantity;
    text += ` Estimated total: ₦${totalPrice.toLocaleString()}. Please confirm availability and delivery time.`;

    const whatsappUrl = formatWhatsApp(text);

    setIsSubmitted(true);

    // Open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  const totalPrice = item.price * formData.quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      id="order-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden my-8 transition-colors ${
          isTerracotta
            ? 'bg-white border-[#E2D8C3] text-stone-900'
            : 'bg-neutral-900 border-neutral-700/80 text-white'
        }`}
        id="order-modal-card"
      >
        {/* Header with Food Image Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-neutral-950">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover brightness-90"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              isTerracotta
                ? 'from-white via-white/50 to-black/20'
                : 'from-neutral-900 via-neutral-900/60 to-transparent'
            }`}
          />

          {/* Close Button */}
          <button
            id="order-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors border border-white/20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Title */}
          <div className="absolute bottom-3 left-5 right-5">
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-orange-600 text-white mb-1.5 shadow">
              {item.category.toUpperCase()}
            </span>
            <h3
              className={`font-heading text-xl sm:text-2xl font-bold drop-shadow-md ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              {item.name}
            </h3>
            <p className="text-orange-600 font-bold text-lg">
              ₦{item.price.toLocaleString()}{' '}
              <span className={`text-xs font-normal ${isTerracotta ? 'text-stone-600' : 'text-neutral-300'}`}>
                / portion
              </span>
            </p>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-4">
          <p className={`text-xs line-clamp-2 ${isTerracotta ? 'text-stone-600' : 'text-neutral-300'}`}>
            {item.description}
          </p>

          {/* Quantity Selector */}
          <div
            className={`border rounded-xl p-3.5 flex items-center justify-between transition-colors ${
              isTerracotta
                ? 'bg-[#FAF7F0] border-[#E2D8C3]'
                : 'bg-neutral-950 border-neutral-800'
            }`}
          >
            <div>
              <span className={`text-xs uppercase font-semibold tracking-wider block ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                Quantity
              </span>
              <span className={`text-sm font-medium ${isTerracotta ? 'text-stone-800' : 'text-neutral-200'}`}>
                Number of portions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="quantity-minus-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={formData.quantity <= 1}
                className={`w-9 h-9 rounded-lg border disabled:opacity-40 flex items-center justify-center transition ${
                  isTerracotta
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-[#E2D8C3]'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className={`w-8 text-center font-bold text-lg ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                {formData.quantity}
              </span>
              <button
                type="button"
                id="quantity-plus-btn"
                onClick={() => handleQuantityChange(1)}
                className="w-9 h-9 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center text-white border border-red-500 shadow transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
              Your Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isTerracotta ? 'text-stone-400' : 'text-neutral-400'}`}>
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="order-customer-name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g., Emeka Obi / Blessing Ade"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                  isTerracotta
                    ? `bg-[#FAF7F0] text-stone-900 placeholder-stone-400 ${formErrors.customerName ? 'border-red-500' : 'border-[#E2D8C3]'}`
                    : `bg-neutral-950 text-white placeholder-neutral-500 ${formErrors.customerName ? 'border-red-500' : 'border-neutral-700'}`
                }`}
              />
            </div>
            {formErrors.customerName && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.customerName}
              </p>
            )}
          </div>

          {/* Delivery Location */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
              Delivery Location / Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isTerracotta ? 'text-stone-400' : 'text-neutral-400'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="order-delivery-location"
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                placeholder="e.g., Plot 12, Victoria Island / Lekki Phase 1"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                  isTerracotta
                    ? `bg-[#FAF7F0] text-stone-900 placeholder-stone-400 ${formErrors.deliveryLocation ? 'border-red-500' : 'border-[#E2D8C3]'}`
                    : `bg-neutral-950 text-white placeholder-neutral-500 ${formErrors.deliveryLocation ? 'border-red-500' : 'border-neutral-700'}`
                }`}
              />
            </div>
            {formErrors.deliveryLocation && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.deliveryLocation}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
              Phone Number <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isTerracotta ? 'text-stone-400' : 'text-neutral-400'}`}>
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                id="order-phone-number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g., 08012345678"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                  isTerracotta
                    ? `bg-[#FAF7F0] text-stone-900 placeholder-stone-400 ${formErrors.phoneNumber ? 'border-red-500' : 'border-[#E2D8C3]'}`
                    : `bg-neutral-950 text-white placeholder-neutral-500 ${formErrors.phoneNumber ? 'border-red-500' : 'border-neutral-700'}`
                }`}
              />
            </div>
            {formErrors.phoneNumber && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.phoneNumber}
              </p>
            )}
          </div>

          {/* Additional Notes (optional) */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
              Special Instructions{' '}
              <span className={`text-[10px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-500'}`}>
                (Optional)
              </span>
            </label>
            <input
              type="text"
              id="order-additional-notes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="e.g., Extra spicy, no shaki, add extra plantain..."
              className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                isTerracotta
                  ? 'bg-[#FAF7F0] border-[#E2D8C3] text-stone-900 placeholder-stone-400'
                  : 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
              }`}
            />
          </div>

          {/* Total & Action */}
          <div className={`pt-2 border-t ${isTerracotta ? 'border-[#EAE3D2]' : 'border-neutral-800'}`}>
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className={isTerracotta ? 'text-stone-600' : 'text-neutral-400'}>
                Total Bill ({formData.quantity} portion{formData.quantity > 1 ? 's' : ''}):
              </span>
              <span className="text-xl font-bold text-red-600 font-heading">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              id="place-order-whatsapp-btn"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Place Order on WhatsApp</span>
            </button>

            <p className={`text-[11px] text-center mt-2 ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
              Order will open your WhatsApp to chat with {settings.brandName} ({settings.phoneNumber})
            </p>
          </div>

          {isSubmitted && (
            <div className="p-3 bg-orange-100 border border-orange-500/50 rounded-xl flex items-center gap-2 text-xs text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Redirecting to WhatsApp DM with your formatted order...</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
