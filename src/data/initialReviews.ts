import { CustomerReview } from '../types';

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customer_name: 'Chidinma Okafor',
    rating: 5,
    review_text: 'The smoky party jollof tastes exactly like a Saturday Lagos wedding party! You can actually smell and taste the firewood aroma. Delivery was hot and swift to Lekki Phase 1.',
    dish_mentioned: 'Smoky Party Jollof Rice',
    location: 'Lekki Phase 1, Lagos',
    date: '3 days ago',
    is_verified: true,
    created_at: '2026-09-20T14:30:00Z'
  },
  {
    id: 'rev-2',
    customer_name: 'Tunde Bakare',
    rating: 5,
    review_text: 'Hands down the best Calabar Afang soup in Lagos! Packed with kpomo, dried catfish, periwinkles, and tender goat meat. Ordered with pounded yam and it was heavenly.',
    dish_mentioned: 'Authentic Calabar Afang Soup',
    location: 'Ikeja GRA, Lagos',
    date: '1 week ago',
    is_verified: true,
    created_at: '2026-09-16T18:15:00Z'
  },
  {
    id: 'rev-3',
    customer_name: 'Dr. Emeka Nnamani',
    rating: 5,
    review_text: 'I was hesitant to order Egusi soup online, but Princely’s Kitchen proved me wrong. Hand-molded lump egusi with authentic bitterleaf. Very rich and filling.',
    dish_mentioned: 'Ere-Rich Egusi Soup (Lump Style)',
    location: 'Maitama, Abuja',
    date: '2 weeks ago',
    is_verified: true,
    created_at: '2026-09-08T12:00:00Z'
  },
  {
    id: 'rev-4',
    customer_name: 'Amina Bello',
    rating: 5,
    review_text: 'The spicy beef suya is tender, well seasoned with yaji spice, and not burnt like other roadside grills. Generous sliced onions and fresh cabbage too!',
    dish_mentioned: 'Spicy Beef Suya',
    location: 'Victoria Island, Lagos',
    date: '3 weeks ago',
    is_verified: true,
    created_at: '2026-09-02T20:45:00Z'
  },
  {
    id: 'rev-5',
    customer_name: 'Blessing Johnson',
    rating: 5,
    review_text: 'Generous portions, exceptional packaging that did not spill in transit, and customer service on WhatsApp is super polite and fast. Princely is my family kitchen now.',
    dish_mentioned: 'Royal Special Fried Rice',
    location: 'Port Harcourt / Lagos',
    date: '1 month ago',
    is_verified: true,
    created_at: '2026-08-25T16:10:00Z'
  }
];
