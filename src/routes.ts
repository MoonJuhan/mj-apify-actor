import { createPlaywrightRouter, Dataset } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['https://apify.com/*'],
        label: 'detail',
    });
});

router.addHandler('detail', async ({ request, page, log }) => {
    log.info(`Crawling ${request.url}`);
    const title = await page.title();
    const html = await page.content();

    await Dataset.pushData({
        url: request.loadedUrl,
        title,
        html,
    });
});
