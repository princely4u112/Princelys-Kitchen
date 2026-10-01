import React, { useState, useMemo } from 'react';
import { Search, X, MessageSquare, AlertCircle, Sparkles, Flame, Check } from 'lucide-react';
import { MenuItem, FoodCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MenuPageProps {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  isLoading: boolean;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  menuItems,
  onSelectItem,
  isLoading
}) => {
  const { isTerracotta } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { id: FoodCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Dishes', count: menuItems.length },
    { id: 'rice', label: 'Rice Delicacies', count: menuItems.filter(i => i.category === 'rice').length },
    { id: 'soups', label: 'Traditional Soups', count: menuItems.filter(i => i.category === 'soups').length },
    { id: 'swallows', label: 'Swallows', count: menuItems.filter(i => i.category === 'swallows').length },
    { id: 'grills', label: 'Grills & Suya', count: menuItems.filter(i => i.category === 'grills').length },
    { id: 'specials', label: 'Chef Specials', count: menuItems.filter(i => i.category === 'specials').length },
    { id: 'drinks', label: 'Chilled Drinks', count: menuItems.filter(i => i.category === 'drinks').length }
  ];

  // Real-time filter & search engine
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menuItems
      .filter((item) => {
        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;

        if (!matchesCategory) return false;

        // Search query filter (matches name, description, category, or spiciness)
        if (!q) return true;

        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const spiceMatch = item.spiciness ? item.spiciness.toLowerCase().includes(q) : false;

        return nameMatch || descMatch || catMatch || spiceMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      });
  }, [menuItems, selectedCategory, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div
        className={`relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center border transition-colors ${
          isTerracotta ? 'bg-[#F5EFE6] border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="text-orange-600 text-xs font-bold uppercase tracking-widest block">
            Princely’s Kitchen Menu
          </span>
          <h1
            className={`font-heading text-3xl sm:text-5xl font-extrabold ${
              isTerracotta ? 'text-stone-900' : 'text-white'
            }`}
          >
            Authentic Nigerian Cuisine
          </h1>
          <p className={`text-sm sm:text-base ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
            Prepared fresh to order using indigenous Nigerian herbs, smoked seafood, premium proteins, and authentic native palm oil. Click any dish to order directly on WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter and Real-Time Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Real-time Search Input with Clear Button */}
          <div className="relative flex-1 max-w-lg">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${isTerracotta ? 'text-stone-400' : 'text-neutral-500'}`}>
              <Search className="w-4 h-4 text-orange-500" />
            </div>
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, e.g., Jollof, Afang, Egusi, Suya, Pounded Yam..."
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors shadow-xs ${
                isTerracotta
                  ? 'bg-white border-[#E2D8C3] text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-orange-500/20'
                  : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:ring-2 focus:ring-orange-500/20'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4 bg-neutral-800 rounded-full p-0.5" />
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className={`text-xs font-semibold whitespace-nowrap ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`rounded-xl px-3 py-2 text-xs border focus:outline-none focus:border-orange-500 cursor-pointer ${
                isTerracotta
                  ? 'bg-white border-[#E2D8C3] text-stone-800'
                  : 'bg-neutral-900 border-neutral-800 text-white'
              }`}
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md shadow-red-950/30 border border-orange-500/40 scale-105'
                    : isTerracotta
                    ? 'bg-white text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE0] border border-[#E2D8C3]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/25 text-white' : 'bg-neutral-800/40 text-neutral-400'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Real-time Search & Filter Status Feedback */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
          <div className={isTerracotta ? 'text-stone-600' : 'text-neutral-400'}>
            Showing <strong className="text-orange-500">{filteredItems.length}</strong> of {menuItems.length} dishes
            {searchQuery && (
              <span> matching "<strong className={isTerracotta ? 'text-stone-900' : 'text-white'}>{searchQuery}</strong>"</span>
            )}
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-orange-500">{categories.find(c => c.id === selectedCategory)?.label}</strong></span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-orange-600 hover:text-red-700 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters & Search</span>
            </button>
          )}
        </div>
      </div>

      {/* Menu Cards Grid */}
      {isLoading ? (
        <div className={`py-20 text-center space-y-3 ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm">Fetching fresh menu from database...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div
          className={`py-16 text-center border rounded-2xl max-w-md mx-auto p-8 space-y-4 ${
            isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-heading text-lg font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
              No dishes found
            </h3>
            <p className={`text-xs mt-1 ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              {searchQuery
                ? `No meals matched "${searchQuery}". Check the spelling or search another dish.`
                : 'No meals in this category at the moment.'}
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs rounded-xl shadow transition hover:scale-105 cursor-pointer"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group ${
                isTerracotta
                  ? item.is_available
                    ? 'bg-white border-[#E2D8C3] hover:border-orange-500/70 shadow-sm hover:shadow-lg hover:shadow-orange-950/10'
                    : 'bg-white border-[#E2D8C3]/50 opacity-60'
                  : item.is_available
                  ? 'bg-neutral-900 border-neutral-800 hover:border-orange-500/60 shadow-lg hover:shadow-orange-950/20'
                  : 'bg-neutral-900 border-neutral-800/40 opacity-70'
              }`}
            >
              {/* Image Box */}
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

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-orange-400 backdrop-blur-md border border-neutral-700">
                    {item.category}
                  </span>
                  {item.is_featured && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow">
                      Popular
                    </span>
                  )}
                </div>

                {/* Price tag */}
                <div className="absolute bottom-3 right-3 bg-red-600 text-white font-bold text-base px-3.5 py-1.5 rounded-lg shadow-lg border border-red-400/40">
                  ₦{item.price.toLocaleString()}
                </div>

                {!item.is_available && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-red-950 text-red-300 border border-red-800 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                      Temporarily Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
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

                {/* Card Footer */}
                <div
                  className={`pt-3 border-t flex items-center justify-between gap-2 ${
                    isTerracotta ? 'border-[#EAE3D2]' : 'border-neutral-800'
                  }`}
                >
                  <div className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                    {item.preparation_time ? (
                      <span>Ready in {item.preparation_time}</span>
                    ) : (
                      <span>Freshly made</span>
                    )}
                  </div>

                  <button
                    id={`menu-order-btn-${item.id}`}
                    onClick={() => onSelectItem(item)}
                    disabled={!item.is_available}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
