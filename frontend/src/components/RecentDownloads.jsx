import React from 'react';
import { History, Trash2, ArrowUpRight, FileText, Film, Music, Archive, Package, Image as ImageIcon } from 'lucide-react';

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

const RecentDownloads = ({ history = [], onSelect, onClear }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
          <History size={15} className="text-[#FF0038]" />
          <span>Recent Activity ({history.length})</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[#64748B] hover:text-[#FF0038] transition-colors flex items-center gap-1 cursor-pointer"
          title="Clear recent history"
        >
          <Trash2 size={13} />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {history.slice(0, 6).map((item, index) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div
              key={index}
              onClick={() => onSelect(item.originalUrl || item.directUrl)}
              className="studio-card p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group hover:border-[#FF0038]/50 bg-[#FFFFFF] border-[#E2E8F0]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-[#FF0038] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#FF0038] transition-colors" title={item.title}>
                    {item.title || 'Downloaded File'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
                    <span className="font-medium text-[#0F172A]/80">{item.platform || 'File'}</span>
                    {item.filesize_formatted && (
                      <>
                        <span>•</span>
                        <span>{item.filesize_formatted}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-1.5 rounded-lg text-[#64748B] group-hover:text-[#FF0038] group-hover:bg-rose-50 transition-colors shrink-0">
                <ArrowUpRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentDownloads;
