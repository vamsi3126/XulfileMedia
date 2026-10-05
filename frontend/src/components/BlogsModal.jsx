import React, { useState } from 'react';
import { 
  BookOpen, X, ArrowLeft, Clock, Calendar, Sparkles, 
  ChevronRight, ArrowUpRight, Share2, Check
} from 'lucide-react';

const BLOG_ARTICLES = [
  {
    id: 'youtube-1080p-guide',
    title: 'How to Download YouTube Videos in 1080p & 4K Without Software',
    category: 'Video Guides',
    badgeColor: 'bg-red-50 text-red-600 border-red-200',
    date: 'Oct 04, 2026',
    readTime: '3 min read',
    excerpt: 'Learn how direct video stream resolvers extract original high-definition MP4 streams and convert audio seamlessly without intrusive software.',
    content: [
      {
        heading: 'Why Most Downloaders Fail at 1080p',
        body: 'YouTube serves high-resolution video (1080p, 1440p, 4K) as separate video and audio streams via DASH (Dynamic Adaptive Streaming over HTTP). Older converters fail because they rely on multiplexed streams capped at 720p. Modern web engines like XulfMedia resolve and merge both streams in real time.'
      },
      {
        heading: 'Step-by-Step Guide',
        body: '1. Open YouTube on your browser or mobile app.\n2. Tap "Share" and click "Copy Link".\n3. Paste the URL into the search bar at the top of XulfMedia.\n4. Click "Fetch Download" and select 1080p MP4 or audio-only MP3 format.'
      },
      {
        heading: 'Zero Ads & Clean Browser Streaming',
        body: 'Unlike ad-heavy spam sites, XulfMedia does not require desktop client installations or browser extensions, eliminating risks of malware or unwanted browser notifications.'
      }
    ]
  },
  {
    id: 'instagram-reels-guide',
    title: 'The Ultimate Guide to Saving Instagram Reels & Stories to Gallery',
    category: 'Social Media',
    badgeColor: 'bg-pink-50 text-pink-600 border-pink-200',
    date: 'Oct 03, 2026',
    readTime: '4 min read',
    excerpt: 'Save Instagram Reels, video carousels, and stories with original audio directly to your iPhone, Android, or PC in seconds.',
    content: [
      {
        heading: 'How Instagram Media Extraction Works',
        body: 'Instagram protects media within dynamic client shells. When you paste an Instagram link into XulfMedia, our backend query engine extracts the canonical CDN source link directly from the public Graph API metadata.'
      },
      {
        heading: 'Saving Directly to Camera Roll (iPhone & Android)',
        body: 'When you tap "Fetch Download" on mobile, the raw video opens directly in your browser. Tap the native Share icon and choose "Save Video" to store it directly in your photo gallery without compression.'
      },
      {
        heading: 'Copyright & Fair Use',
        body: 'Remember to respect content creators. Downloaded reels should be kept for personal archival or used in accordance with fair-use and copyright laws.'
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
    excerpt: 'Discover how direct link engines stream large shared files from Google Drive and Dropbox without bandwidth throttling or preview screens.',
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
        heading: 'Dropbox Support',
        body: 'The same technique applies to Dropbox public links, automatically converting `dl=0` preview pages into `dl=1` raw binary streams.'
      }
    ]
  },
  {
    id: 'tiktok-no-watermark',
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
  }
];

const BlogsModal = ({ isOpen, onClose }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = (article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#' + article.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="blogs-modal"
        className="studio-card max-w-3xl w-full max-h-[88vh] rounded-3xl border border-[#E2E8F0] shadow-2xl relative bg-[#FFFFFF] flex flex-col overflow-hidden text-[#0F172A] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            {selectedArticle ? (
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 -ml-1 text-slate-500 hover:text-[#0F172A] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <ArrowLeft size={16} />
                <span>All Articles</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center shadow-xs">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0F172A]">XulfMedia Knowledge & Blogs</h3>
                  <p className="text-xs text-[#64748B]">Guides, tips, and tutorials for media & file downloading</p>
                </div>
              </div>
            )}
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {selectedArticle ? (
            /* Single Article Full View */
            <article className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${selectedArticle.badgeColor}`}>
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight mb-3">
                  {selectedArticle.title}
                </h1>
                <p className="text-sm text-[#64748B] leading-relaxed italic border-l-2 border-[#FF0038] pl-3 py-1 bg-slate-50 rounded-r-xl">
                  {selectedArticle.excerpt}
                </p>
              </div>

              <div className="space-y-5 text-sm text-[#334155] leading-relaxed">
                {selectedArticle.content.map((sec, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="text-base font-bold text-[#0F172A]">{sec.heading}</h3>
                    <p className="whitespace-pre-line text-slate-600 leading-relaxed">{sec.body}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Back to Articles
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(selectedArticle)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                  <span>{copied ? 'Link Copied' : 'Share Guide'}</span>
                </button>
              </div>
            </article>
          ) : (
            /* Articles List Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BLOG_ARTICLES.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="studio-card p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#6366F1]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${article.badgeColor}`}>
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock size={11} /> {article.readTime}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-[#0F172A] group-hover:text-[#6366F1] transition-colors leading-snug mb-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#6366F1] font-semibold">
                    <span>Read Full Guide</span>
                    <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsModal;
