import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  getLocalSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  resetSiteSettingsToDefaults,
  formatWhatsAppUrl,
  formatPhoneTel
} from '../lib/supabase';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
  resetSettings: () => void;
  formatWhatsApp: (message?: string) => string;
  formatTel: () => string;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(getLocalSiteSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Sync settings from Supabase if connected
  useEffect(() => {
    let mounted = true;
    getSiteSettings().then((res) => {
      if (mounted) {
        setSettings(res.settings);
        setIsLoading(false);
      }
    });

    // Listen to custom event for same-tab updates
    const handleSettingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };

    window.addEventListener('princelys_kitchen_settings_changed', handleSettingsChanged);
    return () => {
      mounted = false;
      window.removeEventListener('princelys_kitchen_settings_changed', handleSettingsChanged);
    };
  }, []);

  const handleUpdateSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    const res = await updateSiteSettings(updates);
    if (res.success) {
      setSettings(res.settings);
    }
    return { success: res.success, error: res.error };
  }, []);

  const handleResetSettings = useCallback(() => {
    const defaults = resetSiteSettingsToDefaults();
    setSettings(defaults);
  }, []);

  const formatWhatsApp = useCallback((message = 'Hello Princely\'s Kitchen, I would like to place an order!') => {
    return formatWhatsAppUrl(settings.whatsappNumber, message);
  }, [settings.whatsappNumber]);

  const formatTel = useCallback(() => {
    return formatPhoneTel(settings.phoneNumber);
  }, [settings.phoneNumber]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings: handleUpdateSettings,
        resetSettings: handleResetSettings,
        formatWhatsApp,
        formatTel,
        isLoading
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
