import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
          Fast & Secure Downloads
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Universal <span className="text-primary italic">Media</span> Downloader
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Paste a link from YouTube, Instagram, or Facebook below. We'll automatically fetch the highest quality video and audio formats available.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit}
        className="w-full relative shadow-xl rounded-2xl overflow-hidden glass-panel flex flex-col sm:flex-row focus-within:ring-4 ring-primary/20 transition-all"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex-1 flex items-center px-4 bg-white">
          <Search className="text-slate-400 w-6 h-6 shrink-0" />
          <input 
            type="url" 
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your link here..." 
            className="w-full px-4 py-5 outline-none text-slate-700 bg-transparent text-lg"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-sky-600 text-white font-semibold py-5 px-10 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <>
                <Loader2 className="animate-spin w-5 h-5" />
                Analyzing...
            </>
          ) : (
            'Start Check'
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default Hero;
