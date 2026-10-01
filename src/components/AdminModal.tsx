import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Database,
  Check,
  Copy,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Upload,
  CheckCircle2,
  Save,
  Star,
  MessageSquare,
  Sparkles,
  Link,
  UploadCloud,
  Globe,
  Flame,
  Camera,
  UtensilsCrossed
} from 'lucide-react';
import { MenuItem, FoodCategory, CustomerReview } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  SUPABASE_SCHEMA_SQL,
  getActiveSupabaseCredentials,
  saveCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  resetMenuToDefaults,
  addReview,
  updateReview,
  deleteReview,
  resetReviewsToDefaults,
  testSupabaseConnection,
  pushLocalDataToSupabase
} from '../lib/supabase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onRefreshMenu: () => void;
  isSupabaseActive: boolean;
  reviews?: CustomerReview[];
  onRefreshReviews?: () => void;
  initialTab?: 'manage' | 'add' | 'settings' | 'reviews' | 'database';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onRefreshMenu,
  isSupabaseActive,
  reviews = [],
  onRefreshReviews,
  initialTab = 'manage'
}) => {
  const { isAdmin, login, logout } = useAdminAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Tabs: manage, add/edit dish, settings, reviews, database config
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'settings' | 'reviews' | 'database'>(initialTab);

  // Sync tab when initialTab changes or modal opens
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Site Settings from context
  const {
    settings: globalSettings,
    updateSettings: updateGlobalSettings,
    resetSettings: resetGlobalSettings
  } = useSiteSettings();

  // Site & Contact Settings Form State
  const [siteBrandName, setSiteBrandName] = useState(globalSettings.brandName);
  const [siteBrandSubtitle, setSiteBrandSubtitle] = useState(globalSettings.brandSubtitle);
  const [sitePhone, setSitePhone] = useState(globalSettings.phoneNumber);
  const [siteWhatsapp, setSiteWhatsapp] = useState(globalSettings.whatsappNumber);
  const [siteEmail, setSiteEmail] = useState(globalSettings.email);
  const [siteAddress, setSiteAddress] = useState(globalSettings.address);
  const [siteHoursWeekdays, setSiteHoursWeekdays] = useState(globalSettings.openingHoursWeekdays);
  const [siteHoursSunday, setSiteHoursSunday] = useState(globalSettings.openingHoursSunday);
  const [siteHeroHeadline, setSiteHeroHeadline] = useState(globalSettings.heroHeadline);
  const [siteHeroAccent, setSiteHeroAccent] = useState(globalSettings.heroAccent);
  const [siteHeroDesc, setSiteHeroDesc] = useState(globalSettings.heroDescription);
  const [siteAboutStory, setSiteAboutStory] = useState(globalSettings.aboutStory);
  const [siteNoticeBanner, setSiteNoticeBanner] = useState(globalSettings.noticeBanner);

  // About Page Dish Showcases Form State
  const [siteAboutDish1Image, setSiteAboutDish1Image] = useState(globalSettings.aboutDish1Image || '');
  const [siteAboutDish1Title, setSiteAboutDish1Title] = useState(globalSettings.aboutDish1Title || '');
  const [siteAboutDish1Subtitle, setSiteAboutDish1Subtitle] = useState(globalSettings.aboutDish1Subtitle || '');
  const [siteAboutDish1MenuId, setSiteAboutDish1MenuId] = useState(globalSettings.aboutDish1MenuId || '');

  const [siteAboutDish2Image, setSiteAboutDish2Image] = useState(globalSettings.aboutDish2Image || '');
  const [siteAboutDish2Title, setSiteAboutDish2Title] = useState(globalSettings.aboutDish2Title || '');
  const [siteAboutDish2Subtitle, setSiteAboutDish2Subtitle] = useState(globalSettings.aboutDish2Subtitle || '');
  const [siteAboutDish2MenuId, setSiteAboutDish2MenuId] = useState(globalSettings.aboutDish2MenuId || '');

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const dish1FileInputRef = useRef<HTMLInputElement>(null);
  const dish2FileInputRef = useRef<HTMLInputElement>(null);

  // Sync settings when globalSettings changes
  useEffect(() => {
    if (globalSettings) {
      setSiteBrandName(globalSettings.brandName || '');
      setSiteBrandSubtitle(globalSettings.brandSubtitle || '');
      setSitePhone(globalSettings.phoneNumber || '');
      setSiteWhatsapp(globalSettings.whatsappNumber || '');
      setSiteEmail(globalSettings.email || '');
      setSiteAddress(globalSettings.address || '');
      setSiteHoursWeekdays(globalSettings.openingHoursWeekdays || '');
      setSiteHoursSunday(globalSettings.openingHoursSunday || '');
      setSiteHeroHeadline(globalSettings.heroHeadline || '');
      setSiteHeroAccent(globalSettings.heroAccent || '');
      setSiteHeroDesc(globalSettings.heroDescription || '');
      setSiteAboutStory(globalSettings.aboutStory || '');
      setSiteNoticeBanner(globalSettings.noticeBanner || '');
      setSiteAboutDish1Image(globalSettings.aboutDish1Image || '');
      setSiteAboutDish1Title(globalSettings.aboutDish1Title || '');
      setSiteAboutDish1Subtitle(globalSettings.aboutDish1Subtitle || '');
      setSiteAboutDish1MenuId(globalSettings.aboutDish1MenuId || '');
      setSiteAboutDish2Image(globalSettings.aboutDish2Image || '');
      setSiteAboutDish2Title(globalSettings.aboutDish2Title || '');
      setSiteAboutDish2Subtitle(globalSettings.aboutDish2Subtitle || '');
      setSiteAboutDish2MenuId(globalSettings.aboutDish2MenuId || '');
    }
  }, [globalSettings]);

  const handleDish1FileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSiteAboutDish1Image(event.target.result);
        setSiteAboutDish1MenuId('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDish2FileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSiteAboutDish2Image(event.target.result);
        setSiteAboutDish2MenuId('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [configSource, setConfigSource] = useState<'env' | 'storage' | 'none'>('none');
  const [configMessage, setConfigMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isPushingData, setIsPushingData] = useState(false);

  // Form State for Adding / Editing Dish
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('rice');
  const [formSpiciness, setFormSpiciness] = useState<'mild' | 'medium' | 'hot' | 'extra_hot'>('medium');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Quick inline edit state for directly changing name & price in the list
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickName, setQuickName] = useState('');
  const [quickPrice, setQuickPrice] = useState('');

  // Form State for Customer Reviews Management
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [revCustomerName, setRevCustomerName] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revDishMentioned, setRevDishMentioned] = useState('');
  const [revText, setRevText] = useState('');
  const [revIsVerified, setRevIsVerified] = useState(true);
  const [revError, setRevError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth session on open
  useEffect(() => {
    if (isOpen) {
      if (isAdmin) {
        setIsAuthenticated(true);
      } else {
        const sessionAuth = sessionStorage.getItem('princelys_kitchen_admin_authenticated');
        if (sessionAuth === 'true') {
          setIsAuthenticated(true);
        }
      }
      const creds = getActiveSupabaseCredentials();
      setSupabaseUrl(creds.url);
      setSupabaseKey(creds.anonKey);
      setConfigSource(creds.source);
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  // Handle Password Login: strictly verified as "Ubongabasi"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passwordInput);
    if (success) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect admin password. Access denied.');
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setConfigMessage('Please provide both Supabase URL and Anon Key');
      return;
    }
    saveCustomSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    setConfigSource('storage');
    setConfigMessage('Supabase credentials saved! Refreshing menu & reviews...');
    setTimeout(() => {
      onRefreshMenu();
      if (onRefreshReviews) onRefreshReviews();
      setConfigMessage('');
    }, 1200);
  };

  const handleClearSupabaseConfig = () => {
    clearCustomSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseKey('');
    setConfigSource('none');
    setConfigMessage('Custom Supabase configuration cleared. Now using local database mode.');
    onRefreshMenu();
    if (onRefreshReviews) onRefreshReviews();
    setTimeout(() => setConfigMessage(''), 2000);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handlePushDataToSupabase = async () => {
    setIsPushingData(true);
    try {
      const res = await pushLocalDataToSupabase();
      if (res.success) {
        setSuccessNotice(res.message);
        onRefreshMenu();
        if (onRefreshReviews) onRefreshReviews();
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err?.message || 'Sync failed.');
    } finally {
      setIsPushingData(false);
      setTimeout(() => setSuccessNotice(''), 4000);
    }
  };

  // Dish Management helpers
  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(item.price.toString());
    setFormImageUrl(item.image_url);
    setFormCategory(item.category);
    setFormSpiciness(item.spiciness || 'medium');
    setFormIsFeatured(item.is_featured);
    setFormIsAvailable(item.is_available);
    setActiveTab('add');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    resetForm();
    setActiveTab('manage');
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormImageUrl('');
    setFormCategory('rice');
    setFormSpiciness('medium');
    setFormIsFeatured(false);
    setFormIsAvailable(true);
    setFormError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormImageUrl(event.target.result);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Food name / title is required');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Food description is required');
      return;
    }
    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price in Naira (₦)');
      return;
    }
    if (!formImageUrl.trim()) {
      setFormError('Please upload an image or provide an image URL');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingItem) {
        const res = await updateMenuItem(editingItem.id, {
          name: formName.trim(),
          description: formDescription.trim(),
          price: priceNum,
          image_url: formImageUrl.trim(),
          category: formCategory,
          spiciness: formSpiciness,
          is_featured: formIsFeatured,
          is_available: formIsAvailable
        });

        if (res.success) {
          setSuccessNotice(`Updated "${formName}" (₦${priceNum.toLocaleString()}) successfully!`);
          setEditingItem(null);
          resetForm();
          setActiveTab('manage');
          onRefreshMenu();
        } else {
          setFormError(res.error || 'Failed to update item.');
        }
      } else {
        const newItem: MenuItem = {
          id: `food-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: formName.trim(),
          description: formDescription.trim(),
          price: priceNum,
          image_url: formImageUrl.trim(),
          category: formCategory,
          spiciness: formSpiciness,
          is_featured: formIsFeatured,
          is_available: formIsAvailable,
          created_at: new Date().toISOString()
        };

        const res = await addMenuItem(newItem);
        if (res.success) {
          setSuccessNotice(`Added "${newItem.name}" to menu!`);
          resetForm();
          setActiveTab('manage');
          onRefreshMenu();
        } else {
          setFormError(res.error || 'Failed to save new item.');
        }
      }
    } catch (err: any) {
      setFormError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessNotice(''), 3500);
    }
  };

  const handleStartQuickEdit = (item: MenuItem) => {
    setQuickEditId(item.id);
    setQuickName(item.name);
    setQuickPrice(item.price.toString());
  };

  const handleSaveQuickEdit = async (item: MenuItem) => {
    const priceNum = parseFloat(quickPrice);
    if (!quickName.trim()) {
      alert('Please enter a valid dish name.');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid positive price in Naira (₦).');
      return;
    }

    const res = await updateMenuItem(item.id, {
      name: quickName.trim(),
      price: priceNum
    });

    if (res.success) {
      setQuickEditId(null);
      setSuccessNotice(`Saved "${quickName.trim()}" at ₦${priceNum.toLocaleString()}`);
      onRefreshMenu();
      setTimeout(() => setSuccessNotice(''), 3000);
    } else {
      alert(res.error || 'Failed to save changes.');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      const res = await deleteMenuItem(id);
      if (res.success) {
        setSuccessNotice(`Removed "${name}" from menu.`);
        onRefreshMenu();
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        alert(res.error || 'Failed to delete item.');
      }
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const res = await updateMenuItem(item.id, {
      is_available: !item.is_available
    });
    if (res.success) {
      onRefreshMenu();
    }
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Reset all items back to the curated Nigerian restaurant defaults?')) {
      resetMenuToDefaults();
      onRefreshMenu();
      setSuccessNotice('Menu reset to authentic Nigerian defaults.');
      setTimeout(() => setSuccessNotice(''), 3000);
    }
  };

  // ==========================================
  // REVIEW MANAGEMENT ACTIONS
  // ==========================================

  const startEditReview = (rev: CustomerReview) => {
    setEditingReview(rev);
    setRevCustomerName(rev.customer_name);
    setRevLocation(rev.location || '');
    setRevRating(rev.rating);
    setRevDishMentioned(rev.dish_mentioned || '');
    setRevText(rev.review_text);
    setRevIsVerified(rev.is_verified ?? true);
    setIsReviewFormOpen(true);
  };

  const startAddReview = () => {
    setEditingReview(null);
    setRevCustomerName('');
    setRevLocation('Lagos, Nigeria');
    setRevRating(5);
    setRevDishMentioned(menuItems[0]?.name || 'Smoky Party Jollof Rice');
    setRevText('');
    setRevIsVerified(true);
    setRevError('');
    setIsReviewFormOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevError('');

    if (!revCustomerName.trim()) {
      setRevError('Customer name is required');
      return;
    }
    if (!revText.trim()) {
      setRevError('Review feedback is required');
      return;
    }

    setIsSubmittingReview(true);

    try {
      if (editingReview) {
        const res = await updateReview(editingReview.id, {
          customer_name: revCustomerName.trim(),
          location: revLocation.trim(),
          rating: revRating,
          dish_mentioned: revDishMentioned.trim(),
          review_text: revText.trim(),
          is_verified: revIsVerified
        });

        if (res.success) {
          setSuccessNotice(`Updated review from "${revCustomerName}"!`);
          setIsReviewFormOpen(false);
          setEditingReview(null);
          if (onRefreshReviews) onRefreshReviews();
        } else {
          setRevError(res.error || 'Failed to update review.');
        }
      } else {
        const newRev: CustomerReview = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          customer_name: revCustomerName.trim(),
          location: revLocation.trim() || 'Nigeria',
          rating: revRating,
          dish_mentioned: revDishMentioned.trim(),
          review_text: revText.trim(),
          date: 'Recently added',
          is_verified: revIsVerified,
          created_at: new Date().toISOString()
        };

        const res = await addReview(newRev);
        if (res.success) {
          setSuccessNotice(`Added new review from "${newRev.customer_name}"!`);
          setIsReviewFormOpen(false);
          if (onRefreshReviews) onRefreshReviews();
        } else {
          setRevError(res.error || 'Failed to add review.');
        }
      }
    } catch (err: any) {
      setRevError(err?.message || 'Error saving review.');
    } finally {
      setIsSubmittingReview(false);
      setTimeout(() => setSuccessNotice(''), 3000);
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      const res = await deleteReview(id);
      if (res.success) {
        setSuccessNotice(`Deleted review from "${name}".`);
        if (onRefreshReviews) onRefreshReviews();
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        alert(res.error || 'Failed to delete review.');
      }
    }
  };

  const handleResetReviews = () => {
    if (window.confirm('Reset all customer reviews back to curated default reviews?')) {
      resetReviewsToDefaults();
      if (onRefreshReviews) onRefreshReviews();
      setSuccessNotice('Customer reviews restored to authentic defaults.');
      setTimeout(() => setSuccessNotice(''), 3000);
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await updateGlobalSettings({
        brandName: siteBrandName.trim() || 'Princely’s Kitchen',
        brandSubtitle: siteBrandSubtitle.trim(),
        phoneNumber: sitePhone.trim(),
        whatsappNumber: siteWhatsapp.trim(),
        email: siteEmail.trim(),
        address: siteAddress.trim(),
        openingHoursWeekdays: siteHoursWeekdays.trim(),
        openingHoursSunday: siteHoursSunday.trim(),
        heroHeadline: siteHeroHeadline.trim(),
        heroAccent: siteHeroAccent.trim(),
        heroDescription: siteHeroDesc.trim(),
        aboutStory: siteAboutStory.trim(),
        noticeBanner: siteNoticeBanner.trim(),
        aboutDish1Image: siteAboutDish1Image.trim(),
        aboutDish1Title: siteAboutDish1Title.trim(),
        aboutDish1Subtitle: siteAboutDish1Subtitle.trim(),
        aboutDish1MenuId: siteAboutDish1MenuId || undefined,
        aboutDish2Image: siteAboutDish2Image.trim(),
        aboutDish2Title: siteAboutDish2Title.trim(),
        aboutDish2Subtitle: siteAboutDish2Subtitle.trim(),
        aboutDish2MenuId: siteAboutDish2MenuId || undefined
      });

      if (res.success) {
        setSuccessNotice('All website details, contact numbers & text updated across all pages!');
        setTimeout(() => setSuccessNotice(''), 4000);
      } else {
        alert(res.error || 'Failed to save site settings.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetSiteSettings = () => {
    if (window.confirm('Reset all website info, phone numbers, email & hero text back to default settings?')) {
      resetGlobalSettings();
      setSuccessNotice('Website settings restored to default.');
      setTimeout(() => setSuccessNotice(''), 3000);
    }
  };

  // Sample Nigerian food photo URLs
  const samplePhotos = [
    { label: 'Jollof Rice', url: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Fried Rice', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Afang Soup', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Egusi Soup', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Pounded Yam', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Beef Suya', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      id="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-white my-6 max-h-[92vh] flex flex-col"
        id="admin-modal-container"
      >
        {/* Top bar */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-orange-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                Princely’s Kitchen <span className="text-orange-500 font-sans text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">Owner Portal</span>
              </h2>
              <p className="text-xs text-neutral-400">Manage dishes, prices, customer reviews & Supabase sync</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Bar */}
        {successNotice && (
          <div className="bg-green-950/80 border-b border-green-800 px-6 py-2.5 text-xs text-green-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-orange-400 mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading text-2xl font-bold text-white">Owner Access Verification</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your private admin password to manage foods, prices, reviews, and Supabase.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  id="admin-password-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Owner Password"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-center tracking-widest text-base focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-200 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                id="admin-login-submit-btn"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="bg-neutral-950 px-6 pt-3 border-b border-neutral-800 flex items-center justify-between gap-4 shrink-0 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  id="admin-tab-manage"
                  onClick={() => setActiveTab('manage')}
                  className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'manage'
                      ? 'border-orange-500 text-orange-400 bg-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  Manage Dishes ({menuItems.length})
                </button>
                <button
                  id="admin-tab-add"
                  onClick={() => {
                    if (!editingItem) resetForm();
                    setActiveTab('add');
                  }}
                  className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'add'
                      ? 'border-orange-500 text-orange-400 bg-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingItem ? 'Edit Dish Form' : 'Add Dish'}</span>
                </button>
                <button
                  id="admin-tab-settings"
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'border-orange-500 text-orange-400 bg-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Site & Contact Info</span>
                </button>
                <button
                  id="admin-tab-reviews"
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'border-orange-500 text-orange-400 bg-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Customer Reviews ({reviews.length})</span>
                </button>
                <button
                  id="admin-tab-database"
                  onClick={() => setActiveTab('database')}
                  className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'database'
                      ? 'border-orange-500 text-orange-400 bg-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Supabase Sync</span>
                </button>
              </div>

              {/* Status pill */}
              <div className="hidden sm:flex items-center gap-2 pb-2 text-xs">
                <span className="text-neutral-500">Database:</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isSupabaseActive
                      ? 'bg-green-950 text-green-400 border border-green-800'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {isSupabaseActive ? 'Supabase Live' : 'Local Storage Mode'}
                </span>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* ============================================================= */}
              {/* TAB 1: MANAGE FOOD ITEMS (EDIT NAMES & PRICES)                */}
              {/* ============================================================= */}
              {activeTab === 'manage' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white">Current Menu Items</h3>
                      <p className="text-xs text-neutral-400">
                        Click <strong className="text-orange-400">"Edit Dish"</strong> to modify photos, names & prices, or use the quick price editor below.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={onRefreshMenu}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                        title="Reload menu data"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                      <button
                        onClick={handleRestoreDefaults}
                        className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-800/40 transition cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  {/* List of Dishes */}
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0 w-full sm:w-auto">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-800"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
                            }}
                          />

                          {quickEditId === item.id ? (
                            /* Inline Quick Edit Name & Price */
                            <div className="flex-1 space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-neutral-400 block font-bold">Dish Name:</label>
                                  <input
                                    type="text"
                                    value={quickName}
                                    onChange={(e) => setQuickName(e.target.value)}
                                    className="w-full px-2.5 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-orange-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-neutral-400 block font-bold">Price (₦ Naira):</label>
                                  <input
                                    type="number"
                                    value={quickPrice}
                                    onChange={(e) => setQuickPrice(e.target.value)}
                                    className="w-full px-2.5 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-orange-500"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => handleSaveQuickEdit(item)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => setQuickEditId(null)}
                                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Regular Display */
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-heading text-base font-bold text-white truncate">
                                  {item.name}
                                </h4>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                                  {item.category}
                                </span>
                                {item.is_featured && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-base font-bold text-orange-400">
                                  ₦{item.price.toLocaleString()}
                                </span>
                                <button
                                  onClick={() => handleStartQuickEdit(item)}
                                  className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                                  title="Quick edit price or name"
                                >
                                  Quick Edit Price
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800 shrink-0">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                              item.is_available
                                ? 'bg-green-950/40 text-green-400 border-green-800/60 hover:bg-green-900/50'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                            }`}
                          >
                            {item.is_available ? 'In Stock' : 'Sold Out'}
                          </button>

                          {/* Full Edit Dish Button */}
                          <button
                            onClick={() => startEdit(item)}
                            className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            title="Edit full dish details (Name, Price & Photo)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Dish</span>
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white border border-red-800/50 transition cursor-pointer"
                            title="Delete dish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: ADD / EDIT DISH                                        */}
              {/* ============================================================= */}
              {activeTab === 'add' && (
                <form onSubmit={handleSubmitFoodItem} className="space-y-5 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white">
                        {editingItem ? `Edit Dish: "${editingItem.name}"` : 'Add New Authentic Nigerian Food'}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {editingItem
                          ? 'Update the dish name, price in Naira, or upload a new food image.'
                          : 'Enter the food details, upload photo, and set price.'}
                      </p>
                    </div>
                    {editingItem && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-950 border border-red-700 rounded-xl text-xs text-red-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* 1. Food Name / Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
                      1. Dish Name / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="admin-form-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g., Smoky Party Jollof Rice, Fisherman Soup..."
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* 2. Price in Naira ₦ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
                        2. Price in Naira (₦) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-orange-400 font-bold text-sm">
                          ₦
                        </span>
                        <input
                          type="number"
                          id="admin-form-price"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="e.g., 4500"
                          min="100"
                          step="50"
                          className="w-full pl-8 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Category
                      </label>
                      <select
                        id="admin-form-category"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
                        className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="rice">Rice Delicacies (Jollof, Fried)</option>
                        <option value="soups">Traditional Soups (Afang, Egusi, Efo)</option>
                        <option value="swallows">Swallows (Pounded Yam, Semo)</option>
                        <option value="grills">Grills & Suya (Beef, Asun)</option>
                        <option value="specials">Chef Specials & Native Pots</option>
                        <option value="drinks">Refreshing Drinks (Zobo)</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Image Selection */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-orange-400">
                      3. Food Image / Photo <span className="text-red-500">*</span>
                    </label>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                          id="admin-file-upload-input"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Upload className="w-4 h-4 text-orange-400" />
                          <span>📁 Upload Photo from Device / Phone Camera</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-px bg-neutral-800 flex-1" />
                        <span className="text-[11px] text-neutral-500 uppercase font-semibold">Or Enter Image URL</span>
                        <div className="h-px bg-neutral-800 flex-1" />
                      </div>

                      <div>
                        <input
                          type="url"
                          id="admin-form-image-url"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... or paste image URL"
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Quick sample presets */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                        <span>Nigerian photo presets:</span>
                        {samplePhotos.map((s) => (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => setFormImageUrl(s.url)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] cursor-pointer"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Live Image Preview */}
                      {formImageUrl && (
                        <div className="mt-2 flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-700 rounded-xl">
                          <img
                            src={formImageUrl}
                            alt="Live Dish Preview"
                            className="w-20 h-20 rounded-lg object-cover border border-neutral-600 shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
                            }}
                          />
                          <div className="flex-1 text-xs">
                            <span className="text-green-400 font-bold block flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Image Ready & Loaded
                            </span>
                            <p className="text-neutral-400 text-[11px] mt-0.5 line-clamp-1">
                              This photo will display on your menu cards and order modal.
                            </p>
                            <button
                              type="button"
                              onClick={() => setFormImageUrl('')}
                              className="text-red-400 hover:text-red-300 text-[10px] mt-1 underline cursor-pointer"
                            >
                              Remove photo
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      4. Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="admin-form-description"
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="e.g., Authentic firewood-smoky rice simmered in slow-roasted tatashe, served with golden dodo and beef."
                      className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded bg-neutral-900 border-neutral-700"
                      />
                      <span className="text-xs font-semibold text-neutral-200">
                        Feature on Home Page showcase
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsAvailable}
                        onChange={(e) => setFormIsAvailable(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded bg-neutral-900 border-neutral-700"
                      />
                      <span className="text-xs font-semibold text-neutral-200">
                        Available in Stock (In Stock)
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingItem ? 'Save & Update Dish Changes' : 'Add Dish to Live Menu'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ============================================================= */}
              {/* TAB: SITE & CONTACT SETTINGS (NUMBERS, WORDS, CONTACT INFO)   */}
              {/* ============================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-orange-400" />
                        <span>Website & Contact Details</span>
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Update your phone numbers, WhatsApp, email, address, hours, and texts. Edits cascade everywhere across the website.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetSiteSettings}
                        className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                    {/* Brand & Tagline */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                          1. Brand Identity & Header
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Brand / Restaurant Name
                          </label>
                          <input
                            type="text"
                            value={siteBrandName}
                            onChange={(e) => setSiteBrandName(e.target.value)}
                            placeholder="e.g. Princely’s Kitchen"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Brand Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={siteBrandSubtitle}
                            onChange={(e) => setSiteBrandSubtitle(e.target.value)}
                            placeholder="e.g. Authentic Nigerian Flavours"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Numbers, WhatsApp, Gmail */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                          2. Contact Numbers & Email Lines
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Official Phone Number
                          </label>
                          <input
                            type="text"
                            value={sitePhone}
                            onChange={(e) => setSitePhone(e.target.value)}
                            placeholder="08124491537"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            WhatsApp Ordering Line
                          </label>
                          <input
                            type="text"
                            value={siteWhatsapp}
                            onChange={(e) => setSiteWhatsapp(e.target.value)}
                            placeholder="08124491537"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Official Gmail / Email
                          </label>
                          <input
                            type="email"
                            value={siteEmail}
                            onChange={(e) => setSiteEmail(e.target.value)}
                            placeholder="Princely4u112@gmail.com"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        ⚡ Updates phone numbers and WhatsApp ordering links across the Contact Page, Footer, Order Modal, and floating button.
                      </p>
                    </div>

                    {/* Location & Operating Hours */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                        <Globe className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                          3. Physical Address & Operating Hours
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Store / Kitchen Physical Address
                        </label>
                        <input
                          type="text"
                          value={siteAddress}
                          onChange={(e) => setSiteAddress(e.target.value)}
                          placeholder="14 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria"
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Weekday Business Hours (Mon - Sat)
                          </label>
                          <input
                            type="text"
                            value={siteHoursWeekdays}
                            onChange={(e) => setSiteHoursWeekdays(e.target.value)}
                            placeholder="Mon - Sat: 9:00 AM – 10:00 PM"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Sunday Business Hours
                          </label>
                          <input
                            type="text"
                            value={siteHoursSunday}
                            onChange={(e) => setSiteHoursSunday(e.target.value)}
                            placeholder="Sunday: 12:00 PM – 9:00 PM"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Section Copy */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          4. Hero Banner Headline & Description
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Hero Main Heading
                          </label>
                          <input
                            type="text"
                            value={siteHeroHeadline}
                            onChange={(e) => setSiteHeroHeadline(e.target.value)}
                            placeholder="Princely’s Kitchen"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Hero Accent / Italic Tagline
                          </label>
                          <input
                            type="text"
                            value={siteHeroAccent}
                            onChange={(e) => setSiteHeroAccent(e.target.value)}
                            placeholder="Authentic Nigerian Flavour"
                            className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Hero Paragraph Description
                        </label>
                        <textarea
                          rows={3}
                          value={siteHeroDesc}
                          onChange={(e) => setSiteHeroDesc(e.target.value)}
                          placeholder="From our legendary firewood-smoky Party Jollof..."
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* About Story & Notice Banner */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                          5. Culinary Heritage Story & Notice Banner
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          About Page Story Description
                        </label>
                        <textarea
                          rows={3}
                          value={siteAboutStory}
                          onChange={(e) => setSiteAboutStory(e.target.value)}
                          placeholder="Princely’s Kitchen was founded with a singular, uncompromising vision..."
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Fresh Food Dispatch Banner (Footer & Home)
                        </label>
                        <input
                          type="text"
                          value={siteNoticeBanner}
                          onChange={(e) => setSiteNoticeBanner(e.target.value)}
                          placeholder="⚡ Orders are prepared fresh to guarantee that hot-from-the-pot flavor."
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* 6. About Us Page Featured Dishes & Images */}
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                        <Camera className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                          6. About Us Page Featured Dishes & Images
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Customize the two spotlight dish images and descriptions displayed in the "Narrative & Visual Story" section on the About Us page. You can upload a photo, paste an image link, or select directly from your active menu dishes.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* About Dish 1 */}
                        <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>🍽️ About Dish 1 (Swallows & Soups)</span>
                            </span>
                            {siteAboutDish1MenuId && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30">
                                Linked to Menu
                              </span>
                            )}
                          </div>

                          {/* Image preview */}
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0">
                              <img
                                src={siteAboutDish1Image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                alt="Dish 1 Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <input
                                type="file"
                                ref={dish1FileInputRef}
                                onChange={handleDish1FileUpload}
                                accept="image/*"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => dish1FileInputRef.current?.click()}
                                className="w-full py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5 text-orange-400" />
                                <span>Upload Photo</span>
                              </button>
                              <span className="text-[10px] text-neutral-500 block text-center">PNG, JPG, WEBP up to 5MB</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={siteAboutDish1Image}
                              onChange={(e) => {
                                setSiteAboutDish1Image(e.target.value);
                                setSiteAboutDish1MenuId('');
                              }}
                              placeholder="https://images.unsplash.com/... or paste link"
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          {/* Quick Pick from Menu */}
                          {menuItems.length > 0 && (
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                                Or Quick-Select from Menu:
                              </label>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                                {menuItems.map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      setSiteAboutDish1Image(item.image_url);
                                      setSiteAboutDish1Title(item.name);
                                      setSiteAboutDish1Subtitle(item.description);
                                      setSiteAboutDish1MenuId(item.id);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] border transition cursor-pointer ${
                                      siteAboutDish1Image === item.image_url
                                        ? 'bg-orange-600 text-white border-orange-500 font-bold'
                                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                                    }`}
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                              Dish 1 Title
                            </label>
                            <input
                              type="text"
                              value={siteAboutDish1Title}
                              onChange={(e) => setSiteAboutDish1Title(e.target.value)}
                              placeholder="e.g. Authentic Swallows"
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                              Dish 1 Subtitle / Caption
                            </label>
                            <input
                              type="text"
                              value={siteAboutDish1Subtitle}
                              onChange={(e) => setSiteAboutDish1Subtitle(e.target.value)}
                              placeholder="e.g. Hot, stretchy Pounded Yam & Semovita"
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        {/* About Dish 2 */}
                        <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>🍚 About Dish 2 (Rice & Specialties)</span>
                            </span>
                            {siteAboutDish2MenuId && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30">
                                Linked to Menu
                              </span>
                            )}
                          </div>

                          {/* Image preview */}
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0">
                              <img
                                src={siteAboutDish2Image || 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=800&q=80'}
                                alt="Dish 2 Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <input
                                type="file"
                                ref={dish2FileInputRef}
                                onChange={handleDish2FileUpload}
                                accept="image/*"
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => dish2FileInputRef.current?.click()}
                                className="w-full py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5 text-orange-400" />
                                <span>Upload Photo</span>
                              </button>
                              <span className="text-[10px] text-neutral-500 block text-center">PNG, JPG, WEBP up to 5MB</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={siteAboutDish2Image}
                              onChange={(e) => {
                                setSiteAboutDish2Image(e.target.value);
                                setSiteAboutDish2MenuId('');
                              }}
                              placeholder="https://images.unsplash.com/... or paste link"
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          {/* Quick Pick from Menu */}
                          {menuItems.length > 0 && (
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                                Or Quick-Select from Menu:
                              </label>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                                {menuItems.map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      setSiteAboutDish2Image(item.image_url);
                                      setSiteAboutDish2Title(item.name);
                                      setSiteAboutDish2Subtitle(item.description);
                                      setSiteAboutDish2MenuId(item.id);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] border transition cursor-pointer ${
                                      siteAboutDish2Image === item.image_url
                                        ? 'bg-orange-600 text-white border-orange-500 font-bold'
                                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                                    }`}
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                              Dish 2 Title
                            </label>
                            <input
                              type="text"
                              value={siteAboutDish2Title}
                              onChange={(e) => setSiteAboutDish2Title(e.target.value)}
                              placeholder="e.g. Party Jollof Rice"
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                              Dish 2 Subtitle / Caption
                            </label>
                            <input
                              type="text"
                              value={siteAboutDish2Subtitle}
                              onChange={(e) => setSiteAboutDish2Subtitle(e.target.value)}
                              placeholder="e.g. Firewood smoked & rich pepper base"
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition hover:scale-[1.01] cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingSettings ? 'Saving Updates...' : 'Save & Update All Website Sections'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: CUSTOMER REVIEWS (ADD, EDIT, DELETE REVIEWS)           */}
              {/* ============================================================= */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-orange-400" />
                        <span>Customer Reviews & Testimonials</span>
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Add new reviews, edit customer testimonials, and manage ratings shown on your website.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={startAddReview}
                        className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Review</span>
                      </button>
                      <button
                        onClick={handleResetReviews}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-700 transition cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Review Inline Form Modal */}
                  {isReviewFormOpen && (
                    <div className="p-5 bg-neutral-950 border border-orange-500/40 rounded-2xl space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <h4 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                          <Edit2 className="w-4 h-4 text-orange-400" />
                          <span>{editingReview ? 'Edit Review' : 'Add New Customer Review'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsReviewFormOpen(false)}
                          className="text-neutral-400 hover:text-white text-xs"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      {revError && (
                        <div className="p-3 bg-red-950 border border-red-800 rounded-xl text-xs text-red-200">
                          {revError}
                        </div>
                      )}

                      <form onSubmit={handleSaveReview} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-neutral-300 mb-1">
                              Customer Name *
                            </label>
                            <input
                              type="text"
                              value={revCustomerName}
                              onChange={(e) => setRevCustomerName(e.target.value)}
                              placeholder="e.g., Tunde Bakare"
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-300 mb-1">
                              Location / Area
                            </label>
                            <input
                              type="text"
                              value={revLocation}
                              onChange={(e) => setRevLocation(e.target.value)}
                              placeholder="e.g., Lekki Phase 1, Lagos"
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-neutral-300 mb-1">
                              Star Rating (1 to 5)
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setRevRating(s)}
                                  className="p-1 cursor-pointer"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      s <= revRating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="text-xs text-neutral-400 ml-2 font-bold">{revRating} / 5</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-neutral-300 mb-1">
                              Dish Mentioned
                            </label>
                            <input
                              type="text"
                              value={revDishMentioned}
                              onChange={(e) => setRevDishMentioned(e.target.value)}
                              placeholder="e.g., Smoky Party Jollof Rice"
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 mb-1">
                            Review / Testimonial Text *
                          </label>
                          <textarea
                            rows={3}
                            value={revText}
                            onChange={(e) => setRevText(e.target.value)}
                            placeholder="Write what the customer praised (e.g. authentic firewood flavor, generous portion...)"
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                            required
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                            <input
                              type="checkbox"
                              checked={revIsVerified}
                              onChange={(e) => setRevIsVerified(e.target.checked)}
                              className="w-4 h-4 text-orange-600 rounded bg-neutral-900 border-neutral-700"
                            />
                            <span>Mark as Verified Order (Green badge)</span>
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsReviewFormOpen(false)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmittingReview}
                              className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs rounded-lg shadow cursor-pointer flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{editingReview ? 'Save Changes' : 'Save Review'}</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-400 text-xs">
                        No reviews recorded yet. Click "Add New Review" or "Reset Defaults" above.
                      </div>
                    ) : (
                      reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-heading text-sm font-bold text-white">
                                {rev.customer_name}
                              </h4>
                              {rev.location && (
                                <span className="text-[11px] text-neutral-400">
                                  ({rev.location})
                                </span>
                              )}
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              {rev.is_verified && (
                                <span className="text-[10px] font-bold text-green-400 bg-green-950/60 border border-green-800 px-2 py-0.5 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-neutral-300 italic line-clamp-2">
                              "{rev.review_text}"
                            </p>

                            {rev.dish_mentioned && (
                              <div className="pt-0.5">
                                <span className="text-[10px] text-orange-400 font-semibold">
                                  Dish: {rev.dish_mentioned}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => startEditReview(rev)}
                              className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                              title="Edit Review"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteReview(rev.id, rev.customer_name)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-800/50 transition cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: SUPABASE CONFIGURATION & SYNC                          */}
              {/* ============================================================= */}
              {activeTab === 'database' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="pb-3 border-b border-neutral-800">
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-orange-500" />
                      <span>Supabase Cloud Database Synchronization</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Connect Princely’s Kitchen to your free Supabase PostgreSQL project. Both menu dishes and customer reviews are stored permanently in the cloud.
                    </p>
                  </div>

                  {configMessage && (
                    <div className="p-3 bg-neutral-800 border border-orange-500/50 rounded-xl text-xs text-orange-300">
                      {configMessage}
                    </div>
                  )}

                  {/* Step 1: SQL Schema for Both Menu and Reviews */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                        Step 1: SQL Schema (Runs in Supabase SQL Editor)
                      </span>
                      <button
                        onClick={handleCopySql}
                        className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSql ? 'Copied Full SQL!' : 'Copy SQL Schema'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Copies table definitions for <code>public.menu_items</code> and <code>public.reviews</code>, plus Row Level Security (RLS) policies and authentic Nigerian seed records.
                    </p>
                    <pre className="p-3 bg-black border border-neutral-800 rounded-lg text-[10px] text-neutral-300 font-mono overflow-x-auto max-h-36">
                      {SUPABASE_SCHEMA_SQL}
                    </pre>
                  </div>

                  {/* Step 2: Supabase Credentials */}
                  <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
                        Step 2: Enter Supabase Project Credentials
                      </span>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                          Supabase Project URL
                        </label>
                        <input
                          type="url"
                          value={supabaseUrl}
                          onChange={(e) => setSupabaseUrl(e.target.value)}
                          placeholder="https://yourprojectid.supabase.co"
                          className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                          Supabase Anon / Public Key
                        </label>
                        <input
                          type="password"
                          value={supabaseKey}
                          onChange={(e) => setSupabaseKey(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                          className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:flex-1 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-xs shadow transition cursor-pointer"
                      >
                        Save & Connect Supabase
                      </button>

                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTestingConnection}
                        className="w-full sm:w-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-700 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Link className="w-3.5 h-3.5 text-orange-400" />
                        <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
                      </button>

                      {configSource === 'storage' && (
                        <button
                          type="button"
                          onClick={handleClearSupabaseConfig}
                          className="w-full sm:w-auto px-4 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 rounded-xl text-xs font-semibold transition cursor-pointer border border-red-800/40"
                        >
                          Clear Config
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Test Connection Results feedback */}
                  {testResult && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                        testResult.success
                          ? 'bg-green-950/80 border-green-800 text-green-200'
                          : 'bg-red-950/80 border-red-800 text-red-200'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  {/* Step 3: Batch Upload Local Data to Supabase */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
                      Step 3: Sync Local Dishes & Reviews to Supabase
                    </span>
                    <p className="text-xs text-neutral-400">
                      If you added meals or reviews while offline or in local mode, click below to push all {menuItems.length} dishes and {reviews.length} reviews directly to your Supabase tables.
                    </p>
                    <button
                      type="button"
                      onClick={handlePushDataToSupabase}
                      disabled={isPushingData}
                      className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4 text-orange-400" />
                      <span>{isPushingData ? 'Uploading...' : 'Push All Local Data to Supabase'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
