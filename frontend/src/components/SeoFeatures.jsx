import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How do I download a YouTube video or Instagram Reel?',
    a: 'Simply copy the video URL from YouTube or Instagram, paste it into the search box at the top of XulfMedia, and click "Fetch Download". Choose your preferred format and save the file directly.'
  },
  {
    q: 'Is this YouTube and Instagram video downloader completely free?',
    a: 'Yes, XulfMedia is 100% free with no registration, subscription, or software installation needed. There are no limits on the number of downloads.'
  },
  {
    q: 'Can I download files directly from Google Drive share links?',
    a: 'Yes! Paste any public Google Drive sharing link, and XulfMedia will resolve the direct file stream so you can download large files at full bandwidth without Google preview screens.'
  },
  {
    q: 'Does it support downloading TikTok videos without a watermark?',
    a: 'Yes, our media extraction engine fetches original clean video streams from TikTok posts without watermark overlays.'
  },
  {
    q: 'What direct file formats can I download with a link?',
    a: 'You can download virtually any direct file including PDF documents, ZIP and RAR archives, Android APKs, ISO disk images, software installers, and raw audio/video files.'
  }
];

const SeoFeatures = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="w-full mt-12 pt-8 border-t border-[#E2E8F0]/80">
      {/* How It Works - 3 Easy Steps */}
      <div className="studio-card p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs mb-14 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">How to Download Any File or Video in 3 Steps</h3>
        <p className="text-xs sm:text-sm text-[#64748B] mb-8 max-w-xl mx-auto">
          Fast, effortless extraction directly in your browser without extensions or third-party software.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#FF0038] font-bold text-sm flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-[#0F172A] mb-1">Copy the URL</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Copy the direct link of the YouTube video, Instagram Reel, TikTok post, Google Drive file, or direct document.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#FF0038] font-bold text-sm flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-[#0F172A] mb-1">Paste into XulfMedia</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Paste the link into the search bar at the top of this page or click the convenient "Paste" button.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#FF0038] font-bold text-sm flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-[#0F172A] mb-1">Fetch & Download</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Click "Fetch Download", inspect video qualities or file sizes, and download straight to your computer or phone.
            </p>
          </div>
        </div>
      </div>

      {/* SEO FAQ Accordion */}
      <div id="faq-section" className="max-w-3xl mx-auto mb-10 scroll-mt-24">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#0F172A]">Frequently Asked Questions</h3>
          <p className="text-xs text-[#64748B] mt-1">Everything you need to know about downloading files and media online.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="studio-card rounded-2xl border border-[#E2E8F0] overflow-hidden bg-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#0F172A] hover:text-[#FF0038] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FF0038]' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-[13px] text-[#64748B] leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/faqs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-[#FF0038] border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Explore all 18+ categorized FAQs</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SeoFeatures;
