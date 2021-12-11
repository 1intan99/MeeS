import fetch from "node-fetch";
import cheerio from "cheerio";
import gm from "gm";
import { URL } from "url";

export async function fetchContent(source: string): Promise<Buffer> {
    try {
    const response = await fetch(source);
    const header = response.headers.get('Content-Type');

    if (header?.match('text/html')) {
        const body = await response.text();

        const $ = cheerio.load(body);
        const url = new URL(
        $('meta[property="og:url"]').first().attr()['content'],
        );

        if (url.hostname.match('giphy')) {
        // redirect the link to Giphy's CDN
        url.hostname = 'i.giphy.com';
        }

        return fetchContent(url.toString());
    }

    if (header?.match('image/webp')) {
        const buffer = await response.buffer();
        gm(buffer).toBuffer('JPEG', (err, buffer) => {
            return buffer;
        })
    }
    
    return response.buffer();
    } catch (err) {
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    throw new Error('Failed to fetch contents');
    }
}