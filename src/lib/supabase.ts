import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MenuItem, CustomerReview, SiteSettings } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/initialMenu';
import { INITIAL_REVIEWS } from '../data/initialReviews';

const STORAGE_KEY = 'princelys_kitchen_menu_items';
const REVIEWS_STORAGE_KEY = 'princelys_kitchen_customer_reviews';
const SUPABASE_CONFIG_KEY = 'princelys_kitchen_supabase_config';
const SITE_SETTINGS_STORAGE_KEY = 'princelys_kitchen_site_settings';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: "Princely’s Kitchen",
  brandSubtitle: "Authentic Nigerian Flavours",
  phoneNumber: "08124491537",
  whatsappNumber: "08124491537",
  email: "Princely4u112@gmail.com",
  address: "14 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria",
  openingHoursWeekdays: "Mon - Sat: 9:00 AM – 10:00 PM",
  openingHoursSunday: "Sunday: 12:00 PM – 9:00 PM",
  heroHeadline: "Princely’s Kitchen",
  heroAccent: "Authentic Nigerian Flavour",
  heroDescription: "From our legendary firewood-smoky Party Jollof and aromatic Calabar Afang Soup to melt-in-your-mouth Egusi and steaming Pounded Yam. Freshly cooked, generously served, and delivered swiftly to your doorstep.",
  aboutStory: "Princely’s Kitchen was founded with a singular, uncompromising vision: to serve authentic Nigerian meals that taste exactly like the food prepared in our grandmothers' kitchens — slow-simmered over authentic firewood, bursting with native aroma, and packed with hearty portions.",
  noticeBanner: "⚡ Orders are prepared fresh to guarantee that hot-from-the-pot flavor. Fast delivery across town!",
  aboutDish1Image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  aboutDish1Title: "Authentic Swallows",
  aboutDish1Subtitle: "Hot, stretchy Pounded Yam & Semovita",
  aboutDish1MenuId: "afang-soup-calabar",
  aboutDish2Image: "https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=800&q=80",
  aboutDish2Title: "Party Jollof Rice",
  aboutDish2Subtitle: "Firewood smoked & rich pepper base",
  aboutDish2MenuId: "jollof-rice-special"
};

export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- PRINCELY'S KITCHEN - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Create the menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'rice',
    spiciness TEXT DEFAULT 'medium',
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    preparation_time TEXT,
    portion_size TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    rating NUMERIC NOT NULL DEFAULT 5,
    review_text TEXT NOT NULL,
    dish_mentioned TEXT,
    location TEXT,
    date TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for public access (Read & Write for all using anon key)
DROP POLICY IF EXISTS "Allow public read access on menu_items" ON public.menu_items;
CREATE POLICY "Allow public read access on menu_items" 
    ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow full access on menu_items" ON public.menu_items;
CREATE POLICY "Allow full access on menu_items" 
    ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on reviews" ON public.reviews;
CREATE POLICY "Allow public read access on reviews" 
    ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow full access on reviews" ON public.reviews;
CREATE POLICY "Allow full access on reviews" 
    ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- 5. Initial Seed Data for menu_items
INSERT INTO public.menu_items (id, name, description, price, image_url, category, spiciness, is_featured, is_available, preparation_time, portion_size)
VALUES
('jollof-rice-special', 'Smoky Party Jollof Rice', 'Iconic Nigerian firewood-smoky parboiled rice simmered in slow-roasted tatashe, ata-rodo pepper blend, served with golden dodo (fried plantain) and tender fried beef.', 4500, 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=1000&q=80', 'rice', 'medium', true, true, '20-25 mins', 'Standard Meal + Plantain & Protein'),
('fried-rice-deluxe', 'Royal Special Fried Rice', 'Fragrant seasoned long-grain rice infused with rich beef stock, diced liver cubes, sweet corn, green peas, crispy carrots, and succulent grilled chicken.', 4800, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80', 'rice', 'mild', true, true, '20-25 mins', 'Generous Plate + Chicken Quarter'),
('afang-soup-calabar', 'Authentic Calabar Afang Soup', 'Prestige Efik herbal soup crafted from shredded wild Afang (Ukazi) leaves and tender waterleaf, loaded with dry fish, kpomo, periwinkles, stockfish, and seasoned goat meat.', 6500, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80', 'soups', 'hot', true, true, '25-30 mins', 'Rich Soup Bowl + Choice Swallow'),
('egusi-soup-lump', 'Ere-Rich Egusi Soup (Lump Style)', 'Hand-molded toasted melon seed soup stewed in native red palm oil with bitterleaf and spinach, packed with tender shaki, smoked catfish, dried prawns, and stockfish.', 5800, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80', 'soups', 'medium', true, true, '20-25 mins', 'Hearty Soup Bowl + Choice Swallow'),
('pounded-yam-portion', 'Steamy Fluffy Pounded Yam', 'Authentic Nigerian smooth and stretchy hot pounded yam swallow prepared fresh from premium white yam tubers. The ultimate companion for rich native soups.', 1500, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80', 'swallows', 'mild', true, true, '10 mins', 'Double Wrap'),
('beef-suya-platter', 'Spicy Fire-Grilled Beef Suya', 'Thinly sliced choice beef skewers crusted in northern yaji spice, charred over glowing charcoal embers, served with sliced red onions and fresh cabbage.', 3500, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80', 'grills', 'hot', true, true, '15 mins', 'Generous Cut Portion')
ON CONFLICT (id) DO NOTHING;

-- 6. Initial Seed Data for reviews
INSERT INTO public.reviews (id, customer_name, rating, review_text, dish_mentioned, location, date, is_verified)
VALUES
('rev-1', 'Chidinma Okafor', 5, 'The smoky party jollof tastes exactly like a Saturday Lagos wedding party! You can actually smell and taste the firewood aroma. Delivery was hot and swift to Lekki Phase 1.', 'Smoky Party Jollof Rice', 'Lekki Phase 1, Lagos', '3 days ago', true),
('rev-2', 'Tunde Bakare', 5, 'Hands down the best Calabar Afang soup in Lagos! Packed with kpomo, dried catfish, periwinkles, and tender goat meat. Ordered with pounded yam and it was heavenly.', 'Authentic Calabar Afang Soup', 'Ikeja GRA, Lagos', '1 week ago', true),
('rev-3', 'Dr. Emeka Nnamani', 5, 'I was hesitant to order Egusi soup online, but Princely’s Kitchen proved me wrong. Hand-molded lump egusi with authentic bitterleaf. Very rich and filling.', 'Ere-Rich Egusi Soup (Lump Style)', 'Maitama, Abuja', '2 weeks ago', true),
('rev-4', 'Amina Bello', 5, 'The spicy beef suya is tender, well seasoned with yaji spice, and not burnt like other roadside grills. Generous sliced onions and fresh cabbage too!', 'Spicy Beef Suya', 'Victoria Island, Lagos', '3 weeks ago', true),
('rev-5', 'Blessing Johnson', 5, 'Generous portions, exceptional packaging that did not spill in transit, and customer service on WhatsApp is super polite and fast. Princely is my family kitchen now.', 'Royal Special Fried Rice', 'Port Harcourt / Lagos', '1 month ago', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on site_settings" ON public.site_settings;
CREATE POLICY "Allow public read access on site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access on site_settings" ON public.site_settings;
CREATE POLICY "Allow full access on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
`;

// Helper to get active Supabase credentials
export function getActiveSupabaseCredentials() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || '';
  const envAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (envUrl && envAnonKey && !envUrl.includes('xyzcompany')) {
    return { url: envUrl, anonKey: envAnonKey, source: 'env' as const };
  }

  try {
    const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, source: 'storage' as const };
      }
    }
  } catch (e) {
    console.error('Failed to read Supabase config from storage', e);
  }

  return { url: '', anonKey: '', source: 'none' as const };
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string) {
  try {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
    cachedClient = null; // Invalidate cached client
  } catch (e) {
    console.error('Failed to save Supabase config', e);
  }
}

export function clearCustomSupabaseCredentials() {
  try {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
    cachedClient = null;
  } catch (e) {
    console.error('Failed to clear Supabase config', e);
  }
}

// Create a Supabase client if configured
let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getActiveSupabaseCredentials();
  if (!url || !anonKey) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    lastUsedUrl = url;
    return cachedClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

// Test Supabase Connection
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'No Supabase credentials provided or URL/Key is invalid.' };
  }

  try {
    const { error } = await client.from('menu_items').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase project, but "menu_items" table was not found. Please run the SQL schema script in Supabase SQL Editor.'
        };
      }
      return { success: false, message: `Supabase error: ${error.message}` };
    }
    return { success: true, message: 'Successfully connected and verified Supabase database!' };
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err?.message || 'Check network / project URL'}` };
  }
}

// ==========================================
// MENU ITEMS: Local Storage & CRUD
// ==========================================

function getLocalMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local menu items:', e);
  }
  setLocalMenuItems(INITIAL_MENU_ITEMS);
  return INITIAL_MENU_ITEMS;
}

function setLocalMenuItems(items: MenuItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local menu items:', e);
  }
}

export async function getMenuItems(): Promise<{ items: MenuItem[]; isSupabase: boolean; error?: string }> {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      const { data, error } = await client
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to local data:', error.message);
        return { items: getLocalMenuItems(), isSupabase: false, error: error.message };
      }

      if (data && data.length > 0) {
        setLocalMenuItems(data as MenuItem[]);
        return { items: data as MenuItem[], isSupabase: true };
      } else {
        return { items: getLocalMenuItems(), isSupabase: true };
      }
    } catch (err: any) {
      console.warn('Supabase exception, falling back to local data:', err);
      return { items: getLocalMenuItems(), isSupabase: false, error: err?.message || 'Network error' };
    }
  }

  return { items: getLocalMenuItems(), isSupabase: false };
}

export async function addMenuItem(item: MenuItem): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      const { error } = await client.from('menu_items').insert([item]);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to insert to Supabase' };
    }
  }

  const current = getLocalMenuItems();
  setLocalMenuItems([item, ...current.filter((i) => i.id !== item.id)]);
  return { success: true };
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      const { error } = await client.from('menu_items').update(updates).eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update in Supabase' };
    }
  }

  const current = getLocalMenuItems();
  const updated = current.map((i) => (i.id === id ? { ...i, ...updates } : i));
  setLocalMenuItems(updated);
  return { success: true };
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  
  if (client) {
    try {
      const { error } = await client.from('menu_items').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete from Supabase' };
    }
  }

  const current = getLocalMenuItems();
  setLocalMenuItems(current.filter((i) => i.id !== id));
  return { success: true };
}

export function resetMenuToDefaults(): MenuItem[] {
  setLocalMenuItems(INITIAL_MENU_ITEMS);
  return INITIAL_MENU_ITEMS;
}

// ==========================================
// CUSTOMER REVIEWS: Local Storage & CRUD
// ==========================================

function getLocalReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local reviews:', e);
  }
  setLocalReviews(INITIAL_REVIEWS);
  return INITIAL_REVIEWS;
}

function setLocalReviews(reviews: CustomerReview[]): void {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving local reviews:', e);
  }
}

export async function getReviews(): Promise<{ reviews: CustomerReview[]; isSupabase: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error for reviews:', error.message);
        return { reviews: getLocalReviews(), isSupabase: false, error: error.message };
      }

      if (data && data.length > 0) {
        setLocalReviews(data as CustomerReview[]);
        return { reviews: data as CustomerReview[], isSupabase: true };
      } else {
        return { reviews: getLocalReviews(), isSupabase: true };
      }
    } catch (err: any) {
      return { reviews: getLocalReviews(), isSupabase: false, error: err?.message };
    }
  }

  return { reviews: getLocalReviews(), isSupabase: false };
}

export async function addReview(review: CustomerReview): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client.from('reviews').insert([review]);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  const current = getLocalReviews();
  setLocalReviews([review, ...current.filter((r) => r.id !== review.id)]);
  return { success: true };
}

export async function updateReview(id: string, updates: Partial<CustomerReview>): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client.from('reviews').update(updates).eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  const current = getLocalReviews();
  const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
  setLocalReviews(updated);
  return { success: true };
}

export async function deleteReview(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client.from('reviews').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  const current = getLocalReviews();
  setLocalReviews(current.filter((r) => r.id !== id));
  return { success: true };
}

export function resetReviewsToDefaults(): CustomerReview[] {
  setLocalReviews(INITIAL_REVIEWS);
  return INITIAL_REVIEWS;
}

// Push all local dishes & reviews to Supabase in one batch
export async function pushLocalDataToSupabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Please configure your Supabase URL and Anon Key first.' };
  }

  try {
    const items = getLocalMenuItems();
    const reviews = getLocalReviews();

    const { error: itemsErr } = await client.from('menu_items').upsert(items, { onConflict: 'id' });
    if (itemsErr) {
      return { success: false, message: `Failed to upload menu items: ${itemsErr.message}` };
    }

    const { error: revErr } = await client.from('reviews').upsert(reviews, { onConflict: 'id' });
    if (revErr) {
      return { success: false, message: `Uploaded menu items, but reviews had error: ${revErr.message}` };
    }

    const settings = getLocalSiteSettings();
    await client.from('site_settings').upsert({ id: 'primary', settings, updated_at: new Date().toISOString() }, { onConflict: 'id' });

    return {
      success: true,
      message: `Successfully synchronized ${items.length} menu dishes, ${reviews.length} reviews, and site settings to Supabase!`
    };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Sync failed.' };
  }
}

// ==========================================
// SITE SETTINGS: Local Storage & CRUD
// ==========================================

export function getLocalSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error reading local site settings:', e);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function setLocalSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    // Dispatch custom event for cross-component instant updates
    window.dispatchEvent(new CustomEvent('princelys_kitchen_settings_changed', { detail: settings }));
  } catch (e) {
    console.error('Error saving local site settings:', e);
  }
}

export async function getSiteSettings(): Promise<{ settings: SiteSettings; isSupabase: boolean }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('site_settings')
        .select('settings')
        .eq('id', 'primary')
        .single();

      if (!error && data?.settings) {
        const merged = { ...DEFAULT_SITE_SETTINGS, ...data.settings };
        setLocalSiteSettings(merged);
        return { settings: merged, isSupabase: true };
      }
    } catch (err) {
      console.warn('Could not fetch site settings from Supabase, using local:', err);
    }
  }
  return { settings: getLocalSiteSettings(), isSupabase: false };
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings; error?: string }> {
  const current = getLocalSiteSettings();
  const merged: SiteSettings = { ...current, ...updates };
  setLocalSiteSettings(merged);

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('site_settings').upsert(
        {
          id: 'primary',
          settings: merged,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
      if (error) {
        console.warn('Failed to persist site settings to Supabase:', error.message);
      }
    } catch (err: any) {
      console.warn('Error saving site settings to Supabase:', err);
    }
  }

  return { success: true, settings: merged };
}

export function resetSiteSettingsToDefaults(): SiteSettings {
  setLocalSiteSettings(DEFAULT_SITE_SETTINGS);
  return DEFAULT_SITE_SETTINGS;
}

// Format phone number to international WhatsApp format (e.g. 08124491537 -> 2348124491537)
export function formatWhatsAppUrl(rawPhone: string, message: string): string {
  // Strip non-digit characters
  const digits = rawPhone.replace(/\D/g, '');
  let formatted = digits;
  if (digits.startsWith('0') && digits.length === 11) {
    formatted = '234' + digits.substring(1);
  } else if (!digits.startsWith('234') && digits.length === 10) {
    formatted = '234' + digits;
  }
  return `https://wa.me/${formatted || '2348124491537'}?text=${encodeURIComponent(message)}`;
}

// Format phone number for tel: link (e.g. 08124491537)
export function formatPhoneTel(rawPhone: string): string {
  return rawPhone.replace(/[\s()-]/g, '');
}
