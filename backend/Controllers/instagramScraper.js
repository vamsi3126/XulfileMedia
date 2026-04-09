import * as cheerio from 'cheerio';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
};

/**
 * Extract Instagram shortcode from URL
 */
const extractShortcode = (url) => {
    const patterns = [
        /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/stories\/[^/]+\/(\d+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

/**
 * Try to get video URL from the Instagram embed page
 */
const fetchFromEmbed = async (shortcode) => {
    try {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`;
        const response = await fetch(embedUrl, { headers: HEADERS });
        const html = await response.text();

        // Look for video URL in embed page
        const videoMatch = html.match(/"video_url":"([^"]+)"/);
        if (videoMatch) {
            return videoMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
        }

        // Look for video source in HTML
        const $ = cheerio.load(html);
        const videoSrc = $('video source').attr('src') || $('video').attr('src');
        if (videoSrc) return videoSrc;

        return null;
    } catch (err) {
        console.error('Embed fetch failed:', err.message);
        return null;
    }
};

/**
 * Try to get media from the main page meta tags
 */
const fetchFromMeta = async (url) => {
    try {
        const response = await fetch(url, { headers: HEADERS, redirect: 'follow' });
        const html = await response.text();
        const $ = cheerio.load(html);

        // Check og:video meta tag
        const ogVideo = $('meta[property="og:video"]').attr('content') ||
                         $('meta[property="og:video:url"]').attr('content');
        if (ogVideo) return { videoUrl: ogVideo, type: 'video' };

        // Check og:image for photo posts
        const ogImage = $('meta[property="og:image"]').attr('content');
        const title = $('meta[property="og:title"]').attr('content') || 'Instagram Media';

        return { imageUrl: ogImage, title, type: ogImage ? 'image' : null };
    } catch (err) {
        console.error('Meta fetch failed:', err.message);
        return {};
    }
};

/**
 * Main Instagram scraper function
 * Returns metadata object with formats array (similar to yt-dlp output)
 */
export const scrapeInstagram = async (url) => {
    const shortcode = extractShortcode(url);
    
    if (!shortcode) {
        throw new Error('Invalid Instagram URL. Please use a direct post or reel link.');
    }

    // Try embed page first (most reliable for videos)
    const embedVideoUrl = await fetchFromEmbed(shortcode);
    
    // Try meta tags as fallback
    const metaData = await fetchFromMeta(url);

    const videoUrl = embedVideoUrl || metaData.videoUrl;
    
    if (videoUrl) {
        return {
            title: metaData.title || 'Instagram Video',
            thumbnail: metaData.imageUrl || '',
            duration: null,
            platform: 'Instagram',
            formats: [{
                format_id: 'best',
                ext: 'mp4',
                resolution: 'best',
                filesize: null,
                format_note: 'Best Quality',
                vcodec: 'h264',
                acodec: 'aac',
                url: videoUrl
            }]
        };
    }

    // If only image found (photo post)
    if (metaData.imageUrl) {
        return {
            title: metaData.title || 'Instagram Photo',
            thumbnail: metaData.imageUrl,
            duration: null,
            platform: 'Instagram',
            formats: [{
                format_id: 'image',
                ext: 'jpg',
                resolution: 'original',
                filesize: null,
                format_note: 'Original',
                vcodec: 'none',
                acodec: 'none',
                url: metaData.imageUrl
            }]
        };
    }

    throw new Error('Could not extract media. The post might be private or Instagram is blocking the request.');
};
