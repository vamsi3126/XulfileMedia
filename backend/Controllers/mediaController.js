import youtubedl from 'youtube-dl-exec';

// We use the default binary installed by the package

export const analyzeMedia = async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const metadata = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
        });

        // Parse and simplify format list
        const formats = metadata.formats
            .filter(f => f.protocol !== 'm3u8_native')
            .map(f => ({
                format_id: f.format_id,
                ext: f.ext,
                resolution: f.resolution || 'audio-only',
                filesize: f.filesize,
                format_note: f.format_note,
                vcodec: f.vcodec,
                acodec: f.acodec,
                url: f.url
            }))
            .filter(f => f.resolution !== 'audio-only' || f.acodec !== 'none');

        res.json({
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            duration: metadata.duration,
            platform: metadata.extractor,
            formats: formats
        });

    } catch (error) {
        console.error("Yt-dlp error:", error.message);
        res.status(500).json({ error: "Failed to analyze link. Ensure the link is public." });
    }
};

export const getDownloadStream = async (req, res) => {
    const { url, format, title, directUrl } = req.body;

    if (!directUrl && (!url || !format)) {
        return res.status(400).json({ error: 'Download info is required' });
    }

    try {
        // Use the direct CDN URL if provided, otherwise extract it
        let cdnUrl = directUrl;

        if (!cdnUrl) {
            const result = await youtubedl(url, {
                format: format,
                getUrl: true,
                noWarnings: true,
                noCheckCertificate: true,
            });
            cdnUrl = typeof result === 'string' ? result.trim() : result;
        }

        if (!cdnUrl) {
            return res.status(500).json({ error: 'Could not extract download URL.' });
        }

        // Proxy the download through our server with proper headers to force download
        const filename = (title || 'XulfMedia-Download').replace(/[^a-zA-Z0-9\s\-_.]/g, '') + '.mp4';

        const cdnResponse = await fetch(cdnUrl);

        if (!cdnResponse.ok) {
            return res.status(502).json({ error: 'Failed to fetch media from source.' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', cdnResponse.headers.get('content-type') || 'application/octet-stream');
        
        const contentLength = cdnResponse.headers.get('content-length');
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        // Pipe the CDN response directly to the client
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
