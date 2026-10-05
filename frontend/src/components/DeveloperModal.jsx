import React from 'react';
import { User, Globe, Sparkles, X, Code2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const DeveloperModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="developer-modal"
        className="studio-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl relative text-[#0F172A] animate-in zoom-in-95 duration-150 bg-[#FFFFFF]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-[#FF0038] flex items-center justify-center shadow-xs">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#0F172A]">Developer & Projects</h3>
              <p className="text-xs text-[#64748B]">Creator profile and connected web services</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links Grid */}
        <div className="space-y-4">
          {/* Card 1: Developer Portfolio */}
          <a
            id="portfolio-external-link"
            href="https://portfolio-new-drab-pi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-2xl bg-slate-50/70 border border-[#E2E8F0] hover:border-[#FF0038]/50 hover:bg-rose-50/20 transition-all duration-200 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white border border-rose-100 text-[#FF0038] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <User size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#0F172A] text-base group-hover:text-[#FF0038] transition-colors">
                      Developer Portfolio
                    </h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-50 text-[#FF0038] border border-rose-200 font-semibold">
                      Creator
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] group-hover:text-white group-hover:bg-[#FF0038] group-hover:border-[#FF0038] transition-all shrink-0 shadow-2xs">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <p className="text-xs text-[#64748B] mt-3 pt-3 border-t border-[#E2E8F0]">
              Explore developer journey, tech stack, experience, and full portfolio of software projects.
            </p>
          </a>

          {/* Card 2: XulfFileMedia Live Web App */}
          <a
            id="xulfilemedia-external-link"
            href="https://xulf-file-media.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-2xl bg-slate-50/70 border border-[#E2E8F0] hover:border-[#7C3AED]/50 hover:bg-purple-50/20 transition-all duration-200 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white border border-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  <Globe size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#0F172A] text-base group-hover:text-[#7C3AED] transition-colors">
                      XulfFileMedia Live App
                    </h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 font-semibold">
                      Cloud
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] group-hover:text-white group-hover:bg-[#7C3AED] group-hover:border-[#7C3AED] transition-all shrink-0 shadow-2xs">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <p className="text-xs text-[#64748B] mt-3 pt-3 border-t border-[#E2E8F0]">
              Official cloud deployment of XulfFileMedia. Fast, reliable, and universal downloads from anywhere.
            </p>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5 font-medium text-[#0F172A]">
            <Sparkles size={14} className="text-[#06B6D4]" />
            Designed & Built by Vamsi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperModal;
