import React, { useState } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAccept, isStandaloneView = false }) => {
  const [agreed, setAgreed] = useState(true);
  const [remember, setRemember] = useState(true);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (remember) {
      try {
        localStorage.setItem('xulfmedia_terms_accepted', 'true');
      } catch {}
    }
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="terms-conditions-modal"
        className="studio-card max-w-sm w-full rounded-3xl p-6 border border-[#E2E8F0] shadow-2xl relative text-[#0F172A] animate-in zoom-in-95 duration-150 bg-[#FFFFFF]"
      >
        {/* Close Button */}
        <button 
          type="button" 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Studio Content */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-[#FF0038] flex items-center justify-center mb-3">
            <ShieldCheck size={26} />
          </div>
          <h3 className="font-bold text-lg text-[#0F172A]">Terms & Conditions</h3>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            Please confirm that you have permission to download this content for personal, non-commercial use.
          </p>
        </div>

        {/* Checkbox & Actions */}
        {!isStandaloneView ? (
          <div className="space-y-4">
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] cursor-pointer select-none">
              <input
                id="accept-terms-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#FF0038] focus:ring-[#FF0038] cursor-pointer"
              />
              <span className="text-xs text-[#0F172A] font-medium">
                I agree to the <strong className="text-[#FF0038]">Terms of Service</strong>
              </span>
            </label>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200/80 border border-[#E2E8F0] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-accept-download-btn"
                type="button"
                disabled={!agreed}
                onClick={handleConfirm}
                className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <Check size={14} />
                <span>Accept & Download</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-[#64748B] space-y-2 text-left bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0] leading-relaxed">
              <p>• <strong>Personal Use:</strong> All media downloads are restricted to personal, educational, and backup usage.</p>
              <p>• <strong>Ownership & Rights:</strong> You confirm that you own the content or have authorization from the copyright holder.</p>
              <p>• <strong>Neutral Tool:</strong> XulfMedia is a client-side stream utility and does not host copyrighted media.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsModal;
