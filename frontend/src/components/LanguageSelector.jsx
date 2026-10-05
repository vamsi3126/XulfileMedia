import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian' },
  { code: 'th', name: 'ไทย' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'zh-CN', name: '简体中文' },
];

const LanguageSelector = ({ currentLang = 'en', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const selected = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const handleSelect = (lang) => {
    if (onChange) onChange(lang.code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Pill shape matching user screenshot */}
      <button
        type="button"
        id="language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-[13px] font-semibold transition-all duration-150 cursor-pointer border border-slate-200/60 shadow-2xs select-none"
        aria-expanded={isOpen}
      >
        <Globe size={14} className="text-slate-600 stroke-[2.2]" />
        <span>{selected.name}</span>
        <ChevronDown 
          size={14} 
          className={`text-slate-500 transition-transform duration-200 stroke-[2.2] ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          id="language-dropdown-menu"
          className="absolute right-0 mt-2 w-44 max-h-80 overflow-y-auto rounded-2xl bg-white border border-[#E2E8F0] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === selected.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang)}
                className={`w-full text-left px-4 py-2.5 text-xs sm:text-[13px] transition-colors cursor-pointer block first:rounded-t-xl last:rounded-b-xl ${
                  isSelected 
                    ? 'bg-[#FFF0F2] text-[#FF0038] font-bold' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
