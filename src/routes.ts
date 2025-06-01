import { createPlaywrightRouter, Dataset } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ request, log }) => {
    log.info(`Default handler: ${request.url}`);
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
