import React, { useState } from 'react';
import { Link2, Loader2, Clipboard, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTranslation } from '../translations';

// SVG Platform Brand Logos
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <defs>
      <radialGradient id="rg" r="150%" cx="30%" cy="107%">
        <stop stopColor="#fdf497" offset="0%" />
        <stop stopColor="#fdf497" offset="5%" />
        <stop stopColor="#fd5949" offset="45%" />
        <stop stopColor="#d6249f" offset="60%" />
        <stop stopColor="#285AEB" offset="90%" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#rg)" />
    <path fill="#ffffff" d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#FFC107" d="M8.05 3.5h7.9l7.9 13.7h-7.9z"/>
    <path fill="#0066DA" d="M15.95 17.2H.15l3.95-6.85h15.8z"/>
    <path fill="#00AC47" d="M.15 17.2L4.1 10.35 12 3.5l-3.95 6.85z"/>
  </svg>
);

const DropboxIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0061FF">
    <path d="M6 2L0 6.64l6 4.64 6-4.64L6 2zm12 0l-6 4.64 6 4.64 6-4.64L18 2zM0 15.92l6 4.64 6-4.64-6-4.64-6 4.64zm18-4.64l-6 4.64 6 4.64 6-4.64-6-4.64zM6 22l6-4.14 6 4.14-6 4.14L6 22z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#000000">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.78a8.28 8.28 0 0 0 4.91 1.6V6.92a4.83 4.83 0 0 1-1-.23z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#000000">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const PLATFORMS = [
  { label: 'YouTube', icon: YouTubeIcon },
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'Google Drive', icon: GoogleDriveIcon },
  { label: 'Dropbox', icon: DropboxIcon },
  { label: 'TikTok', icon: TikTokIcon },
  { label: 'Twitter/X', icon: TwitterXIcon }
];

const Hero = ({ onAnalyze, isLoading, lang = 'en' }) => {
  const [url, setUrl] = useState('');
  const t = getTranslation(lang);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center pt-2 pb-6">
      {/* Universal Engine Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFF0F2] text-[#FF0038] text-[11px] font-bold tracking-wider mb-6 shadow-2xs"
      >
        {t.badge}
      </motion.div>

      {/* Main Headline */}
      <motion.h2 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-5xl sm:text-6xl md:text-[68px] font-black text-[#0F172A] tracking-tight leading-[1.08] mb-4"
      >
        <span>{t.headlinePre}</span>
        <span className="text-[#FF0038]">{t.headlineAny}</span>
        <span className="text-[#F59E0B]">{t.headlineFile}</span>
        <span className="block mt-1">{t.headlinePost}</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-sm sm:text-base text-[#64748B] mb-8 max-w-2xl mx-auto leading-relaxed font-normal"
      >
        {t.subtitle}
      </motion.p>

      {/* Search Input Box */}
      <motion.form 
        id="download-form"
        onSubmit={handleSubmit}
        className="w-full studio-card rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 border border-[#E2E8F0] shadow-xl shadow-slate-200/50 bg-[#FFFFFF] focus-within:border-[#FF0038]/60 focus-within:ring-4 focus-within:ring-rose-100 transition-all duration-200"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <div className="flex-1 w-full flex items-center px-3 py-1">
          {/* Red Link Icon */}
          <Link2 className="text-[#FF0038] w-5 h-5 shrink-0 ml-1.5 rotate-[-45deg]" />
          <input 
            id="url-input"
            type="url" 
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.placeholder} 
            className="w-full px-3 py-2.5 outline-none text-[#0F172A] placeholder-slate-400 bg-transparent text-sm sm:text-[15px] font-normal"
            disabled={isLoading}
          />
          {url ? (
            <button 
              id="clear-btn"
              type="button" 
              onClick={() => setUrl('')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Clear input"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        {/* Paste Button */}
        <button 
          id="paste-btn"
          type="button" 
          onClick={handlePaste}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#FF0038] bg-[#FFF0F2] hover:bg-[#FFE4E6] rounded-xl sm:rounded-2xl transition-all shrink-0 cursor-pointer shadow-2xs"
          title="Paste from clipboard"
        >
          <Clipboard size={14} className="stroke-[2.2]" />
          <span>{t.paste}</span>
        </button>

        {/* Fetch Download Button */}
        <button 
          id="submit-btn"
          type="submit" 
          disabled={isLoading || !url.trim()}
          className="w-full sm:w-auto btn-primary font-bold py-3 px-6 sm:px-7 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 text-sm sm:text-[15px] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>{t.fetch}</span>
              <ArrowRight size={16} className="stroke-[2.5]" />
            </>
          )}
        </button>
      </motion.form>

      {/* Popular Platforms Row - Display Only */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs select-none"
      >
        <span className="text-slate-500 font-semibold mr-1">{t.popular}</span>
        {PLATFORMS.map((platform, idx) => {
          const Icon = platform.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] text-slate-700 border border-[#E2E8F0] shadow-2xs font-medium cursor-default"
            >
              <Icon />
              <span>{platform.label}</span>
            </div>
          );
        })}
      </motion.div>

      {/* 3 Feature Badges */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="mt-14 w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-left"
      >
        {/* Card 1: Red Dot */}
        <div className="studio-card p-6 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3.5">
            <span className="w-3 h-3 rounded-full bg-[#FF0038] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] mb-1.5">{t.directStreamTitle}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.directStreamDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Amber Dot */}
        <div className="studio-card p-6 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3.5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] mb-1.5">{t.socialTitle}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.socialDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Amber Dot */}
        <div className="studio-card p-6 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3.5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base text-[#0F172A] mb-1.5">{t.safeTitle}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.safeDesc}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
