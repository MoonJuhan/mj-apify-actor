import { createPlaywrightRouter, Dataset } from 'crawlee';

export const router = createPlaywrightRouter();

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
