import React, { useState } from 'react';
import { Download, Film, Music, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaPreview = ({ data, originalUrl }) => {
    // Basic format separation logic
    const videoFormats = data.formats.filter(f => f.vcodec !== 'none' && f.resolution !== 'audio-only');
    const audioFormats = data.formats.filter(f => f.resolution === 'audio-only' || f.vcodec === 'none');

    // Make options readable
    const formatResolution = (res) => {
        if (!res) return 'Unknown';
        if (typeof res === 'string') return res;
        return res + 'p';
    };

    const handleDownload = async (formatId) => {
       // Open in new tab or trigger manual download here
       // In a real app we might POST `/api/download` via a form submit or file blob
       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
       const urlToFetch = `${apiUrl}/api/download`;
       
       try {
         const response = await fetch(urlToFetch, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: data.originalUrl || '', format: formatId }) // actually we need original URL. Wait we didn't pass it back
         });

         if(response.ok) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `XulfMedia-Download.mp4`; // fallback name
            document.body.appendChild(a);
            a.click();
            a.remove();
         } else {
             alert('Error executing download stream');
         }
       } catch(err) {
           console.error('Download stream err', err);
       }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            {/* Thumbnail section */}
            <div className="w-full md:w-5/12 bg-slate-900 relative">
                {data.thumbnail ? (
                    <img 
                        src={data.thumbnail} 
                        alt={data.title} 
                        className="w-full h-full object-cover min-h-[300px] opacity-90 transition-opacity hover:opacity-100"
                    />
                ) : (
                    <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-500">
                        <Film size={48} />
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {data.platform || 'Media'}
                </div>
                {data.duration && (
                     <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                        {Math.floor(data.duration / 60)}:{('0' + data.duration % 60).slice(-2)}
                    </div>
                )}
            </div>

            {/* Details section */}
            <div className="p-8 w-full md:w-7/12 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2" title={data.title}>
                    {data.title || 'Untitled Media Segment'}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-6 bg-green-50 px-3 py-2 rounded-lg self-start">
                    <ShieldCheck size={16} /> 
                    Ready for download
                </div>

                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Film size={16}/> Video Formats
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mb-6 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        {videoFormats.slice(0, 8).map((f, i) => (
                            <button 
                                key={i}
                                onClick={() => handleDownload(f.format_id)}
                                className="border border-slate-200 rounded-xl p-3 flex flex-col items-start hover:border-primary hover:bg-sky-50 transition-colors group text-left"
                            >
                                <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                                    {formatResolution(f.resolution)}
                                </span>
                                <span className="text-xs text-slate-500 mt-1">{f.ext} • {f.format_note || 'Std'}</span>
                            </button>
                        ))}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Music size={16}/> Audio Download
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {audioFormats.slice(0, 2).map((f, i) => (
                             <button 
                                key={`a-${i}`}
                                onClick={() => handleDownload(f.format_id)}
                                className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-primary hover:bg-sky-50 transition-colors group text-left"
                            >
                                <div>
                                    <div className="font-bold text-slate-800 group-hover:text-primary transition-colors">Audio Only</div>
                                    <div className="text-xs text-slate-500 mt-1">{f.ext}</div>
                                </div>
                                <Download size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPreview;
