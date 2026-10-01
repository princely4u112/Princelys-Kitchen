import React, { useState, useRef } from 'react';
import { Menu, X, Flame, Sun, Moon } from 'lucide-react';
import { ActivePage } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenAdmin: () => void;
  onQuickOrder?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isTerracotta } = useTheme();
  const { settings } = useSiteSettings();

  // Discreet click counter for owner to access admin by clicking logo 3 times
  const logoClickCountRef = useRef(0);
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoSecretClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);

    if (logoClickCountRef.current >= 3) {
      logoClickCountRef.current = 0;
      onOpenAdmin();
    } else {
      logoClickTimeoutRef.current = setTimeout(() => {
        logoClickCountRef.current = 0;
      }, 1000);
      handleNavClick('home');
    }
  };

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Our Menu' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact & Location' }
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-250 backdrop-blur-md border-b ${
        isTerracotta
          ? 'bg-[#FDFBF7]/95 border-[#E5DEC9] text-stone-900'
          : 'bg-black/95 border-neutral-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Brand Logo (Clicking 3 times opens Admin for the owner) */}
          <button
            onClick={handleLogoSecretClick}
            className="flex items-center gap-3.5 group text-left focus:outline-none cursor-pointer"
            id="brand-logo-btn"
            title={settings.brandName}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-950/30 border border-orange-500/40 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-pulse" />
            </div>
            <div>
              <span
                className={`block font-heading text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                  isTerracotta ? 'text-stone-900 group-hover:text-red-700' : 'text-white group-hover:text-orange-400'
                }`}
              >
                {settings.brandName}
              </span>
              <span
                className={`block text-[11px] sm:text-xs uppercase tracking-widest font-semibold ${
                  isTerracotta ? 'text-stone-500' : 'text-neutral-400'
                }`}
              >
                {settings.brandSubtitle}
              </span>
            </div>
          </button>

          {/* Grouped Clickable Navigation Bar (Home, Our Menu, About Us, Contact & Location, Mode Switch) */}
          <nav
            aria-label="Main Navigation"
            className={`hidden md:flex items-center p-1.5 rounded-2xl border shadow-sm transition-colors ${
              isTerracotta
                ? 'bg-[#F4ECE1] border-[#DFD5C2]'
                : 'bg-neutral-900/90 border-neutral-800'
            }`}
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isTerracotta
                        ? 'bg-white text-red-700 font-bold shadow-xs border border-[#D5C9B3]'
                        : 'bg-neutral-800 text-orange-400 font-bold shadow-xs border border-neutral-700'
                      : isTerracotta
                      ? 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Separator inside group */}
            <div
              className={`h-6 w-px mx-1.5 ${
                isTerracotta ? 'bg-[#D6CAB4]' : 'bg-neutral-700'
              }`}
            />

            {/* Mode Switch inside the grouped navigation bar */}
            <button
              id="theme-toggle-header-btn"
              onClick={toggleTheme}
              title={`Switch to ${isTerracotta ? 'Dark Firewood' : 'Warm Terracotta & Ivory'} mode`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isTerracotta
                  ? 'bg-white text-stone-800 border-[#D5C9B3] hover:border-orange-500 hover:text-orange-600 shadow-xs'
                  : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-orange-500 hover:text-orange-400 shadow-xs'
              }`}
            >
              {isTerracotta ? (
                <>
                  <Moon className="w-4 h-4 text-orange-600" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-orange-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Mobile Mode Switch */}
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border cursor-pointer ${
                isTerracotta
                  ? 'bg-[#F2ECE0] text-stone-800 border-[#DDD4BF]'
                  : 'bg-neutral-900 text-neutral-200 border-neutral-800'
              }`}
              title="Toggle theme"
            >
              {isTerracotta ? <Moon className="w-5 h-5 text-orange-600" /> : <Sun className="w-5 h-5 text-orange-400" />}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl border cursor-pointer ${
                isTerracotta
                  ? 'text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE0] border-[#E5DEC9]'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900 border-neutral-800'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Group */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 pt-3 pb-6 transition-colors ${
            isTerracotta
              ? 'bg-[#FDFBF7] border-[#E5DEC9]'
              : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          <div
            className={`p-2 rounded-2xl border space-y-1.5 ${
              isTerracotta
                ? 'bg-[#F4ECE1] border-[#DFD5C2]'
                : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition cursor-pointer ${
                  activePage === item.id
                    ? isTerracotta
                      ? 'bg-white text-red-700 font-bold border border-[#D5C9B3] shadow-xs'
                      : 'bg-neutral-800 text-orange-400 font-bold border border-neutral-700 shadow-xs'
                    : isTerracotta
                    ? 'text-stone-700 hover:bg-white/60'
                    : 'text-neutral-300 hover:bg-neutral-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mode Switch in Mobile Navigation Group */}
            <div className={`pt-2 mt-1 border-t ${isTerracotta ? 'border-[#D5C9B3]' : 'border-neutral-700'}`}>
              <button
                onClick={toggleTheme}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-between border cursor-pointer ${
                  isTerracotta
                    ? 'bg-white text-stone-800 border-[#D5C9B3]'
                    : 'bg-neutral-800 text-neutral-200 border-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isTerracotta ? <Moon className="w-4 h-4 text-orange-600" /> : <Sun className="w-4 h-4 text-orange-400" />}
                  <span>Display Mode</span>
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-600/15 text-orange-600 font-bold">
                  {isTerracotta ? 'Switch to Dark' : 'Switch to Light'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
