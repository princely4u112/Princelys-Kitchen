import React, { useState, useRef } from 'react';
import {
  Flame,
  Heart,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Edit2,
  X,
  Upload,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ActivePage, MenuItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AboutPageProps {
  setActivePage: (page: ActivePage) => void;
  menuItems?: MenuItem[];
  onOpenAdmin?: (tab?: 'settings' | 'manage') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  setActivePage,
  menuItems = [],
  onOpenAdmin
}) => {
  const { isTerracotta } = useTheme();
  const { settings, updateSettings } = useSiteSettings();
  const { isAdmin } = useAdminAuth();

  // Quick Edit Modal state for dish images
  const [editingDishNumber, setEditingDishNumber] = useState<1 | 2 | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editMenuId, setEditMenuId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const secretClickCountRef = useRef(0);
  const secretClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOwnerSecretClick = () => {
    if (isAdmin) return;
    secretClickCountRef.current += 1;
    if (secretClickTimeoutRef.current) clearTimeout(secretClickTimeoutRef.current);

    if (secretClickCountRef.current >= 3) {
      secretClickCountRef.current = 0;
      if (onOpenAdmin) onOpenAdmin('settings');
    } else {
      secretClickTimeoutRef.current = setTimeout(() => {
        secretClickCountRef.current = 0;
      }, 1000);
    }
  };

  // Dynamic values resolved from settings or linked menu items
  const linkedDish1 = menuItems.find((item) => item.id === settings.aboutDish1MenuId);
  const dish1Image =
    settings.aboutDish1Image ||
    linkedDish1?.image_url ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
  const dish1Title =
    settings.aboutDish1Title ||
    linkedDish1?.name ||
    'Authentic Swallows';
  const dish1Subtitle =
    settings.aboutDish1Subtitle ||
    (linkedDish1 ? linkedDish1.description : 'Hot, stretchy Pounded Yam & Semovita');

  const linkedDish2 = menuItems.find((item) => item.id === settings.aboutDish2MenuId);
  const dish2Image =
    settings.aboutDish2Image ||
    linkedDish2?.image_url ||
    'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=800&q=80';
  const dish2Title =
    settings.aboutDish2Title ||
    linkedDish2?.name ||
    'Party Jollof Rice';
  const dish2Subtitle =
    settings.aboutDish2Subtitle ||
    (linkedDish2 ? linkedDish2.description : 'Firewood smoked & rich pepper base');

  // Open modal with prefilled data for Dish 1 or Dish 2 (Admin Only)
  const handleOpenEditModal = (dishNumber: 1 | 2) => {
    if (!isAdmin) return;
    setEditingDishNumber(dishNumber);
    setFeedbackNotice('');
    if (dishNumber === 1) {
      setEditImageUrl(dish1Image);
      setEditTitle(dish1Title);
      setEditSubtitle(dish1Subtitle);
      setEditMenuId(settings.aboutDish1MenuId || '');
    } else {
      setEditImageUrl(dish2Image);
      setEditTitle(dish2Title);
      setEditSubtitle(dish2Subtitle);
      setEditMenuId(settings.aboutDish2MenuId || '');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEditImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Pick a dish from current menu items
  const handleSelectMenuItem = (item: MenuItem) => {
    setEditImageUrl(item.image_url);
    setEditTitle(item.name);
    setEditSubtitle(item.description);
    setEditMenuId(item.id);
  };

  const handleSaveDishChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Unauthorized: Only administrators can modify dishes.');
      return;
    }
    if (!editImageUrl.trim()) {
      alert('Please provide an image URL or upload a photo.');
      return;
    }
    setIsSaving(true);
    try {
      const updates =
        editingDishNumber === 1
          ? {
              aboutDish1Image: editImageUrl.trim(),
              aboutDish1Title: editTitle.trim() || 'Authentic Swallows',
              aboutDish1Subtitle: editSubtitle.trim() || 'Hot, stretchy Pounded Yam & Semovita',
              aboutDish1MenuId: editMenuId || undefined
            }
          : {
              aboutDish2Image: editImageUrl.trim(),
              aboutDish2Title: editTitle.trim() || 'Party Jollof Rice',
              aboutDish2Subtitle: editSubtitle.trim() || 'Firewood smoked & rich pepper base',
              aboutDish2MenuId: editMenuId || undefined
            };

      const res = await updateSettings(updates);
      if (res.success) {
        setFeedbackNotice('Dish image and details updated successfully!');
        setTimeout(() => {
          setEditingDishNumber(null);
          setFeedbackNotice('');
        }, 1200);
      } else {
        alert(res.error || 'Failed to save changes.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <section
        className={`relative rounded-3xl overflow-hidden border p-8 sm:p-16 transition-colors ${
          isTerracotta
            ? 'bg-[#F5EFE6] border-[#E2D8C3]'
            : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 text-orange-600 text-xs font-bold uppercase tracking-wider border border-red-500/30">
            <Flame className="w-4 h-4 text-orange-600" />
            <span>Our Heritage & Culinary Story</span>
          </div>

          <h1
            className={`font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight ${
              isTerracotta ? 'text-stone-900' : 'text-white'
            }`}
          >
            Preserving the Rich, Unapologetic Soul of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-600">
              Nigerian Cuisine
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed pt-2 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
            {settings.aboutStory}
          </p>
        </div>
      </section>

      {/* Narrative & Visual Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              onClick={handleOwnerSecretClick}
              className="text-orange-600 text-xs font-bold uppercase tracking-widest block select-none cursor-default"
              title={isAdmin ? 'Admin Mode Active' : undefined}
            >
              The Princely Philosophy
            </span>
            {isAdmin && onOpenAdmin && (
              <button
                type="button"
                onClick={() => onOpenAdmin('settings')}
                className="text-xs text-orange-500 hover:text-orange-400 inline-flex items-center gap-1.5 transition px-2.5 py-1 rounded-lg bg-orange-600/10 border border-orange-500/30"
                title="Manage all About Us content in Admin"
              >
                <Edit2 className="w-3 h-3" />
                <span>Admin Settings</span>
              </button>
            )}
          </div>

          <h2 className={`font-heading text-3xl font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
            No Artificial Shortcuts. Pure Native Ingredients.
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
            In modern fast-food dining, authentic flavors are all too often replaced with synthetic seasonings and watery soups. At Princely’s Kitchen, we reject shortcuts. 
          </p>
          <p className={`text-sm leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
            Our crayfish is shipped directly from the coastal waters of Oron, Akwa Ibom. Our red palm oil is pure and unbleached. Our Jollof rice base is slow-roasted over real firewood to develop that coveted party smoke flavor. Every pot of Afang, Egusi, and Fisherman Soup is loaded with real stockfish (okporoko), dry catfish, kpomo, and assorted meats.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <span className="font-heading text-2xl font-bold text-orange-600">100%</span>
              <span className={`block text-xs font-bold mt-1 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                Native Ingredients
              </span>
              <span className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                Locust beans, scent leaf & uziza
              </span>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <span className="font-heading text-2xl font-bold text-red-600">0%</span>
              <span className={`block text-xs font-bold mt-1 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                Shortcuts or Fillers
              </span>
              <span className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                Thick rich broth every time
              </span>
            </div>
          </div>
        </div>

        {/* Dish Showcase Grid (Protected against visitor edits) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span
              onClick={handleOwnerSecretClick}
              className="font-medium text-orange-500 flex items-center gap-1.5 cursor-default select-none"
              title={isAdmin ? 'Admin Mode Active' : undefined}
            >
              {isAdmin ? <Camera className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Signature Dish Spotlights</span>
            </span>
            {isAdmin ? (
              <span className="px-2.5 py-0.5 rounded-full bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[11px] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-orange-400" />
                <span>Admin Mode (Click photo to edit)</span>
              </span>
            ) : (
              <span className={`text-[11px] ${isTerracotta ? 'text-stone-500' : 'text-neutral-500'}`}>
                Freshly prepared with native ingredients
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Dish Spotlight 1 */}
            <div className="space-y-4">
              <div
                className={`group relative rounded-2xl overflow-hidden h-64 border shadow-md transition ${
                  isTerracotta ? 'border-[#E2D8C3]' : 'border-neutral-800'
                }`}
              >
                <img
                  src={dish1Image}
                  alt={dish1Title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Edit Button Overlay (ONLY for Authenticated Admin) */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(1)}
                      className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change Dish / Image</span>
                    </button>
                    <p className="text-[10px] text-white/80 mt-2">Click to replace photo or select from menu</p>
                  </div>
                )}

                {/* Persistent Edit Badge (ONLY for Authenticated Admin) */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(1)}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[11px] font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
                    title="Edit this dish image"
                  >
                    <Camera className="w-3 h-3 text-orange-400" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div
                onClick={() => {
                  if (isAdmin) handleOpenEditModal(1);
                }}
                className={`p-4 rounded-2xl text-center border transition ${
                  isAdmin ? 'cursor-pointer hover:border-orange-500/50' : ''
                } ${
                  isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <span className={`font-heading text-xl font-bold block ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                  {dish1Title}
                </span>
                <p className={`text-xs mt-1 ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  {dish1Subtitle}
                </p>
              </div>
            </div>

            {/* Dish Spotlight 2 */}
            <div className="space-y-4 pt-6">
              <div
                onClick={() => {
                  if (isAdmin) handleOpenEditModal(2);
                }}
                className={`p-4 rounded-2xl text-center border transition ${
                  isAdmin ? 'cursor-pointer hover:border-orange-500/50' : ''
                } ${
                  isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <span className="font-heading text-xl font-bold text-orange-600 block">
                  {dish2Title}
                </span>
                <p className={`text-xs mt-1 ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  {dish2Subtitle}
                </p>
              </div>

              <div
                className={`group relative rounded-2xl overflow-hidden h-64 border shadow-md transition ${
                  isTerracotta ? 'border-[#E2D8C3]' : 'border-neutral-800'
                }`}
              >
                <img
                  src={dish2Image}
                  alt={dish2Title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Edit Button Overlay (ONLY for Authenticated Admin) */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(2)}
                      className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change Dish / Image</span>
                    </button>
                    <p className="text-[10px] text-white/80 mt-2">Click to replace photo or select from menu</p>
                  </div>
                )}

                {/* Persistent Edit Badge (ONLY for Authenticated Admin) */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(2)}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[11px] font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
                    title="Edit this dish image"
                  >
                    <Camera className="w-3 h-3 text-orange-400" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Princely Pillars */}
      <section
        className={`border rounded-3xl p-8 sm:p-12 transition-colors ${
          isTerracotta ? 'bg-[#F5EFE6] border-[#E2D8C3]' : 'bg-neutral-950 border-neutral-900'
        }`}
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-orange-600 text-xs font-bold uppercase tracking-widest block mb-1">
            Our Core Values
          </span>
          <h2 className={`font-heading text-3xl font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
            The Princely Kitchen Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`p-6 rounded-2xl space-y-3 border ${
              isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className={`font-heading text-lg font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
              Heritage Recipes
            </h3>
            <p className={`text-xs leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              We preserve regional culinary traditions from across Nigeria — Yoruba, Igbo, Efik, and Hausa dishes prepared with honor.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl space-y-3 border ${
              isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-600">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className={`font-heading text-lg font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
              Generous Portions
            </h3>
            <p className={`text-xs leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Nigerian dining is about hospitality. We serve hearty, satisfying plates that leave you energized, full, and smiling.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl space-y-3 border ${
              isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`font-heading text-lg font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
              Spotless Hygiene
            </h3>
            <p className={`text-xs leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Our kitchen adheres to the strictest food safety and sanitation standards. Fresh meats and vegetables sanitized thoroughly.
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl space-y-3 border ${
              isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className={`font-heading text-lg font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
              WhatsApp Direct
            </h3>
            <p className={`text-xs leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Experience seamless, personalized customer care. Chat directly with us to customize your spice levels and delivery times.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="text-center py-6">
        <button
          onClick={() => {
            setActivePage('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-base shadow-xl inline-flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Browse Today’s Fresh Menu</span>
        </button>
      </section>

      {/* QUICK DISH IMAGE EDIT MODAL (Admin Only) */}
      {isAdmin && editingDishNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Edit About Page Dish {editingDishNumber}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Upload a new photo, paste an image link, or choose from your menu
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingDishNumber(null)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveDishChanges} className="p-6 overflow-y-auto space-y-5 flex-1">
              {feedbackNotice && (
                <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-green-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{feedbackNotice}</span>
                </div>
              )}

              {/* Photo Preview & Upload Controls */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-400">
                  Dish Photo / Image
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                  <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-lg bg-neutral-800">
                    <img
                      src={editImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2.5 w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload from Device / Phone</span>
                    </button>

                    <div>
                      <input
                        type="url"
                        value={editImageUrl}
                        onChange={(e) => {
                          setEditImageUrl(e.target.value);
                          setEditMenuId('');
                        }}
                        placeholder="Or paste image URL (https://...)"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Select from Live Menu Items */}
              {menuItems.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Or Pick from Your Menu Dishes:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectMenuItem(item)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                          editImageUrl === item.image_url
                            ? 'bg-orange-600/20 border-orange-500 text-white'
                            : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-neutral-700"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate">{item.name}</p>
                          <p className="text-[10px] text-orange-400">₦{item.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dish Titles */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Dish Title / Heading
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Authentic Swallows or Party Jollof"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Dish Subtitle / Caption
                  </label>
                  <textarea
                    rows={2}
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    placeholder="e.g. Hot, stretchy Pounded Yam & Semovita"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-neutral-800">
                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDishNumber(null);
                      onOpenAdmin('settings');
                    }}
                    className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1 transition"
                  >
                    <span>Full Admin Settings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingDishNumber(null)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Dish Image'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
