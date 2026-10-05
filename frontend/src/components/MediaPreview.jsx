import React, { useState } from 'react';
import { 
  Download, Film, Image as ImageIcon, Music, FileText, Archive, 
  Package, ShieldCheck, Loader2, Copy, Check, HardDrive
} from 'lucide-react';
import TermsModal from './TermsModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getCategoryIcon = (category = '') => {
  switch (category.toLowerCase()) {
    case 'document': return FileText;
    case 'archive': return Archive;
    case 'audio': return Music;
    case 'software': return Package;
    case 'image': return ImageIcon;
    case 'video':
    default: return Film;
  }
};

const getCategoryColor = (category = '') => {
  switch (category.toLowerCase()) {
    case 'document': return 'bg-amber-50 text-[#F59E0B] border-amber-200';
    case 'archive': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'audio': return 'bg-amber-50 text-[#F59E0B] border-amber-200';
    case 'software': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
    case 'image': return 'bg-pink-50 text-pink-600 border-pink-200';
    case 'video':
    default: return 'bg-rose-50 text-[#FF0038] border-rose-200';
  }
};

const MediaPreview = ({ data, originalUrl }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);
  const [copied, setCopied] = useState(false);

  // Terms and conditions modal state for downloads
  const [showTerms, setShowTerms] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(null);

  const formats = Array.isArray(data.formats) ? data.formats : [];
  const videoFormats = formats.filter(f => f.type === 'video' || (!f.type && f.vcodec !== 'none'));
  const audioFormats = formats.filter(f => f.type === 'audio' || (!f.type && f.vcodec === 'none' && f.acodec !== 'none'));
  const isDirectFile = data.isDirectFile || formats.some(f => f.isDirect);

  const CategoryIcon = getCategoryIcon(data.category);
  const colorClass = getCategoryColor(data.category);

  // Native browser download execution
  const executeDownload = (formatId, directUrl, ext) => {
    setDownloadingId(formatId || 'direct');

    const downloadParams = new URLSearchParams({
      url: originalUrl || '',
      format: formatId || '',
      directUrl: directUrl || data.directUrl || '',
      title: data.title || '',
      ext: ext || ''
    });

    const downloadEndpoint = `${API_BASE}/api/download?${downloadParams.toString()}`;

    // Invisible link trigger for native browser download
    const link = document.createElement('a');
    link.href = downloadEndpoint;
    link.setAttribute('download', data.filename || data.title || 'download');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  // Intercept download: ask for terms and conditions acceptance
  const handleDownloadClick = (formatId, directUrl, ext) => {
    const hasAccepted = localStorage.getItem('xulfmedia_terms_accepted') === 'true';

    if (hasAccepted) {
      executeDownload(formatId, directUrl, ext);
    } else {
      setPendingDownload({ formatId, directUrl, ext });
      setShowTerms(true);
    }
  };

  const handleTermsAccepted = () => {
    setShowTerms(false);
    if (pendingDownload) {
      executeDownload(pendingDownload.formatId, pendingDownload.directUrl, pendingDownload.ext);
      setPendingDownload(null);
    }
  };

  const handleCopyLink = () => {
    const direct = data.directUrl || formats[0]?.url || originalUrl;
    if (direct) {
      navigator.clipboard.writeText(direct);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div id="media-preview-container" className="studio-card rounded-3xl overflow-hidden flex flex-col md:flex-row border border-[#E2E8F0] shadow-xl bg-[#FFFFFF]">
        {/* Visual / Thumbnail section */}
        <div className="w-full md:w-5/12 bg-slate-50 flex flex-col items-center justify-center relative min-h-[260px] md:min-h-[360px] overflow-hidden border-b md:border-b-0 md:border-r border-[#E2E8F0]">
          {data.thumbnail ? (
            <div className="w-full h-full relative group">
              <img 
                src={data.thumbnail} 
                alt={data.title} 
                className="w-full h-full object-cover min-h-[260px] md:min-h-[360px] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/10" />
            </div>
          ) : (
            <div className={`w-28 h-28 rounded-3xl ${colorClass} border flex flex-col items-center justify-center p-4 shadow-sm`}>
              <CategoryIcon size={46} />
              <span className="text-[11px] font-bold uppercase tracking-wider mt-2">
                {data.category || 'File'}
              </span>
            </div>
          )}

          {/* Platform Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#0F172A] border border-[#E2E8F0] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <HardDrive size={12} className="text-[#FF0038]" />
            <span>{data.platform || 'Direct File'}</span>
          </div>

          {/* Duration badge if video */}
          {data.duration && (
            <div className="absolute bottom-4 right-4 bg-[#0F172A]/90 backdrop-blur-sm text-white text-xs font-mono font-medium px-2.5 py-1 rounded-md shadow-sm">
              {Math.floor(data.duration / 60)}:{('0' + (data.duration % 60)).slice(-2)}
            </div>
          )}

          {/* File size badge if direct */}
          {data.filesize_formatted && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-[#0F172A] text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-sm">
              {data.filesize_formatted}
            </div>
          )}
        </div>

        {/* Details & Download Options */}
        <div className="p-6 sm:p-8 w-full md:w-7/12 flex flex-col justify-between">
          <div>
            {/* Header Title */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug line-clamp-2" title={data.title}>
                {data.title || 'Ready for Download'}
              </h3>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <ShieldCheck size={14} className="text-emerald-600" /> 
                <span>Verified & Ready</span>
              </div>

              {data.filesize_formatted && (
                <span className="text-xs text-[#64748B] font-medium bg-slate-100 border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
                  Size: <strong className="text-[#0F172A]">{data.filesize_formatted}</strong>
                </span>
              )}

              <button
                id="copy-link-btn"
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#FF0038] bg-slate-50 hover:bg-rose-50/50 border border-[#E2E8F0] hover:border-rose-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ml-auto font-medium"
                title="Copy direct file URL"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Direct File Download Hero Card */}
            {isDirectFile && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50/40 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#FF0038] text-white shadow-xs">
                    <CategoryIcon size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">Direct High-Speed Download</div>
                    <div className="text-xs text-[#64748B]">
                      {data.filename || data.title} {data.filesize_formatted ? `• ${data.filesize_formatted}` : ''}
                    </div>
                  </div>
                </div>

                <button
                  id="direct-download-btn"
                  type="button"
                  disabled={downloadingId !== null}
                  onClick={() => handleDownloadClick('direct', data.directUrl || formats[0]?.url, data.formats[0]?.ext)}
                  className="w-full sm:w-auto btn-primary font-semibold py-2.5 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  {downloadingId === 'direct' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <Download size={15} />
                      <span>Download File</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Format Tabs (if video has both audio & video) */}
            {videoFormats.length > 0 && audioFormats.length > 0 && (
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'all' ? 'bg-rose-50 text-[#FF0038] border border-rose-200' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  All Formats ({formats.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'video' ? 'bg-rose-50 text-[#FF0038] border border-rose-200' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Video ({videoFormats.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'audio' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Audio Only ({audioFormats.length})
                </button>
              </div>
            )}

            {/* Format List Grid */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {formats
                .filter(f => {
                  if (activeTab === 'video') return f.type === 'video' || f.vcodec !== 'none';
                  if (activeTab === 'audio') return f.type === 'audio' || (f.vcodec === 'none' && f.acodec !== 'none');
                  return true;
                })
                .map((f, i) => {
                  const isAudio = f.type === 'audio' || (f.vcodec === 'none' && f.acodec !== 'none');
                  const isImage = f.ext === 'jpg' || f.ext === 'png' || f.ext === 'webp';
                  const isDownloading = downloadingId === f.format_id;

                  return (
                    <div 
                      key={f.format_id || i}
                      className="rounded-xl p-3 flex items-center justify-between gap-3 border border-[#E2E8F0] bg-[#FFFFFF] hover:border-blue-300 hover:bg-slate-50/50 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-100 text-[#2563EB] shrink-0">
                          {isAudio ? <Music size={16} /> : (isImage ? <ImageIcon size={16} /> : <Film size={16} />)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#0F172A] text-sm truncate flex items-center gap-2">
                            <span>{f.resolution || 'Standard Quality'}</span>
                            <span className="text-[10px] font-mono uppercase bg-slate-100 text-[#64748B] px-1.5 py-0.5 rounded border border-[#E2E8F0] font-semibold">
                              {f.ext}
                            </span>
                          </div>
                          <div className="text-xs text-[#64748B] mt-0.5 truncate">
                            {f.filesize_formatted ? `${f.filesize_formatted} • ` : ''}
                            {f.format_note || (isAudio ? 'Audio Stream' : 'Video')}
                          </div>
                        </div>
                      </div>

                      <button 
                        id={`download-format-${i}`}
                        type="button"
                        disabled={downloadingId !== null}
                        onClick={() => handleDownloadClick(f.format_id, f.url, f.ext)}
                        className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Starting...</span>
                          </>
                        ) : (
                          <>
                            <Download size={13} />
                            <span>Get {f.ext.toUpperCase()}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Footer Terms & Info Notice */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between">
            <span className="flex items-center gap-1">
              By downloading you agree to our 
              <button 
                type="button" 
                onClick={() => setShowTerms(true)}
                className="text-[#2563EB] hover:text-[#1D4ED8] underline font-medium cursor-pointer"
              >
                Terms & Conditions
              </button>
            </span>
            <span className="text-[#64748B] font-mono font-medium">Format: {formats[0]?.ext?.toUpperCase() || 'FILE'}</span>
          </div>
        </div>
      </div>

      {/* Confirmation & Terms Modal */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => {
          setShowTerms(false);
          setPendingDownload(null);
        }}
        onAccept={handleTermsAccepted}
      />
    </>
  );
};

export default MediaPreview;
