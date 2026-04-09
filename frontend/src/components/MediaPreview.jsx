import React, { useState } from 'react';
import { Download, Film, Image, ShieldCheck, Loader2 } from 'lucide-react';

const MediaPreview = ({ data, originalUrl }) => {
    // Get all formats with video (not audio-only)
    const mediaFormats = data.formats
        .filter(f => f.vcodec !== 'none' || f.ext === 'jpg' || f.ext === 'png' || f.ext === 'webp')
        .reverse()
        .filter((v, i, a) => a.findIndex(t => (t.resolution === v.resolution)) === i);

    const [downloading, setDownloading] = useState(false);

    const isImage = (f) => ['jpg', 'png', 'webp', 'jpeg'].includes(f.ext) || f.vcodec === 'none';

    const handleDownload = async (formatId, directUrl) => {
       setDownloading(true);
       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
       
       try {
         const response = await fetch(`${apiUrl}/api/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: originalUrl, 
                format: formatId, 
                directUrl: directUrl,
                title: data.title 
            })
         });

         if (response.ok) {
            const blob = await response.blob();
            const contentType = response.headers.get('content-type') || '';
            const ext = contentType.includes('image') ? '.jpg' : '.mp4';
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = (data.title || 'XulfMedia-Download').replace(/[^a-zA-Z0-9\s\-_.]/g, '') + ext;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
         } else {
            const err = await response.json().catch(() => ({}));
            alert(err.error || 'Download failed. Please try again.');
         }
       } catch(err) {
           console.error('Download error:', err);
           alert('Download failed. Please try again.');
       } finally {
           setDownloading(false);
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
                    {data.title || 'Untitled Media'}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-6 bg-green-50 px-3 py-2 rounded-lg self-start">
                    <ShieldCheck size={16} /> 
                    Ready for download
                </div>

                {downloading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-4 bg-blue-50 px-3 py-2 rounded-lg self-start">
                        <Loader2 size={16} className="animate-spin" /> 
                        Downloading... please wait
                    </div>
                )}

                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Download size={16}/> Available Downloads
                    </h4>
                    <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2">
                        {mediaFormats.map((f, i) => (
                            <button 
                                key={i}
                                disabled={downloading}
                                onClick={() => handleDownload(f.format_id, f.url)}
                                className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-primary hover:bg-sky-50 transition-colors group text-left disabled:opacity-50"
                            >
                                <div>
                                    <span className="font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-1.5">
                                        {isImage(f) ? <Image size={14} /> : <Film size={14} />}
                                        {f.resolution || 'Best'}
                                    </span>
                                    <span className="text-xs text-slate-500 mt-1 block">{f.ext} • {f.format_note || 'Standard'}</span>
                                </div>
                                <Download size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPreview;
