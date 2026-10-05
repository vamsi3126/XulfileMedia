// Helper to format bytes to human-readable size
export const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || isNaN(bytes) || bytes <= 0) return null;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Common direct file extensions
export const KNOWN_EXTENSIONS = new Set([
    // Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf', 'epub', 'odt', 'ods', 'odp',
    // Archives & packages
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'tgz', 'apk', 'dmg', 'pkg', 'exe', 'msi', 'deb', 'rpm', 'bin', 'jar',
    // Audio
    'mp3', 'm4a', 'wav', 'flac', 'aac', 'ogg', 'opus', 'wma', 'alac', 'aiff',
    // Video
    'mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv', '3gp', 'm4v', 'ts',
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff',
    // Code & Data
    'json', 'xml', 'sql', 'sh', 'py', 'js', 'ts', 'css'
]);

// MIME to extension map
const MIME_TO_EXT = {
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-7z-compressed': '7z',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    'application/x-gzip': 'gz',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.android.package-archive': 'apk',
    'application/x-apple-diskimage': 'dmg',
    'application/octet-stream': 'bin',
    'application/json': 'json',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/x-matroska': 'mkv',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/flac': 'flac',
    'audio/ogg': 'ogg',
    'audio/opus': 'opus',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/x-icon': 'ico',
    'text/plain': 'txt',
    'text/csv': 'csv'
};

// Categorize file by MIME or extension
export const categorizeFile = (mimeType = '', ext = '') => {
    const cleanExt = (ext || '').toLowerCase().replace(/^\./, '');
    const cleanMime = (mimeType || '').toLowerCase();

    if (cleanMime.startsWith('video/') || ['mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv', '3gp', 'm4v', 'ts'].includes(cleanExt)) {
        return 'video';
    }
    if (cleanMime.startsWith('audio/') || ['mp3', 'm4a', 'wav', 'flac', 'aac', 'ogg', 'wma', 'opus', 'alac', 'aiff'].includes(cleanExt)) {
        return 'audio';
    }
    if (cleanMime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(cleanExt)) {
        return 'image';
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf', 'epub', 'odt', 'ods', 'odp'].includes(cleanExt) ||
        cleanMime.includes('pdf') || cleanMime.includes('document') || cleanMime.includes('sheet') || cleanMime.includes('presentation')) {
        return 'document';
    }
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'tgz'].includes(cleanExt) ||
        cleanMime.includes('zip') || cleanMime.includes('compressed') || cleanMime.includes('tar')) {
        return 'archive';
    }
    if (['exe', 'msi', 'dmg', 'pkg', 'apk', 'deb', 'rpm', 'appimage', 'jar', 'bin'].includes(cleanExt)) {
        return 'software';
    }
    if (['json', 'xml', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'c', 'cpp', 'java', 'go', 'rs', 'php', 'sql', 'sh'].includes(cleanExt)) {
        return 'code';
    }
    return 'file';
};

// Extract filename from headers or URL
export const extractFilename = (url, contentDisposition = '', contentType = '') => {
    let filename = '';

    // Try RFC 5987 filename* first
    if (contentDisposition) {
        const starMatch = contentDisposition.match(/filename\*=(?:UTF-8''|utf-8'')([^;]+)/i);
        if (starMatch && starMatch[1]) {
            try {
                filename = decodeURIComponent(starMatch[1].trim());
            } catch {
                filename = starMatch[1].trim();
            }
        }

        // Try standard filename="..."
        if (!filename) {
            const standardMatch = contentDisposition.match(/filename\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s]+))/i);
            if (standardMatch) {
                filename = standardMatch[1] || standardMatch[2] || standardMatch[3] || '';
            }
        }
    }

    // Fallback: extract from URL path
    if (!filename) {
        try {
            const parsed = new URL(url);
            const pathSegments = parsed.pathname.split('/').filter(Boolean);
            const lastSegment = pathSegments.pop();
            if (lastSegment) {
                filename = decodeURIComponent(lastSegment);
            }
        } catch {}
    }

    // Clean up illegal filename chars
    filename = (filename || 'download').replace(/[/\\?%*:|"<>]/g, '_').trim();

    // Ensure extension exists if possible
    if (!filename.includes('.')) {
        const ext = MIME_TO_EXT[contentType?.split(';')[0]?.trim().toLowerCase()];
        if (ext) {
            filename += `.${ext}`;
        }
    }

    return filename;
};

// Extract extension from URL pathname
export const getUrlExtension = (url) => {
    try {
        const parsed = new URL(url);
        const pathname = parsed.pathname;
        const lastDot = pathname.lastIndexOf('.');
        if (lastDot !== -1 && lastDot < pathname.length - 1) {
            const ext = pathname.slice(lastDot + 1).toLowerCase();
            if (KNOWN_EXTENSIONS.has(ext)) {
                return ext;
            }
        }
    } catch {}
    return null;
};

// Resolve cloud sharing links (Google Drive, Dropbox, etc.)
export const resolveCloudUrl = (url) => {
    let resolvedUrl = url;
    let platform = null;

    // Google Drive
    const gDriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
    if (gDriveMatch && gDriveMatch[1]) {
        const fileId = gDriveMatch[1];
        resolvedUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
        platform = 'Google Drive';
    }

    // Dropbox
    if (url.includes('dropbox.com')) {
        try {
            const u = new URL(url);
            u.searchParams.set('dl', '1');
            resolvedUrl = u.toString();
            platform = 'Dropbox';
        } catch {}
    }

    // GitHub releases or raw files
    if (url.includes('github.com') || url.includes('raw.githubusercontent.com')) {
        platform = 'GitHub';
    }

    return { resolvedUrl, platform };
};

// Detect platform from URL
export const detectPlatform = (url) => {
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube';
    if (lower.includes('instagram.com')) return 'Instagram';
    if (lower.includes('tiktok.com')) return 'TikTok';
    if (lower.includes('facebook.com') || lower.includes('fb.watch')) return 'Facebook';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'Twitter / X';
    if (lower.includes('reddit.com')) return 'Reddit';
    if (lower.includes('pinterest.com') || lower.includes('pin.it')) return 'Pinterest';
    if (lower.includes('vimeo.com')) return 'Vimeo';
    if (lower.includes('soundcloud.com')) return 'SoundCloud';
    if (lower.includes('twitch.tv')) return 'Twitch';
    if (lower.includes('dailymotion.com')) return 'Dailymotion';
    if (lower.includes('drive.google.com')) return 'Google Drive';
    if (lower.includes('dropbox.com')) return 'Dropbox';
    if (lower.includes('github.com') || lower.includes('raw.githubusercontent.com')) return 'GitHub';
    return null;
};

// Probes any URL to see if it's a direct file download
export const probeDirectFile = async (rawUrl) => {
    const { resolvedUrl, platform: cloudPlatform } = resolveCloudUrl(rawUrl);
    const knownPlatform = cloudPlatform || detectPlatform(rawUrl);

    // If it's a known media platform like YouTube, TikTok, Reddit, Instagram, let yt-dlp handle it first
    const isMediaPlatform = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter / X', 'Reddit', 'Vimeo', 'SoundCloud', 'Twitch'].includes(knownPlatform);
    if (isMediaPlatform) {
        return { isDirectFile: false, platform: knownPlatform, resolvedUrl };
    }

    const urlExt = getUrlExtension(resolvedUrl);

    // Standard headers that don't trigger anti-bot blocking
    const headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*'
    };

    let response = null;
    let finalUrl = resolvedUrl;

    // Try HEAD request first
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const headRes = await fetch(resolvedUrl, {
            method: 'HEAD',
            headers,
            redirect: 'follow',
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (headRes.ok || headRes.status === 206) {
            response = headRes;
            finalUrl = response.url || resolvedUrl;
        }
    } catch {}

    // Fallback: try GET with Range bytes=0-1024
    if (!response) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 6000);
            const getRes = await fetch(resolvedUrl, {
                method: 'GET',
                headers: { ...headers, 'Range': 'bytes=0-1024' },
                redirect: 'follow',
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (getRes.ok || getRes.status === 206) {
                response = getRes;
                finalUrl = response.url || resolvedUrl;
            }
        } catch {}
    }

    const contentType = (response?.headers?.get('content-type') || '').toLowerCase();
    const contentDisposition = response?.headers?.get('content-disposition') || '';
    const contentLength = response?.headers?.get('content-length');

    const isHtml = contentType.includes('text/html');
    const isAttachment = contentDisposition.toLowerCase().includes('attachment');

    // If we have a known file extension in the URL, or non-HTML content-type, or attachment header:
    const isDirect = Boolean(urlExt) || (!isHtml && contentType.length > 0) || isAttachment;

    if (!isDirect) {
        return { isDirectFile: false, platform: knownPlatform, resolvedUrl };
    }

    const filename = extractFilename(finalUrl, contentDisposition, contentType);
    const ext = filename.includes('.') ? filename.split('.').pop().toLowerCase() : (urlExt || MIME_TO_EXT[contentType.split(';')[0]?.trim()] || 'file');
    const category = categorizeFile(contentType, ext);
    const sizeBytes = contentLength ? parseInt(contentLength, 10) : null;
    const isImage = category === 'image';
    const isVideo = category === 'video';
    const isAudio = category === 'audio';

    return {
        isDirectFile: true,
        title: filename,
        filename: filename,
        thumbnail: isImage ? finalUrl : null,
        duration: null,
        platform: knownPlatform || 'Direct File Link',
        category: category,
        filesize: sizeBytes,
        filesize_formatted: formatBytes(sizeBytes),
        directUrl: finalUrl,
        formats: [
            {
                format_id: 'direct',
                ext: ext,
                resolution: isVideo || isImage ? 'Original' : category.toUpperCase(),
                filesize: sizeBytes,
                filesize_formatted: formatBytes(sizeBytes),
                format_note: 'Direct High-Speed Download',
                vcodec: isVideo ? 'auto' : 'none',
                acodec: isAudio ? 'auto' : 'none',
                url: finalUrl,
                isDirect: true
            }
        ]
    };
};
