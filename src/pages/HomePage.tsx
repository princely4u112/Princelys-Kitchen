import React, { useState, useEffect, useMemo } from 'react';
import {
  UtensilsCrossed,
  MessageSquare,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Star,
  Quote,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { MenuItem, ActivePage, CustomerReview } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ReviewModal } from '../components/ReviewModal';

interface HomePageProps {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  setActivePage: (page: ActivePage) => void;
  reviews?: CustomerReview[];
  onRefreshReviews?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  menuItems,
  onSelectItem,
  setActivePage,
  reviews = [],
  onRefreshReviews
}) => {
  const { isTerracotta } = useTheme();
  const { settings, formatWhatsApp } = useSiteSettings();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // All meals from the menu for rotating Hero background
  const heroMeals = useMemo(() => {
    const withImages = menuItems.filter((i) => i.image_url && i.image_url.trim().length > 0);
    if (withImages.length > 0) return withImages;
    return menuItems;
  }, [menuItems]);

  // Rotate Hero meal every 10 seconds with 3-second slow fade-out & slide left
  const [heroIndex, setHeroIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    if (heroMeals.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((curr) => {
        setPrevIndex(curr);
        return (curr + 1) % heroMeals.length;
      });
    }, 10000); // 10 seconds loop

    return () => clearInterval(interval);
  }, [heroMeals.length]);

  const handleSelectHero = (newIdx: number) => {
    if (newIdx === heroIndex) return;
    setPrevIndex(heroIndex);
    setHeroIndex(newIdx);
  };

  const currentHeroMeal = heroMeals[heroIndex] || menuItems[0];

  // Curated featured Nigerian specialties
  const featuredKeywords = ['jollof', 'fried rice', 'afang', 'egusi', 'pounded yam', 'suya'];
  const featuredItems = menuItems.filter((item) => {
    if (item.is_featured) return true;
    const nameLower = item.name.toLowerCase();
    return featuredKeywords.some((kw) => nameLower.includes(kw));
  }).slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      {/* ========================================================================= */}
      {/* HERO SECTION - REFINED PROPORTIONS TO SHOW DISH IMAGES CLEARLY           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div
          className={`relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] rounded-3xl overflow-hidden flex items-center justify-center border shadow-2xl py-12 sm:py-16 lg:py-20 transition-colors ${
            isTerracotta ? 'border-[#E2D8C3] bg-[#F5EFE6]' : 'border-neutral-800 bg-neutral-950'
          }`}
        >
          {/* Background Rotating Images with 3-Second Fade-Out & Smooth Slide-Left Transition */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {heroMeals.map((meal, idx) => {
              const isCurrent = idx === heroIndex;
              const isPrev = idx === prevIndex;

              // When an image is outgoing (isPrev), it slides to the left (-translate-x-full)
              // and slowly fades out to 0 opacity over 3000ms.
              // When an image is incoming/active (isCurrent), it settles at translate-x-0 with full opacity over 3000ms.
              // Other images stay in the waiting queue without transition flashes.
              let slideStyleClass = 'opacity-0 translate-x-full z-0 transition-none pointer-events-none';

              if (isCurrent) {
                slideStyleClass = 'opacity-100 translate-x-0 z-10 duration-[3000ms] ease-in-out pointer-events-auto';
              } else if (isPrev) {
                slideStyleClass = 'opacity-0 -translate-x-full z-20 duration-[3000ms] ease-in-out pointer-events-none';
              }

              return (
                <div
                  key={meal.id}
                  className={`absolute inset-0 transition-all will-change-[transform,opacity] ${slideStyleClass}`}
                >
                  <img
                    src={meal.image_url}
                    alt={meal.name}
                    className="w-full h-full object-cover object-center transform-gpu transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85';
                    }}
                  />
                </div>
              );
            })}

            {/* Light ambient scrim to ensure text legibility while keeping food fully visible and vibrant */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/45 pointer-events-none" />
            <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          </div>

          {/* Hero Content with high-contrast text styling */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="space-y-3">
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
                {settings.heroHeadline}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 text-2xl sm:text-4xl lg:text-5xl font-serif italic mt-2 drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]">
                  {settings.heroAccent}
                </span>
              </h1>
            </div>

            <div className="max-w-2xl mx-auto bg-black/55 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/20 shadow-2xl">
              <p className="text-white text-sm sm:text-base sm:leading-relaxed font-medium drop-shadow-md">
                {settings.heroDescription}
              </p>
            </div>

            {/* Call to Actions */}
            <div className="pt-2 flex items-center justify-center">
              <button
                id="hero-explore-menu-btn"
                onClick={() => {
                  setActivePage('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-9 py-3.5 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-red-950/60 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>Explore Our Menu</span>
              </button>
            </div>

            {/* Dynamic Active Hero Dish Badge with Dish Thumbnail & Slide Controls */}
            {currentHeroMeal && (
              <div className="pt-3 flex flex-col items-center gap-3">
                <div
                  onClick={() => onSelectItem(currentHeroMeal)}
                  className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/80 hover:bg-black/95 border border-orange-500/50 text-white text-xs backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-xl group"
                  title="Click to order this meal on WhatsApp"
                >
                  <img
                    src={currentHeroMeal.image_url}
                    alt={currentHeroMeal.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-orange-400 shrink-0 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-orange-400 font-bold uppercase tracking-wider text-[11px]">
                    {heroIndex + 1} of {heroMeals.length}:
                  </span>
                  <span className="font-bold group-hover:text-orange-300 transition-colors">{currentHeroMeal.name}</span>
                  <span className="bg-red-600 px-2 py-0.5 rounded text-[11px] font-bold">
                    ₦{currentHeroMeal.price.toLocaleString()}
                  </span>
                  <span className="text-orange-400 text-[11px] underline hidden sm:inline">Order Now →</span>
                </div>

                {/* All Dish Slide Dots without arrow controls */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md py-1.5 px-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 scrollbar-none shadow-lg">
                  {heroMeals.map((meal, idx) => (
                    <button
                      key={meal.id}
                      onClick={() => handleSelectHero(idx)}
                      className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                        idx === heroIndex
                          ? 'w-7 bg-orange-500 shadow-sm shadow-orange-500/50'
                          : 'w-2 bg-neutral-600/80 hover:bg-neutral-400'
                      }`}
                      aria-label={`Slide to ${meal.name}`}
                      title={`${idx + 1}. ${meal.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Value Badges */}
            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl backdrop-blur-md flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">Firewood Taste</span>
                  <span className="text-[10px] text-neutral-400">Authentic smoky aroma</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl backdrop-blur-md flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">100% Native</span>
                  <span className="text-[10px] text-neutral-400">Oron crayfish & herbs</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl backdrop-blur-md flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">Swift Delivery</span>
                  <span className="text-[10px] text-neutral-400">Hot and fresh to gate</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl backdrop-blur-md flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">Zero Compromise</span>
                  <span className="text-[10px] text-neutral-400">Strict hygiene & cuts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED NIGERIAN FOOD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-neutral-800">
          <div>
            <span className="text-orange-600 text-xs font-bold uppercase tracking-widest block">
              Curated Specialties
            </span>
            <h2
              className={`font-heading text-3xl sm:text-4xl font-bold mt-1 ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              Popular Nigerian Dishes
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Handcrafted delicacies prepared with indigenous firewood cooking and authentic palm oil.
            </p>
          </div>

          <button
            onClick={() => {
              setActivePage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-orange-500 hover:text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Menu ({menuItems.length} Dishes)</span>
            <span>→</span>
          </button>
        </div>

        {/* Featured Dish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group ${
                isTerracotta
                  ? 'bg-white border-[#E2D8C3] hover:border-orange-500 shadow-sm hover:shadow-lg hover:shadow-orange-950/10'
                  : 'bg-neutral-900 border-neutral-800 hover:border-orange-500 shadow-xl hover:shadow-orange-950/20'
              }`}
            >
              <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-orange-400 backdrop-blur-md border border-neutral-700">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-red-600 text-white font-bold text-base px-3.5 py-1.5 rounded-lg shadow-lg border border-red-400/40">
                  ₦{item.price.toLocaleString()}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    className={`font-heading text-xl font-bold transition-colors ${
                      isTerracotta
                        ? 'text-stone-900 group-hover:text-red-700'
                        : 'text-white group-hover:text-orange-400'
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                    {item.description}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t flex items-center justify-between gap-2 ${
                    isTerracotta ? 'border-[#EAE3D2]' : 'border-neutral-800'
                  }`}
                >
                  <span className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                    {item.preparation_time || 'Freshly made'}
                  </span>

                  <button
                    onClick={() => onSelectItem(item)}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CUSTOMER REVIEWS & TESTIMONIALS SECTION                                    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl p-8 sm:p-12 border ${
            isTerracotta ? 'bg-[#F9F5EE] border-[#E2D8C3]' : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-800/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/15 border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-orange-500" />
                <span>Verified Customer Feedback</span>
              </div>
              <h2
                className={`font-heading text-3xl sm:text-4xl font-bold ${
                  isTerracotta ? 'text-stone-900' : 'text-white'
                }`}
              >
                What Food Lovers Say About Princely’s
              </h2>
              <p className={`text-xs sm:text-sm mt-1.5 max-w-xl ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                Read genuine reviews from customers across Lagos, Abuja, and beyond enjoying our authentic Nigerian dishes.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 text-amber-400 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className={`font-bold text-sm ml-1 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                    4.9 / 5.0
                  </span>
                </div>
                <span className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  Based on verified food orders
                </span>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Leave a Review</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isTerracotta
                    ? 'bg-white border-[#E2D8C3] hover:border-orange-500/50 shadow-xs'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700 shadow-md'
                }`}
              >
                <div className="space-y-3">
                  {/* Rating Stars & Verified Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>

                    {rev.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Order
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className={`text-xs sm:text-sm leading-relaxed italic ${isTerracotta ? 'text-stone-700' : 'text-neutral-200'}`}>
                    "{rev.review_text}"
                  </p>

                  {/* Dish Mentioned */}
                  {rev.dish_mentioned && (
                    <div className="pt-1">
                      <span className="text-[11px] font-semibold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20 inline-block">
                        Dish: {rev.dish_mentioned}
                      </span>
                    </div>
                  )}
                </div>

                {/* Reviewer Details */}
                <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${isTerracotta ? 'border-stone-100' : 'border-neutral-800'}`}>
                  <div>
                    <h4 className={`font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                      {rev.customer_name}
                    </h4>
                    {rev.location && (
                      <span className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                        {rev.location}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] ${isTerracotta ? 'text-stone-400' : 'text-neutral-500'}`}>
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        className={`py-16 border-y transition-colors ${
          isTerracotta ? 'bg-[#F4ECE1] border-[#DFD5C2]' : 'bg-neutral-950/70 border-neutral-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-orange-600 text-xs font-bold uppercase tracking-widest block">
              The True Taste of Tradition
            </span>
            <h2
              className={`font-heading text-3xl sm:text-4xl font-bold ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              Why Food Lovers Choose Princely’s Kitchen
            </h2>
            <p className={`text-sm ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Every pot tells an indigenous Nigerian story. Cooked with pride, heart, and the finest local produce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`p-8 rounded-2xl border transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900/80 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600 mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className={`font-heading text-xl font-bold mb-2 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                Smoky Firewood Jollof
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                We honor the timeless Nigerian party method. Simmered over firewood for that irresistible bottom-pot smoke, red bell peppers, and fragrant bay leaves.
              </p>
            </div>

            <div
              className={`p-8 rounded-2xl border transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900/80 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-600 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className={`font-heading text-xl font-bold mb-2 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                Pure Native Ingredients
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                Zero shortcuts. Real unadulterated red palm oil, sun-dried Oron crayfish, fresh waterleaf, wild uziza, and thick stockfish (okporoko) from Eastern waters.
              </p>
            </div>

            <div
              className={`p-8 rounded-2xl border transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900/80 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className={`font-heading text-xl font-bold mb-2 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                Spotless Clean Kitchen
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                Rigorous culinary hygiene. Only Grade-A fresh beef, goat meat, and fresh seafood washed and prepared under clinical cleanliness standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ORDER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-800 via-orange-700 to-red-900 p-8 sm:p-14 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-300 border border-white/20 inline-block">
              Immediate Food Dispatch
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black leading-tight">
              Craving Fresh Nigerian Food Right Now?
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Click any dish on our menu, enter your delivery address, and we'll immediately dispatch your hot food straight to your door.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setActivePage('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white text-stone-950 font-bold text-sm rounded-xl shadow-lg hover:bg-neutral-100 transition-transform hover:scale-105 cursor-pointer"
              >
                Browse Menu
              </button>
              <a
                href={formatWhatsApp(`Hello ${settings.brandName}, I am ready to order!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-black/40 hover:bg-black/60 text-white font-bold text-sm rounded-xl border border-white/30 backdrop-blur-md flex items-center gap-2 transition-transform hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <span>Chat on WhatsApp ({settings.phoneNumber})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal for Submitting a Customer Review */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        menuItems={menuItems}
        onReviewAdded={() => {
          if (onRefreshReviews) onRefreshReviews();
        }}
      />
    </div>
  );
};
