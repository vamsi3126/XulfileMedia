import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  DownloadCloud, Info, CheckCircle2, ShieldCheck, Zap, 
  HelpCircle, X, ExternalLink, FileCode, Video, Music2, FolderArchive, 
  FileText, User, Sparkles, HardDrive
} from 'lucide-react';
import Hero from './components/Hero';
import MediaPreview from './components/MediaPreview';
import RecentDownloads from './components/RecentDownloads';
import TermsModal from './components/TermsModal';
import DeveloperModal from './components/DeveloperModal';
import LanguageSelector from './components/LanguageSelector';
import SeoFeatures from './components/SeoFeatures';
import FaqsPage from './pages/FaqsPage';
import BlogsPage from './pages/BlogsPage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const location = useLocation();
  const [mediaData, setMediaData] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);
  const [history, setHistory] = useState([]);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('xulfmedia_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    try {
      localStorage.setItem('xulfmedia_language', langCode);
    } catch {}
  };

  // Scroll to top upon navigating to a new route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Load download history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('xulfmedia_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Check backend health
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(res => res.ok ? setApiOnline(true) : setApiOnline(false))
      .catch(() => setApiOnline(false));
  }, []);

  // Disable browser right-click context menu globally
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('xulfmedia_history');
    } catch {}
  };

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError(null);
    setMediaData(null);
    setInputUrl(url);

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch media data');
      }
      
      setMediaData(data);

      // Save to recent download history
      const historyItem = {
        title: data.title || 'Downloaded File',
        category: data.category || 'file',
        platform: data.platform || 'File',
        filesize_formatted: data.filesize_formatted || '',
        thumbnail: data.thumbnail || '',
        originalUrl: url,
        timestamp: Date.now()
      };

      setHistory(prev => {
        const filtered = prev.filter(h => h.originalUrl !== url);
        const updated = [historyItem, ...filtered].slice(0, 12);
        try {
          localStorage.setItem('xulfmedia_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });

    } catch (err) {
      setError(err.message || 'Failed to analyze URL. Please ensure the link is public and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen wavy-canvas-bg relative flex flex-col font-sans text-[#0F172A] selection:bg-[#FF0038] selection:text-white overflow-x-hidden">
      {/* Decorative Wavy Background - Left Peach/Pink Wave */}
      <div className="absolute top-0 left-0 w-[35vw] max-w-[480px] h-[90vh] pointer-events-none -z-10 overflow-hidden">
        <svg viewBox="0 0 500 900" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path d="M-60 0 C130 180, 240 330, 150 540 C60 740, -20 830, -60 900 Z" fill="url(#left-grad-1)" />
          <path d="M-80 0 C70 230, 170 390, 90 620 C10 830, -50 880, -80 900 Z" fill="url(#left-grad-2)" opacity="0.75" />
          <defs>
            <linearGradient id="left-grad-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE4E6" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#FECDD3" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FED7AA" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="left-grad-2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative Wavy Background - Right Warm Amber Wave */}
      <div className="absolute top-0 right-0 w-[38vw] max-w-[540px] h-[95vh] pointer-events-none -z-10 overflow-hidden">
        <svg viewBox="0 0 540 950" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path d="M600 0 C410 160, 310 350, 390 570 C470 790, 560 880, 600 950 Z" fill="url(#right-grad-1)" />
          <path d="M620 0 C460 210, 370 410, 440 650 C510 870, 580 910, 620 950 Z" fill="url(#right-grad-2)" opacity="0.65" />
          <defs>
            <linearGradient id="right-grad-1" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FED7AA" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="right-grad-2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Navbar */}
      <header className="px-4 sm:px-8 py-3.5 sm:py-4 w-full border-b border-slate-100/90 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="w-[94%] sm:w-[85%] md:w-[70%] mx-auto flex justify-between items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
            <div className="w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-2xl sm:rounded-[18px] bg-[#FF0038] flex items-center justify-center shadow-lg shadow-red-500/25 text-white shrink-0 group-hover:scale-105 transition-transform">
              <DownloadCloud className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0F172A] leading-tight">
                  Xulf<span className="text-[#FF0038]">Media</span>
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF0F2] text-[#FF0038]">
                  v2.0
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#64748B] hidden sm:block font-medium">Universal File & Media Downloader</p>
            </div>
          </Link>

          {/* Top Right: FAQs, Blogs & Language Selector Dropdown */}
          <div className="flex items-center gap-3.5 sm:gap-5">
            <Link
              to="/faqs"
              id="nav-faqs-link"
              className={`text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer ${
                location.pathname === '/faqs' ? 'text-[#FF0038] font-bold' : 'text-[#6366F1] hover:text-[#4F46E5]'
              }`}
            >
              FAQs
            </Link>
            <Link
              to="/blogs"
              id="nav-blogs-link"
              className={`text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer ${
                location.pathname === '/blogs' ? 'text-[#FF0038] font-bold' : 'text-[#6366F1] hover:text-[#4F46E5]'
              }`}
            >
              Blogs
            </Link>
            <LanguageSelector currentLang={language} onChange={handleLanguageChange} />
          </div>
        </div>
      </header>
      
      {/* Dynamic Page Views */}
      <Routes>
        {/* Home Downloader Page */}
        <Route 
          path="/" 
          element={
            <main className="flex-1 w-[94%] sm:w-[85%] md:w-[70%] mx-auto py-8 sm:py-12 flex flex-col items-center z-10">
              <Hero onAnalyze={handleAnalyze} isLoading={loading} lang={language} />
              
              {/* Error Notification */}
              {error && (
                <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 w-full shadow-sm animate-in fade-in duration-200">
                  <Info size={20} className="text-[#FF0038] shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm leading-relaxed">
                    <strong className="block font-bold text-rose-900 mb-0.5">Extraction Failed</strong>
                    <p className="text-rose-700">{error}</p>
                    <p className="text-xs text-rose-500 mt-2">
                      Tip: Make sure the URL is public, accessible without login, or click one of the popular platform chips above.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setError(null)}
                    className="text-rose-400 hover:text-rose-800 p-1 rounded-lg cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Media Preview Result */}
              {mediaData && (
                <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-400">
                  <MediaPreview 
                    data={mediaData} 
                    originalUrl={inputUrl} 
                  />
                </div>
              )}

              {/* Recent Activity Dashboard */}
              {!mediaData && (
                <RecentDownloads 
                  history={history} 
                  onSelect={(url) => handleAnalyze(url)} 
                  onClear={handleClearHistory} 
                />
              )}

              {/* SEO Platform Guides & FAQ Section */}
              <SeoFeatures />
            </main>
          } 
        />

        {/* Dedicated /faqs Page */}
        <Route path="/faqs" element={<FaqsPage />} />

        {/* Dedicated /blogs Page */}
        <Route path="/blogs" element={<BlogsPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Midnight Deep Dark Footer: #1E293B */}
      <footer className="w-full midnight-footer py-6 px-6 text-center text-xs text-slate-400 mt-auto z-10">
        <div className="w-[94%] sm:w-[85%] md:w-[70%] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-normal text-slate-400">© 2026 XulfMedia (XulfileMedia). Fast & Universal File Downloader.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400">
            <Link to="/" className="hover:text-white transition-colors font-medium">Home</Link>
            <span className="text-slate-600">•</span>
            <Link to="/faqs" className="hover:text-white transition-colors font-medium">FAQs</Link>
            <span className="text-slate-600">•</span>
            <Link to="/blogs" className="hover:text-white transition-colors font-medium">Blogs & Guides</Link>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => setShowDeveloperModal(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
            >
              <User size={13} className="text-[#38BDF8]" />
              <span>Developer Portfolio</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="hover:text-white transition-colors cursor-pointer font-medium"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => setShowFormatsModal(true)}
              className="hover:text-white transition-colors cursor-pointer font-medium"
            >
              Supported Formats
            </button>
          </div>
        </div>
      </footer>

      {/* Developer & Portfolio Modal */}
      <DeveloperModal
        isOpen={showDeveloperModal}
        onClose={() => setShowDeveloperModal(false)}
      />

      {/* Standalone Terms & Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setShowTermsModal(false)}
        isStandaloneView={true}
      />

      {/* Supported Platforms Modal */}
      {showFormatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="studio-card max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl relative bg-[#FFFFFF] animate-in zoom-in-95 duration-150 text-[#0F172A]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#2563EB]">
                  <DownloadCloud size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0F172A]">Supported Formats & Platforms</h3>
                  <p className="text-xs text-[#64748B]">Universal streaming and direct file resolution</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFormatsModal(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A] flex items-center gap-2 mb-1">
                  <FileCode size={15} className="text-[#2563EB]" /> Direct Files & Documents
                </span>
                <p className="text-[#64748B]">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, EPUB, JSON, etc.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A] flex items-center gap-2 mb-1">
                  <FolderArchive size={15} className="text-[#7C3AED]" /> Compressed Archives & Software
                </span>
                <p className="text-[#64748B]">ZIP, RAR, 7Z, TAR, GZ, ISO, APK, EXE, DMG, MSI, DEB, RPM, etc.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A] flex items-center gap-2 mb-1">
                  <Video size={15} className="text-[#2563EB]" /> Video & Social Media
                </span>
                <p className="text-[#64748B]">YouTube, Instagram (Reels & Posts), TikTok, Twitter/X, Facebook, Reddit, Vimeo, Twitch.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A] flex items-center gap-2 mb-1">
                  <HardDrive size={15} className="text-[#06B6D4]" /> Cloud Drives & Git Hosting
                </span>
                <p className="text-[#64748B]">Google Drive share links, GitHub releases and raw binaries.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="button"
                onClick={() => setShowFormatsModal(false)}
                className="btn-primary px-6 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
