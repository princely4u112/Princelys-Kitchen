export type FoodCategory = 
  | 'all'
  | 'rice' 
  | 'soups' 
  | 'swallows' 
  | 'grills' 
  | 'drinks' 
  | 'specials';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in Naira (₦)
  image_url: string;
  category: FoodCategory;
  spiciness?: 'mild' | 'medium' | 'hot' | 'extra_hot';
  is_featured: boolean;
  is_available: boolean;
  preparation_time?: string;
  portion_size?: string;
  created_at?: string;
}

export interface CustomerReview {
  id: string;
  customer_name: string;
  rating: number; // 1 to 5
  review_text: string;
  dish_mentioned?: string;
  location?: string; // e.g., 'Lekki Phase 1, Lagos'
  date: string; // e.g., 'September 2026' or ISO string
  is_verified?: boolean;
  created_at?: string;
}

export interface OrderFormData {
  customerName: string;
  deliveryLocation: string;
  phoneNumber: string;
  quantity: number;
  additionalNotes?: string;
}

export type ActivePage = 'home' | 'menu' | 'about' | 'contact';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export type Theme = 'terracotta' | 'dark';

export interface SiteSettings {
  brandName: string;
  brandSubtitle: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHoursWeekdays: string;
  openingHoursSunday: string;
  heroHeadline: string;
  heroAccent: string;
  heroDescription: string;
  aboutStory: string;
  noticeBanner: string;
  // About Us Page Dish Images & Spotlights
  aboutDish1Image?: string;
  aboutDish1Title?: string;
  aboutDish1Subtitle?: string;
  aboutDish1MenuId?: string;
  aboutDish2Image?: string;
  aboutDish2Title?: string;
  aboutDish2Subtitle?: string;
  aboutDish2MenuId?: string;
}
