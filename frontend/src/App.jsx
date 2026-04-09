import React, { useState } from 'react';
import { DownloadCloud, Info } from 'lucide-react';
import Hero from './components/Hero';
import MediaPreview from './components/MediaPreview';

function App() {
  const [mediaData, setMediaData] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError(null);
    setMediaData(null);
    setInputUrl(url);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch media data');
      }
      
      setMediaData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="px-8 py-6 w-full flex justify-between items-center max-w-7xl mx-auto border-b border-slate-200">
        <div className="flex items-center gap-2">
          <DownloadCloud className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">XulfMedia</h1>
        </div>
        <nav>
          <a href="#" className="font-medium text-slate-600 hover:text-primary transition-colors">Supported Platforms</a>
        </nav>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
        <Hero onAnalyze={handleAnalyze} isLoading={loading} />
        
        {error && (
            <div className="mt-8 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 w-full max-w-2xl border border-red-200">
                <Info size={20} />
                <p>{error}</p>
            </div>
        )}

        {mediaData && (
          <div className="mt-12 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MediaPreview data={mediaData} originalUrl={inputUrl} />
          </div>
        )}
      </main>

      <footer className="w-full text-center py-6 text-slate-500 text-sm">
        <p>© 2026 XulfMedia (XulfileMedia.com). All rights reserved.</p>
        <p className="mt-1 opacity-70">Use this tool only for content you own or have permission to download.</p>
      </footer>
    </div>
  );
}

export default App;
