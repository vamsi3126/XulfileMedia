import youtubedl from 'youtube-dl-exec';
import { scrapeInstagram } from './instagramScraper.js';

// Detect platform from URL
const detectPlatform = (url) => {
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    return 'unknown';
};

export const analyzeMedia = async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const platform = detectPlatform(url);

    try {
        // Use dedicated Instagram scraper (no auth needed for public content)
        if (platform === 'instagram') {
            const data = await scrapeInstagram(url);
            return res.json(data);
        }

        // For YouTube and Facebook, use yt-dlp
        const flags = {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
        };

        if (platform === 'youtube') {
            flags.youtubeSkipDashManifest = true;
        }

        const metadata = await youtubedl(url, flags);

        const formats = metadata.formats
            .filter(f => f.protocol !== 'm3u8_native')
            .filter(f => f.vcodec !== 'none' || ['jpg', 'png', 'webp'].includes(f.ext)) // only video or image, no audio-only
            .map(f => ({
                format_id: f.format_id,
                ext: f.ext,
                resolution: f.resolution || 'original',
                filesize: f.filesize,
                format_note: f.format_note,
                vcodec: f.vcodec,
                acodec: f.acodec,
                url: f.url
            }));

        res.json({
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            duration: metadata.duration,
            platform: metadata.extractor || platform,
            formats: formats
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message || "Failed to analyze link. Ensure the link is public." });
    }
};

export const getDownloadStream = async (req, res) => {
    const { url, format, title, directUrl } = req.body;

    if (!directUrl && (!url || !format)) {
        return res.status(400).json({ error: 'Download info is required' });
    }

    try {
        let cdnUrl = directUrl;

        if (!cdnUrl) {
            const platform = detectPlatform(url);

            if (platform === 'instagram') {
                const data = await scrapeInstagram(url);
                cdnUrl = data.formats[0]?.url;
            } else {
                const result = await youtubedl(url, {
                    format: format,
                    getUrl: true,
                    noWarnings: true,
                    noCheckCertificate: true,
                });
                cdnUrl = typeof result === 'string' ? result.trim() : result;
            }
        }

        if (!cdnUrl) {
            return res.status(500).json({ error: 'Could not extract download URL.' });
        }

        const filename = (title || 'XulfMedia-Download').replace(/[^a-zA-Z0-9\s\-_.]/g, '') + '.mp4';

        const cdnResponse = await fetch(cdnUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!cdnResponse.ok) {
            return res.status(502).json({ error: 'Failed to fetch media from source.' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', cdnResponse.headers.get('content-type') || 'application/octet-stream');
        
        const contentLength = cdnResponse.headers.get('content-length');
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        const reader = cdnResponse.body.getReader();
        
        const pump = async () => {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    res.end();
                    break;
                }
                if (!res.write(value)) {
                    await new Promise(resolve => res.once('drain', resolve));
                }
            }
        };

        req.on('close', () => {
            reader.cancel();
        });

        await pump();

    } catch (error) {
        console.error("Download Error:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: "Download failed." });
        }
    }
};
