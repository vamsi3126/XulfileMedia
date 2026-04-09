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
                url: f.url // include the direct CDN url for each format
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
    const { url, format } = req.body;

    if (!url || !format) {
        return res.status(400).json({ error: 'URL and format are required' });
    }

    try {
        // Use youtube-dl-exec to extract the direct download URL
        const result = await youtubedl(url, {
            format: format,
            getUrl: true,
            noWarnings: true,
            noCheckCertificate: true,
        });

        // result is the direct CDN URL string
        const downloadUrl = typeof result === 'string' ? result.trim() : result;

        if (downloadUrl) {
            res.json({ downloadUrl });
        } else {
            res.status(500).json({ error: 'Could not extract download URL.' });
        }

    } catch (error) {
        console.error("Download URL error:", error.message);
        res.status(500).json({ error: "Failed to generate download link." });
    }
};
