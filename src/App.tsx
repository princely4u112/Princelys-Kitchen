/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OrderModal } from './components/OrderModal';
import { AdminModal } from './components/AdminModal';
import { MenuItem, ActivePage, CustomerReview } from './types';
import { INITIAL_MENU_ITEMS } from './data/initialMenu';
import { INITIAL_REVIEWS } from './data/initialReviews';
import { getMenuItems, getReviews } from './lib/supabase';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in Princely’s Kitchen App:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Something went wrong</h2>
          <p className="text-neutral-400 text-sm max-w-md mb-4">
            {this.state.error?.message || 'An unexpected error occurred while rendering the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl text-sm"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainAppContent() {
  const { isTerracotta } = useTheme();
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);

  // Modals state
  const [selectedItemForOrder, setSelectedItemForOrder] = useState<MenuItem | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'manage' | 'add' | 'settings' | 'reviews' | 'database'>('manage');

  const handleOpenAdmin = (tab: 'manage' | 'add' | 'settings' | 'reviews' | 'database' = 'manage') => {
    setAdminInitialTab(tab);
    setIsAdminModalOpen(true);
  };

  // Load menu items from Supabase or local storage
  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const res = await getMenuItems();
      if (res.items && res.items.length > 0) {
        setMenuItems(res.items);
      }
      setIsSupabaseActive(res.isSupabase);
    } catch (e) {
      console.error('Failed to load menu items:', e);
      setMenuItems(INITIAL_MENU_ITEMS);
    } finally {
      setIsLoading(false);
    }
  };

  // Load reviews from Supabase or local storage
  const loadReviews = async () => {
    try {
      const res = await getReviews();
      if (res.reviews && res.reviews.length > 0) {
        setReviews(res.reviews);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
      setReviews(INITIAL_REVIEWS);
    }
  };

  useEffect(() => {
    loadMenu();
    loadReviews();

    // Owner Secret Keyboard Shortcut: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };

    // Secret URL Trigger: ?admin=true or #admin
    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      setIsAdminModalOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick order handler for the CTA buttons
  const handleQuickOrder = () => {
    if (menuItems.length > 0) {
      const featured = menuItems.find((i) => i.is_featured) || menuItems[0];
      setSelectedItemForOrder(featured);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-orange-600 selection:text-white ${
        isTerracotta ? 'bg-[#FDFBF7] text-stone-900' : 'bg-black text-white'
      }`}
    >
      {/* Navigation Bar with Grouped Clickable Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAdmin={() => handleOpenAdmin('manage')}
        onQuickOrder={handleQuickOrder}
      />

      {/* Dynamic Page Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            menuItems={menuItems}
            onSelectItem={(item) => setSelectedItemForOrder(item)}
            setActivePage={setActivePage}
            reviews={reviews}
            onRefreshReviews={loadReviews}
          />
        )}

        {activePage === 'menu' && (
          <MenuPage
            menuItems={menuItems}
            onSelectItem={(item) => setSelectedItemForOrder(item)}
            isLoading={isLoading}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            setActivePage={setActivePage}
            menuItems={menuItems}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
        onOpenAdmin={() => handleOpenAdmin('manage')}
        menuItems={menuItems}
      />

      {/* Order Modal with WhatsApp integration */}
      <OrderModal
        item={selectedItemForOrder}
        isOpen={!!selectedItemForOrder}
        onClose={() => setSelectedItemForOrder(null)}
      />

      {/* Admin Dashboard */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        menuItems={menuItems}
        onRefreshMenu={loadMenu}
        isSupabaseActive={isSupabaseActive}
        reviews={reviews}
        onRefreshReviews={loadReviews}
        initialTab={adminInitialTab}
      />

      {/* Hovering WhatsApp Floating Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SiteSettingsProvider>
          <AdminAuthProvider>
            <MainAppContent />
          </AdminAuthProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
