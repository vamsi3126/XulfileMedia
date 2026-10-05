import youtubedl from 'youtube-dl-exec';
import { Readable } from 'stream';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { probeDirectFile, formatBytes, extractFilename, categorizeFile } from './fileAnalyzer.js';
import { scrapeInstagram } from './instagramScraper.js';

/**
 * Analyze any given URL (Direct files, Cloud drive links, Media sites, Social media)
 */
export const analyzeMedia = async (req, res) => {
    let { url } = req.body || {};

    if (!url || typeof url !== 'string' || !url.trim()) {
        return res.status(400).json({ error: 'URL is required' });
    }

    url = url.trim();

    // Auto-prepend https:// if missing
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    try {
        // Step 1: Check if this is a direct file download or cloud storage link (Google Drive, Dropbox, direct PDF, ZIP, APK, etc.)
        const directProbe = await probeDirectFile(url);
        if (directProbe && directProbe.isDirectFile) {
            return res.json(directProbe);
        }

        const platform = directProbe.platform || 'Unknown';
        const targetUrl = directProbe.resolvedUrl || url;

        // Step 2: If Instagram, try dedicated scraper first (faster and handles photos & reels)
        if (platform === 'Instagram') {
            try {
                const instaData = await scrapeInstagram(targetUrl);
                return res.json(instaData);
            } catch (instaErr) {
                console.warn('Instagram scraper fallback to yt-dlp:', instaErr.message);
                // Fall through to yt-dlp below
            }
        }

        // Step 3: Use yt-dlp for rich media extraction (YouTube, TikTok, Facebook, Twitter, Reddit, Vimeo, etc.)
        const flags = {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true
        };

        if (platform === 'YouTube') {
            flags.youtubeSkipDashManifest = false;
        }

        let metadata;
        try {
            metadata = await youtubedl(targetUrl, flags);
        } catch (ytdlError) {
            // If yt-dlp fails, check if the direct probe found any filename from the URL as fallback
            if (directProbe.filename || directProbe.category) {
                return res.json({
                    isDirectFile: true,
                    title: directProbe.filename || 'Download File',
                    filename: directProbe.filename || 'download',
                    thumbnail: null,
                    duration: null,
                    platform: platform || 'Direct File Link',
                    category: directProbe.category || 'file',
                    filesize: null,
                    filesize_formatted: null,
                    directUrl: targetUrl,
                    formats: [
                        {
                            format_id: 'direct',
                            ext: directProbe.ext || 'bin',
                            resolution: 'Direct Download',
                            filesize: null,
                            filesize_formatted: 'Standard',
                            format_note: 'Direct Link',
                            url: targetUrl,
                            isDirect: true
                        }
                    ]
                });
            }

            console.error('Yt-dlp error:', ytdlError.message);
            return res.status(500).json({
                error: `Could not analyze link: ${ytdlError.message.split('\n')[0].replace(/^ERROR:\s*/, '')}`
            });
        }

        const rawFormats = Array.isArray(metadata.formats) ? metadata.formats : [];

        // Build list of video formats
        const videoFormats = rawFormats
            .filter(f => f.vcodec && f.vcodec !== 'none')
            .map(f => {
                const hasAudio = Boolean(f.acodec && f.acodec !== 'none');
                const resLabel = f.resolution || (f.height ? `${f.height}p` : (f.width ? `${f.width}w` : 'Video'));
                return {
                    format_id: f.format_id,
                    ext: f.ext || 'mp4',
                    resolution: resLabel,
                    height: f.height || 0,
                    width: f.width || 0,
                    filesize: f.filesize || f.filesize_approx || null,
                    filesize_formatted: formatBytes(f.filesize || f.filesize_approx),
                    format_note: f.format_note || (hasAudio ? 'Video + Audio' : 'Video'),
                    vcodec: f.vcodec,
                    acodec: f.acodec,
                    hasAudio,
                    type: 'video',
                    url: f.url
                };
            })
            // Remove duplicates with same resolution and ext, prioritizing ones with audio and known filesize
            .sort((a, b) => (b.height - a.height) || (b.filesize || 0) - (a.filesize || 0))
            .filter((item, index, self) => index === self.findIndex(t => t.resolution === item.resolution && t.ext === item.ext));

        // Build list of audio formats
        const audioFormats = rawFormats
            .filter(f => (f.vcodec === 'none' || !f.vcodec) && f.acodec && f.acodec !== 'none')
            .map(f => {
                const abr = f.abr ? `${Math.round(f.abr)} kbps` : null;
                return {
                    format_id: f.format_id,
                    ext: f.ext === 'webm' ? 'opus' : (f.ext || 'm4a'),
                    resolution: abr ? `Audio (${abr})` : 'Audio',
                    abr: f.abr || 0,
                    filesize: f.filesize || f.filesize_approx || null,
                    filesize_formatted: formatBytes(f.filesize || f.filesize_approx),
                    format_note: f.format_note || 'High Quality Audio',
                    vcodec: 'none',
                    acodec: f.acodec,
                    type: 'audio',
                    url: f.url
                };
            })
            .sort((a, b) => (b.abr - a.abr) || (b.filesize || 0) - (a.filesize || 0))
            .filter((item, index, self) => index === self.findIndex(t => t.resolution === item.resolution && t.ext === item.ext));

        // If no formats were found in yt-dlp metadata (e.g. single direct url)
        let combinedFormats = [...videoFormats, ...audioFormats];
        if (combinedFormats.length === 0 && metadata.url) {
            combinedFormats.push({
                format_id: metadata.format_id || 'default',
                ext: metadata.ext || 'mp4',
                resolution: 'Best Available',
                filesize: metadata.filesize || null,
                filesize_formatted: formatBytes(metadata.filesize),
                format_note: 'Original Quality',
                vcodec: metadata.vcodec || 'auto',
                acodec: metadata.acodec || 'auto',
                type: 'video',
                url: metadata.url
            });
        }

        res.json({
            title: metadata.title || 'Media File',
            filename: `${(metadata.title || 'media').replace(/[/\\?%*:|"<>]/g, '_')}.${metadata.ext || 'mp4'}`,
            thumbnail: metadata.thumbnail || null,
            duration: metadata.duration || null,
            platform: metadata.extractor || platform || 'Universal Media',
            category: 'video',
            filesize: metadata.filesize || null,
            filesize_formatted: formatBytes(metadata.filesize),
            formats: combinedFormats
        });

    } catch (error) {
        console.error("Analyze Error:", error);
        res.status(500).json({
            error: error.message || "Failed to analyze link. Ensure the link is public and accessible."
        });
    }
};

/**
 * Handle streaming and downloading files to the browser
 */
export const getDownloadStream = async (req, res) => {
    // Support both GET (query parameters) and POST (request body)
    const params = req.method === 'GET' ? req.query : req.body;
    const { url, format, title, directUrl, ext, filename: customFilename } = params || {};

    if (!directUrl && !url) {
        return res.status(400).json({ error: 'Download URL is required' });
    }

    try {
        let streamUrl = directUrl;

        // If directUrl is not passed, check if URL is a direct file
        if (!streamUrl && url) {
            const probe = await probeDirectFile(url);
            if (probe && probe.isDirectFile) {
                streamUrl = probe.directUrl;
            }
        }

        // Case A: We have a direct URL (Direct File, Google Drive, Dropbox, CDN link)
        if (streamUrl) {
            const fetchHeaders = {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*'
            };

            const response = await fetch(streamUrl, {
                headers: fetchHeaders,
                redirect: 'follow'
            });

            if (!response.ok && response.status !== 206) {
                return res.status(response.status || 502).json({ error: 'Failed to fetch file from source server.' });
            }

            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const contentLength = response.headers.get('content-length');
            const contentDisposition = response.headers.get('content-disposition');

            // Determine download filename
            let outName = customFilename || extractFilename(streamUrl, contentDisposition, contentType);
            if (!outName || outName === 'download') {
                const targetExt = ext || (contentType.includes('image') ? 'jpg' : (contentType.includes('audio') ? 'mp3' : 'mp4'));
                outName = `${(title || 'Download').replace(/[/\\?%*:|"<>]/g, '_')}.${targetExt}`;
            }

            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(outName)}"; filename*=UTF-8''${encodeURIComponent(outName)}`);
            res.setHeader('Content-Type', contentType);
            if (contentLength) {
                res.setHeader('Content-Length', contentLength);
            }
            res.setHeader('Accept-Ranges', 'bytes');

            const readableStream = Readable.fromWeb(response.body);
            readableStream.pipe(res);

            req.on('close', () => {
                readableStream.destroy();
            });

            return;
        }

        // Case B: Social Media / yt-dlp format stream (e.g. YouTube format)
        if (url && format) {
            const outExt = ext || (format.includes('audio') || ['140', '251', '250', '249', '139'].includes(format) ? 'm4a' : 'mp4');
            const cleanTitle = (title || 'Media-Download').replace(/[/\\?%*:|"<>]/g, '_');
            const outFilename = `${cleanTitle}.${outExt}`;

            // We download to a temporary file so we can accurately serve Content-Length and stream cleanly
            const tempPrefix = `xulf_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const tempTemplate = path.join(os.tmpdir(), `${tempPrefix}.%(ext)s`);

            try {
                await youtubedl(url, {
                    format: format,
                    output: tempTemplate,
                    noWarnings: true
                });

                // Find the downloaded file in os.tmpdir()
                const tmpDir = os.tmpdir();
                const matchedFile = fs.readdirSync(tmpDir).find(f => f.startsWith(tempPrefix) && !f.endsWith('.part'));

                if (!matchedFile) {
                    throw new Error('Downloaded file not found in temporary cache.');
                }

                const fullPath = path.join(tmpDir, matchedFile);
                const fileStat = fs.statSync(fullPath);

                res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(outFilename)}"; filename*=UTF-8''${encodeURIComponent(outFilename)}`);
                res.setHeader('Content-Type', outExt === 'm4a' || outExt === 'mp3' ? 'audio/mp4' : 'video/mp4');
                res.setHeader('Content-Length', fileStat.size);
                res.setHeader('Accept-Ranges', 'bytes');

                const fileStream = fs.createReadStream(fullPath);
                fileStream.pipe(res);

                const cleanup = () => {
                    try {
                        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
                    } catch {}
                };

                fileStream.on('end', cleanup);
                req.on('close', () => {
                    fileStream.destroy();
                    cleanup();
                });

                return;
            } catch (dlErr) {
                console.error('Yt-dlp download execution error:', dlErr.message);
                if (!res.headersSent) {
                    return res.status(500).json({ error: `Download failed: ${dlErr.message.split('\n')[0]}` });
                }
            }
        }

        res.status(400).json({ error: 'Invalid download parameters.' });

    } catch (error) {
        console.error("Download Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || "Download failed." });
        }
    }
};
