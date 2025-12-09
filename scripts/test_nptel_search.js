import * as cheerio from 'cheerio';

async function testNptelSearch(query) {
    const url = `https://nptel.ac.in/courses?search=${encodeURIComponent(query)}`;
    console.log(`Testing URL: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        console.log("Page Title:", $('title').text());

        // Log first few titles and links
        $('a').each((i, el) => {
            if (i > 10) return;
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            if (href && href.includes('courses')) {
                console.log(`- Text: ${text}, Link: ${href}`);
            }
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

testNptelSearch('python');
