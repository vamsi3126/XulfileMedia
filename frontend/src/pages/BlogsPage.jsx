import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Clock, Calendar, ArrowLeft, ArrowRight, 
  Share2, Check, Sparkles, ChevronRight, CheckCircle2, Bookmark
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const BLOG_CATEGORIES = [
  'All Articles',
  'Video Guides',
  'Social Media',
  'Cloud Storage',
  'Tips & Tricks'
];

const ARTICLES = [
  {
    id: 'youtube-1080p-4k-guide',
    title: 'How to Download YouTube Videos in 1080p & 4K Without Software',
    category: 'Video Guides',
    badgeColor: 'bg-red-50 text-red-600 border-red-200',
    date: 'Oct 04, 2026',
    readTime: '3 min read',
    excerpt: 'Learn how direct video stream resolvers extract original high-definition MP4 streams and convert audio seamlessly without intrusive desktop software.',
    content: [
      {
        heading: 'Why Most Downloaders Fail at 1080p and Above',
        body: 'YouTube serves high-resolution video (1080p, 1440p, 4K) as separate video and audio streams via DASH (Dynamic Adaptive Streaming over HTTP). Older legacy web converters fail because they rely on pre-muxed single streams capped at 720p. Modern web engines like XulfMedia resolve and merge both streams in real time on high-speed servers.'
      },
      {
        heading: 'Step-by-Step Download Guide',
        body: '1. Open YouTube on your browser or mobile app.\n2. Tap "Share" and click "Copy Link".\n3. Paste the URL into the search bar at the top of XulfMedia.\n4. Click "Fetch Download" and select your preferred 1080p MP4 or audio-only MP3 format.'
      },
      {
        heading: 'Clean Streaming Without Ads',
        body: 'Unlike ad-heavy spam sites, XulfMedia does not require desktop client installations, browser extensions, or fake notification permissions, eliminating risks of malware or adware.'
      }
    ]
  },
  {
    id: 'instagram-reels-stories-guide',
    title: 'The Ultimate Guide to Saving Instagram Reels & Stories Directly to Gallery',
    category: 'Social Media',
    badgeColor: 'bg-pink-50 text-pink-600 border-pink-200',
    date: 'Oct 03, 2026',
    readTime: '4 min read',
    excerpt: 'Save Instagram Reels, video carousels, and stories with original audio directly to your iPhone, Android, or PC in seconds.',
    content: [
      {
        heading: 'How Instagram Media Extraction Works',
        body: 'Instagram encapsulates media within dynamic client-side React Native bundles. When you paste an Instagram link into XulfMedia, our backend query engine extracts the canonical CDN source link directly from the public Graph API metadata.'
      },
      {
        heading: 'Saving Directly to Camera Roll (iOS & Android)',
        body: 'When you tap "Fetch Download" on mobile, the raw video opens directly in your browser. Tap the native Share icon and choose "Save Video" to store it directly in your photo gallery without compression.'
      },
      {
        heading: 'Respecting Content Creator Rights',
        body: 'Remember to respect content creators. Downloaded reels should be kept for personal offline viewing or used in accordance with fair-use and copyright laws.'
      }
    ]
  },
  {
    id: 'google-drive-quota-bypass',
    title: 'How to Bypass Google Drive "Download Quota Exceeded" Errors',
    category: 'Cloud Storage',
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
    date: 'Oct 01, 2026',
    readTime: '3 min read',
    excerpt: 'Discover how direct link engines stream large shared files from Google Drive without bandwidth throttling or preview screens.',
    content: [
      {
        heading: 'Understanding Google Drive Download Quotas',
        body: 'When a public Google Drive file is accessed frequently by many users within 24 hours, Google temporarily disables direct downloads and displays the notorious "Quota exceeded" warning screen.'
      },
      {
        heading: 'How XulfMedia Generates Direct Streams',
        body: 'By parsing the unique file ID (`/d/{id}/view`), XulfMedia initiates an authorized bearer stream request that resolves the binary stream without forcing you to log into your Google Account or create copy shortcuts.'
      },
      {
        heading: 'Fast Cloud Acceleration',
        body: 'Direct links bypass Google preview pages entirely, giving you high-speed multi-threaded downloads.'
      }
    ]
  },
  {
    id: 'tiktok-no-watermark-guide',
    title: 'Extracting Clean TikTok Videos Without Watermarks on Any Device',
    category: 'Tips & Tricks',
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    date: 'Sep 28, 2026',
    readTime: '2 min read',
    excerpt: 'How to obtain clean, original TikTok video clips and audio tracks without the bouncing watermark overlay.',
    content: [
      {
        heading: 'Why TikTok Overlays Watermarks',
        body: 'TikTok adds floating username watermarks for branding during app exports. However, the original server upload before encoding always exists as a raw HD video stream on ByteDance content delivery servers.'
      },
      {
        heading: 'Extracting with XulfMedia',
        body: 'Paste the TikTok video link into XulfMedia. The resolver locates the unwatermarked stream URL and provides a clean MP4 file ready for editing, archival, or sharing.'
      }
    ]
  },
  {
    id: 'universal-direct-file-formats',
    title: 'Direct Link Downloading: How to Stream PDFs, ZIPs, APKs & ISOs',
    category: 'Tips & Tricks',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    date: 'Sep 24, 2026',
    readTime: '3 min read',
    excerpt: 'Everything you need to know about raw binary stream headers, MIME-types, and resuming large multi-gigabyte downloads.',
    content: [
      {
        heading: 'What is a Direct Download Link?',
        body: 'A direct link points directly to the server location of a file rather than an HTML landing page with timers or captcha walls. When your browser encounters a direct link, it immediately initiates the binary transfer.'
      },
      {
        heading: 'Resume Capability with HTTP Range Headers',
        body: 'XulfMedia passes through `Accept-Ranges: bytes` headers from origin servers. This allows modern browsers and download accelerators to resume paused or interrupted transfers without restarting from zero.'
      }
    ]
  }
];

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const articleParam = searchParams.get('article');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [copied, setCopied] = useState(false);

  const selectedArticle = useMemo(() => {
    if (!articleParam) return null;
    return ARTICLES.find(a => a.id === articleParam) || null;
  }, [articleParam]);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === 'All Articles' || article.category === activeCategory;
      const matchesSearch = !searchQuery.trim() || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleSelectArticle = (article) => {
    setSearchParams({ article: article.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full py-4 sm:py-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#FF0038] mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Downloader</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-[#6366F1] text-xs font-bold tracking-wider uppercase mb-3">
          <BookOpen size={14} />
          Knowledge Base & Tutorials
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-3">
          XulfMedia Blogs & Guides
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal">
          In-depth tutorials, technical insights, and tips for downloading media and files across the web.
        </p>

        {!selectedArticle && (
          /* Live Search Input */
          <div className="mt-8 relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides: 1080p, Instagram, Google Drive, direct links..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-sm outline-none focus:border-[#6366F1]/60 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>
        )}
      </div>

      {selectedArticle ? (
        /* Full Article Reader View */
        <article className="max-w-3xl mx-auto studio-card p-6 sm:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-8 animate-in fade-in duration-200 mb-16">
          <div>
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] mb-5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to all guides</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${selectedArticle.badgeColor}`}>
                {selectedArticle.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {selectedArticle.readTime}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {selectedArticle.date}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight mb-4">
              {selectedArticle.title}
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed italic border-l-4 border-[#FF0038] pl-4 py-2 bg-slate-50/70 rounded-r-2xl">
              {selectedArticle.excerpt}
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-[#334155] leading-relaxed border-t border-slate-100 pt-6">
            {selectedArticle.content.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">{sec.heading}</h3>
                <p className="whitespace-pre-line text-slate-600 leading-relaxed text-sm sm:text-[15px]">{sec.body}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              Try Downloader Now
            </Link>

            <button
              type="button"
              onClick={() => handleShare(selectedArticle)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
            </button>
          </div>
        </article>
      ) : (
        /* Blog Articles Grid View */
        <>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleSelectArticle(article)}
                  className="studio-card p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#6366F1]/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${article.badgeColor}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock size={12} /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-[#0F172A] group-hover:text-[#6366F1] transition-colors leading-snug mb-2.5">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 mb-6">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#6366F1]">
                    <span>Read Full Guide</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 studio-card rounded-2xl bg-white border border-[#E2E8F0]">
                <BookOpen size={36} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No articles found</p>
                <p className="text-xs text-slate-400 mt-1">Try another search keyword or switch category.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsPage;
