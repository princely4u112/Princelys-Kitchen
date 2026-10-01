import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { CustomerReview, MenuItem } from '../types';
import { addReview } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onReviewAdded: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onReviewAdded
}) => {
  const { isTerracotta } = useTheme();
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [dishMentioned, setDishMentioned] = useState(menuItems[0]?.name || 'Smoky Party Jollof Rice');
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!reviewText.trim()) {
      setErrorMsg('Please write your review feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview: CustomerReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        customer_name: customerName.trim(),
        location: location.trim() || 'Nigeria',
        rating,
        dish_mentioned: dishMentioned,
        review_text: reviewText.trim(),
        date: 'Just now',
        is_verified: true,
        created_at: new Date().toISOString()
      };

      const res = await addReview(newReview);
      if (res.success) {
        setIsSuccess(true);
        onReviewAdded();
        setTimeout(() => {
          setIsSuccess(false);
          setCustomerName('');
          setLocation('');
          setReviewText('');
          onClose();
        }, 1800);
      } else {
        setErrorMsg(res.error || 'Failed to submit review');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden transition-colors ${
          isTerracotta ? 'bg-[#FDFBF7] border-[#E2D8C3] text-stone-900' : 'bg-neutral-900 border-neutral-800 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isTerracotta ? 'bg-[#F5EFE6] border-[#E2D8C3]' : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          <div>
            <h3 className="font-heading text-lg font-bold">Leave a Customer Review</h3>
            <p className={`text-xs ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
              Share your experience enjoying meals from Princely’s Kitchen
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isTerracotta ? 'hover:bg-stone-200 text-stone-600' : 'hover:bg-neutral-800 text-neutral-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
              <h4 className="font-heading text-xl font-bold">Thank You for Your Review!</h4>
              <p className={`text-xs ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                Your feedback has been published and helps others discover authentic Nigerian cuisine.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-500 mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating !== null ? hoverRating >= star : rating >= star)
                            ? 'text-amber-400 fill-amber-400'
                            : isTerracotta
                            ? 'text-stone-300'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className={`text-xs font-bold ml-2 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Tunde Bakare, Chidinma O."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
                    isTerracotta
                      ? 'bg-white border-[#E2D8C3] text-stone-900'
                      : 'bg-neutral-950 border-neutral-700 text-white'
                  }`}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                  Your City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Lekki Phase 1, Lagos or Maitama, Abuja"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
                    isTerracotta
                      ? 'bg-white border-[#E2D8C3] text-stone-900'
                      : 'bg-neutral-950 border-neutral-700 text-white'
                  }`}
                />
              </div>

              {/* Dish Mentioned */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                  Which Dish Did You Enjoy?
                </label>
                <select
                  value={dishMentioned}
                  onChange={(e) => setDishMentioned(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
                    isTerracotta
                      ? 'bg-white border-[#E2D8C3] text-stone-900'
                      : 'bg-neutral-950 border-neutral-700 text-white'
                  }`}
                >
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                  <option value="General Experience">General Catering & Fast Delivery</option>
                </select>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
                  Your Review / Food Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How was the firewood flavor, seasoning, portion size, and delivery?"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 ${
                    isTerracotta
                      ? 'bg-white border-[#E2D8C3] text-stone-900'
                      : 'bg-neutral-950 border-neutral-700 text-white'
                  }`}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isSubmitting ? 'Posting Review...' : 'Post Customer Review'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
