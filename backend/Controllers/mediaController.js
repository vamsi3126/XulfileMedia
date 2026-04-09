import { create } from 'youtube-dl-exec';
import { spawn } from 'child_process';

// youtube-dl-exec wrapper configured to use yt-dlp by default
const youtubedl = create('yt-dlp');

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
            .filter(f => f.protocol !== 'm3u8_native') // exclude some weird streams
            .map(f => ({
                format_id: f.format_id,
                ext: f.ext,
                resolution: f.resolution || 'audio-only',
                filesize: f.filesize,
                format_note: f.format_note,
                vcodec: f.vcodec,
                acodec: f.acodec
            }))
            .filter(f => f.resolution !== 'audio-only' || f.acodec !== 'none'); // Ensure either valid video or audio

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
        return res.status(400).json({ error: 'URL and formatID are required' });
    }

    try {
        res.header('Content-Disposition', `attachment; filename="XulfMedia-Download.mp4"`);
        // Basic pass-through stream from yt-dlp to browser
        const ytdlp = spawn('yt-dlp', [
            '-f', format,
            '-o', '-', // output to stdout
            '--no-warnings',
            url
        ]);

        ytdlp.stdout.pipe(res);

        ytdlp.stderr.on('data', (data) => {
            console.log(`yt-dlp stderr: ${data}`);
        });

        req.on('close', () => {
             ytdlp.kill(); // clean up if user aborts
        });

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ error: "Download failed." });
    }
};
