import youtubedl from 'youtube-dl-exec';
import { spawn } from 'child_process';

// We use the default binary installed by the package instead of assuming it's in PATH

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
        // Get the path to the bundled yt-dlp binary from youtube-dl-exec
        const ytdlpPath = youtubedl.getBinaryPath ? youtubedl.getBinaryPath() : 'yt-dlp';

        res.header('Content-Disposition', `attachment; filename="XulfMedia-Download.mp4"`);
        res.header('Content-Type', 'application/octet-stream');

        const ytdlp = spawn(ytdlpPath, [
            '-f', format,
            '-o', '-',
            '--no-warnings',
            '--no-check-certificate',
            url
        ]);

        ytdlp.stdout.pipe(res);

        ytdlp.stderr.on('data', (data) => {
            console.log(`yt-dlp stderr: ${data}`);
        });

        ytdlp.on('error', (err) => {
            console.error('Spawn error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Download failed to start.' });
            }
        });

        ytdlp.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp exited with code ${code}`);
            }
        });

        req.on('close', () => {
             ytdlp.kill();
        });

    } catch (error) {
        console.error("Download Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Download failed." });
        }
    }
};
