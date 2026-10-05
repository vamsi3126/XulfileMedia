import * as cheerio from 'cheerio';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none'
};

/**
 * Extract Instagram shortcode from URL
 */
export const extractShortcode = (url) => {
    const patterns = [
        /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i,
        /instagram\.com\/stories\/[^/]+\/(\d+)/i
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

/**
 * Unescape Unicode and JSON characters in extracted URLs
 */
const cleanUrl = (url) => {
    if (!url) return null;
    return url
        .replace(/\\u0026/g, '&')
        .replace(/\\u0025/g, '%')
        .replace(/\\\//g, '/')
        .replace(/&amp;/g, '&')
        .trim();
};

/**
 * Try to extract media from the Instagram embed endpoint
 */
const fetchFromEmbed = async (shortcode) => {
    try {
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
        const response = await fetch(embedUrl, { headers: HEADERS });
        if (!response.ok) return null;

        const html = await response.text();

        // 1. Check video_url in page JavaScript/JSON
        const videoMatch = html.match(/"video_url"\s*:\s*"([^"]+)"/);
        if (videoMatch) {
            return { videoUrl: cleanUrl(videoMatch[1]), type: 'video' };
        }

        // 2. Check JSON-LD
        const $ = cheerio.load(html);
        const jsonLd = $('script[type="application/ld+json"]').html();
        if (jsonLd) {
            try {
                const parsed = JSON.parse(jsonLd);
                if (parsed.video && parsed.video[0]?.contentUrl) {
                    return { videoUrl: parsed.video[0].contentUrl, type: 'video' };
                }
                if (parsed.contentUrl) {
                    return { videoUrl: parsed.contentUrl, type: 'video' };
                }
            } catch {}
        }

        // 3. Check HTML video tag
        const videoSrc = $('video source').attr('src') || $('video').attr('src');
        if (videoSrc) return { videoUrl: videoSrc, type: 'video' };

        // 4. Check display_url for image
        const imgMatch = html.match(/"display_url"\s*:\s*"([^"]+)"/);
        if (imgMatch) {
            return { imageUrl: cleanUrl(imgMatch[1]), type: 'image' };
        }

        const imgSrc = $('img.EmbeddedMediaImage').attr('src') || $('img').attr('src');
        if (imgSrc) return { imageUrl: imgSrc, type: 'image' };

        return null;
    } catch (err) {
        console.warn('Instagram embed fetch failed:', err.message);
        return null;
    }
};

/**
 * Try to get media from the main post meta tags
 */
const fetchFromMeta = async (url) => {
    try {
        const response = await fetch(url, { headers: HEADERS, redirect: 'follow' });
        if (!response.ok) return {};

        const html = await response.text();
        const $ = cheerio.load(html);

        // Check meta tags
        const ogVideo = $('meta[property="og:video"]').attr('content') ||
                         $('meta[property="og:video:url"]').attr('content') ||
                         $('meta[property="og:video:secure_url"]').attr('content');

        const ogImage = $('meta[property="og:image"]').attr('content');
        const title = $('meta[property="og:title"]').attr('content') ||
                      $('title').text().replace(/• Instagram.*$/i, '').trim() ||
                      'Instagram Media';

        if (ogVideo) return { videoUrl: cleanUrl(ogVideo), title, type: 'video', imageUrl: ogImage };
        if (ogImage) return { imageUrl: cleanUrl(ogImage), title, type: 'image' };

        return { title };
    } catch (err) {
        console.warn('Instagram meta fetch failed:', err.message);
        return {};
    }
};

/**
 * Main Instagram scraper
 */
export const scrapeInstagram = async (url) => {
    const shortcode = extractShortcode(url);
    if (!shortcode) {
        throw new Error('Invalid Instagram URL. Please use a direct post or reel link.');
    }

    // Try embed page first
    const embedData = await fetchFromEmbed(shortcode);
    const metaData = await fetchFromMeta(url);

    const videoUrl = embedData?.videoUrl || metaData.videoUrl;
    const imageUrl = embedData?.imageUrl || metaData.imageUrl;
    const title = metaData.title || (videoUrl ? 'Instagram Video' : 'Instagram Photo');

    if (videoUrl) {
        return {
            title: title,
            filename: `Instagram_${shortcode}.mp4`,
            thumbnail: imageUrl || '',
            duration: null,
            platform: 'Instagram',
            category: 'video',
            directUrl: videoUrl,
            formats: [{
                format_id: 'best',
                ext: 'mp4',
                resolution: 'High Definition',
                filesize: null,
                filesize_formatted: 'Original',
                format_note: 'Best Quality MP4',
                vcodec: 'h264',
                acodec: 'aac',
                url: videoUrl,
                isDirect: true
            }]
        };
    }

    if (imageUrl) {
        return {
            title: title,
            filename: `Instagram_${shortcode}.jpg`,
            thumbnail: imageUrl,
            duration: null,
            platform: 'Instagram',
            category: 'image',
            directUrl: imageUrl,
            formats: [{
                format_id: 'image',
                ext: 'jpg',
                resolution: 'Original Photo',
                filesize: null,
                filesize_formatted: 'Original',
                format_note: 'High-Res Photo',
                vcodec: 'none',
                acodec: 'none',
                url: imageUrl,
                isDirect: true
            }]
        };
    }

    throw new Error('Instagram requires login or has restricted access for this post. Make sure the post is public.');
};
