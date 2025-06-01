import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

import { router } from './routes.js';

await Actor.init();

const getTargetUrl = (id: number) => `${process.env.APIFY_TARGET_URL}?category_id=${id}` as string;

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    maxRequestsPerCrawl: 100,
    requestHandler: router,
    launchContext: {
        launchOptions: {
            args: [
                '--disable-gpu', // Mitigates the "crashing GPU process" issue in Docker containers
            ],
        },
    },
    failedRequestHandler: ({ request, error }) => {
        console.log(`Request ${request.url} failed: ${(error as Error)?.message}`);
    },
});

await crawler.run([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => getTargetUrl(index)));

await Actor.exit();
