import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { ContactFormData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const ContactPage: React.FC = () => {
  const { isTerracotta } = useTheme();
  const { settings, formatWhatsApp, formatTel } = useSiteSettings();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'Food Order & General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setErrorMessage('Please provide your name and message.');
      return;
    }

    setErrorMessage('');
    const text = `Hello ${settings.brandName}, my name is ${formData.name.trim()}.${
      formData.phone ? ` My phone number is ${formData.phone.trim()}.` : ''
    } Subject: ${formData.subject}. Message: ${formData.message.trim()}`;

    const whatsappUrl = formatWhatsApp(text);

    setSubmitted(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div
        className={`relative rounded-3xl overflow-hidden border p-8 sm:p-12 text-center transition-colors ${
          isTerracotta ? 'bg-[#F5EFE6] border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-orange-600 text-xs font-bold uppercase tracking-widest block">
            Visit Us or Order Delivery
          </span>
          <h1 className={`font-heading text-3xl sm:text-5xl font-extrabold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
            Get in Touch With {settings.brandName}
          </h1>
          <p className={`text-sm sm:text-base ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
            Have questions about catering, group orders, or today's special soups? Call or WhatsApp us anytime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info & Details */}
        <div className="space-y-6">
          <h2 className={`font-heading text-2xl font-bold border-l-4 border-red-600 pl-3 ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
            Store Location & Contact Information
          </h2>

          <div className="space-y-4">
            {/* Phone Card */}
            <div
              className={`p-6 border rounded-2xl flex items-start gap-4 transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  Phone & WhatsApp Ordering
                </h3>
                <a
                  href={`tel:${formatTel()}`}
                  className={`block text-xl font-bold transition ${
                    isTerracotta ? 'text-stone-900 hover:text-red-700' : 'text-white hover:text-orange-400'
                  }`}
                >
                  {settings.phoneNumber}
                </a>
                <p className={`text-xs ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                  Call directly or send a WhatsApp message to book meals and arrange immediate dispatch.
                </p>
                <div className="pt-2">
                  <a
                    href={formatWhatsApp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-red-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open WhatsApp Chat directly</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email / Gmail Card */}
            <div
              className={`p-6 border rounded-2xl flex items-start gap-4 transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  Official Gmail & Email Inquiries
                </h3>
                <a
                  href={`mailto:${settings.email}`}
                  className={`block text-lg sm:text-xl font-bold transition break-all ${
                    isTerracotta ? 'text-stone-900 hover:text-red-700' : 'text-white hover:text-orange-400'
                  }`}
                >
                  {settings.email}
                </a>
                <p className={`text-xs ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
                  Reach out for event catering, bulk food orders, partnerships, and customer support.
                </p>
                <div className="pt-2">
                  <a
                    href={`mailto:${settings.email}?subject=Inquiry%20for%20${encodeURIComponent(settings.brandName)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-red-700"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email us at {settings.email}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div
              className={`p-6 border rounded-2xl flex items-start gap-4 transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  Physical Kitchen Address
                </h3>
                <p className={`text-base font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
                  {settings.address}
                </p>
                <p className={`text-xs pt-1 ${isTerracotta ? 'text-stone-400' : 'text-neutral-500'}`}>
                  (Pickup, Dine-in & Island/Mainland Courier Dispatch available)
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div
              className={`p-6 border rounded-2xl flex items-start gap-4 transition-colors ${
                isTerracotta ? 'bg-white border-[#E2D8C3]' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isTerracotta ? 'text-stone-500' : 'text-neutral-400'}`}>
                  Operating Hours
                </h3>
                <div className="space-y-1 text-sm pt-1">
                  <div>
                    <span className={`font-semibold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>{settings.openingHoursWeekdays}</span>
                  </div>
                  <div>
                    <span className={`font-semibold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>{settings.openingHoursSunday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className={`border rounded-3xl p-8 space-y-6 transition-colors ${
            isTerracotta ? 'bg-white border-[#E2D8C3] shadow-sm' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          <div>
            <h2 className={`font-heading text-2xl font-bold ${isTerracotta ? 'text-stone-900' : 'text-white'}`}>
              Send Us a Message
            </h2>
            <p className={`text-xs mt-1 ${isTerracotta ? 'text-stone-600' : 'text-neutral-400'}`}>
              Fill in your inquiry and click send to automatically format and forward to our WhatsApp line ({settings.phoneNumber}).
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-900/10 border border-red-500 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submitted && (
            <div className="p-3 bg-orange-100 border border-orange-500/60 rounded-xl text-xs text-stone-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Message prepared! Opening WhatsApp to chat with Princely’s Kitchen...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
                Your Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="contact-form-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ngozi Eze"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                  isTerracotta
                    ? 'bg-[#FAF7F0] border-[#E2D8C3] text-stone-900 placeholder-stone-400'
                    : 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="contact-form-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 08034567890"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                    isTerracotta
                      ? 'bg-[#FAF7F0] border-[#E2D8C3] text-stone-900 placeholder-stone-400'
                      : 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="contact-form-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                    isTerracotta
                      ? 'bg-[#FAF7F0] border-[#E2D8C3] text-stone-900 placeholder-stone-400'
                      : 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
                Subject
              </label>
              <select
                id="contact-form-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                  isTerracotta
                    ? 'bg-[#FAF7F0] border-[#E2D8C3] text-stone-900'
                    : 'bg-neutral-950 border-neutral-700 text-white'
                }`}
              >
                <option value="Food Order & General Inquiry">Food Order & General Inquiry</option>
                <option value="Event Catering Inquiry">Event & Party Catering</option>
                <option value="Office Bulk Lunches">Office Bulk Lunches</option>
                <option value="Custom Native Soup Request">Custom Native Soup Request</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isTerracotta ? 'text-stone-700' : 'text-neutral-300'}`}>
                Message / Inquiry Details <span className="text-red-600">*</span>
              </label>
              <textarea
                id="contact-form-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what food or service you are inquiring about..."
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition-colors ${
                  isTerracotta
                    ? 'bg-[#FAF7F0] border-[#E2D8C3] text-stone-900 placeholder-stone-400'
                    : 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                }`}
              />
            </div>

            <button
              type="submit"
              id="contact-form-submit-btn"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp (08124491537)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
