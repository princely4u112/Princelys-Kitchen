import React, { useRef } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Flame, Heart, Mail } from 'lucide-react';
import { ActivePage, MenuItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onOpenAdmin: () => void;
  menuItems?: MenuItem[];
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onOpenAdmin, menuItems = [] }) => {
  const currentYear = new Date().getFullYear();
  const { isTerracotta } = useTheme();
  const { settings, formatWhatsApp, formatTel } = useSiteSettings();

  // Dishes for specialties section (dynamically sourced from current menu)
  const specialtiesList = menuItems.length > 0
    ? menuItems.slice(0, 7).map((m) => m.name)
    : ['Smoky Party Jollof Rice', 'Royal Special Fried Rice', 'Authentic Calabar Afang Soup', 'Ere-Rich Egusi Soup', 'Fluffy Pounded Yam', 'Spicy Fire-Grilled Suya', 'Fisherman Soup'];

  // Discreet click counter for owner to access admin secretly by clicking copyright text 3 times
  const copyrightClicksRef = useRef(0);
  const copyrightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretAdminTrigger = () => {
    copyrightClicksRef.current += 1;
    if (copyrightTimeoutRef.current) clearTimeout(copyrightTimeoutRef.current);

    if (copyrightClicksRef.current >= 3) {
      copyrightClicksRef.current = 0;
      onOpenAdmin();
    } else {
      copyrightTimeoutRef.current = setTimeout(() => {
        copyrightClicksRef.current = 0;
      }, 1000);
    }
  };

  return (
    <footer
      className={`border-t transition-colors duration-250 ${
        isTerracotta
          ? 'bg-[#F5F0E6] border-[#E2D8C3] text-stone-700'
          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
      }`}
    >
      {/* Top Banner with Red/Orange Accent */}
      <div
        className={`border-b py-10 px-4 sm:px-6 lg:px-8 ${
          isTerracotta ? 'bg-[#ECE5D6] border-[#DDD1BA]' : 'border-neutral-900 bg-neutral-900/40'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-orange-600 font-bold uppercase tracking-wider text-xs">
              Hungry For Authentic Local Goodness?
            </span>
            <h3
              className={`font-heading text-2xl sm:text-3xl font-bold mt-1 ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              Fresh, Firewood-Smoky Nigerian Meals Delivered To Your Door
            </h3>
          </div>
          <a
            href={formatWhatsApp(`Hello ${settings.brandName}, I would like to place an order!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-red-950/20 transition-all hover:scale-105 shrink-0"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat on WhatsApp: {settings.phoneNumber}</span>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center border border-orange-500/30">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span
                className={`font-heading text-2xl font-bold ${
                  isTerracotta ? 'text-stone-900' : 'text-white'
                }`}
              >
                {settings.brandName}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              We serve the most delicious and authentic Nigerian cuisine, prepared with age-old secret recipes, native spices, and hearty portions that remind you of home.
            </p>
            <div className={`pt-2 text-xs ${isTerracotta ? 'text-stone-500' : 'text-neutral-500'}`}>
              Trusted by food lovers across Lagos, Abuja, Port Harcourt & beyond.
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4
              className={`font-bold text-base mb-4 border-l-2 border-red-600 pl-2 font-heading ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`${isTerracotta ? 'text-stone-700 hover:text-red-700' : 'hover:text-orange-400'} transition-colors cursor-pointer`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`${isTerracotta ? 'text-stone-700 hover:text-red-700' : 'hover:text-orange-400'} transition-colors cursor-pointer`}
                >
                  Our Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`${isTerracotta ? 'text-stone-700 hover:text-red-700' : 'hover:text-orange-400'} transition-colors cursor-pointer`}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`${isTerracotta ? 'text-stone-700 hover:text-red-700' : 'hover:text-orange-400'} transition-colors cursor-pointer`}
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4
              className={`font-bold text-base mb-4 border-l-2 border-orange-600 pl-2 font-heading ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                <div>
                  <a
                    href={`tel:${formatTel()}`}
                    className={`font-semibold ${
                      isTerracotta ? 'text-stone-900 hover:text-red-700' : 'text-white hover:text-orange-400'
                    }`}
                  >
                    {settings.phoneNumber}
                  </a>
                  <span className={`block text-xs ${isTerracotta ? 'text-stone-500' : 'text-neutral-500'}`}>
                    Direct Calls & WhatsApp Orders
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                <div>
                  <a
                    href={`mailto:${settings.email}`}
                    className={`font-semibold break-all ${
                      isTerracotta ? 'text-stone-900 hover:text-red-700' : 'text-white hover:text-orange-400'
                    }`}
                  >
                    {settings.email}
                  </a>
                  <span className={`block text-xs ${isTerracotta ? 'text-stone-500' : 'text-neutral-500'}`}>
                    Official Inquiries & Catering
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                <span className={isTerracotta ? 'text-stone-600' : 'text-neutral-400'}>
                  {settings.address}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                <div>
                  <p className={isTerracotta ? 'text-stone-700' : 'text-neutral-300'}>{settings.openingHoursWeekdays}</p>
                  <p className={`text-xs ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>{settings.openingHoursSunday}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Specialties & Assurance */}
          <div>
            <h4
              className={`font-bold text-base mb-4 border-l-2 border-red-600 pl-2 font-heading ${
                isTerracotta ? 'text-stone-900' : 'text-white'
              }`}
            >
              Our Specialties
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {specialtiesList.map((spec) => (
                <span
                  key={spec}
                  className={`px-2.5 py-1 rounded-md border ${
                    isTerracotta
                      ? 'bg-white border-[#E2D8C3] text-stone-700'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}
                >
                  {spec}
                </span>
              ))}
            </div>
            <div
              className={`mt-4 p-3 rounded-lg text-xs ${
                isTerracotta
                  ? 'bg-orange-50 border border-orange-200 text-stone-800'
                  : 'bg-red-950/30 border border-red-900/40 text-orange-200'
              }`}
            >
              {settings.noticeBanner || '⚡ Orders are prepared fresh to guarantee that hot-from-the-pot flavor.'}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isTerracotta ? 'border-[#DDD1BA] text-stone-600' : 'border-neutral-900 text-neutral-500'
          }`}
        >
          {/* Secret admin trigger: clicking the copyright notice 3 times */}
          <div
            onClick={handleSecretAdminTrigger}
            className="flex items-center gap-2 cursor-default select-none"
            title={settings.brandName}
          >
            <span>&copy; {currentYear} {settings.brandName}. All rights reserved. Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>for authentic Nigerian food lovers.</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href={formatWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className={isTerracotta ? 'text-stone-700 hover:text-orange-600 font-semibold' : 'text-neutral-400 hover:text-orange-400 font-semibold'}
            >
              WhatsApp DM ({settings.phoneNumber})
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
