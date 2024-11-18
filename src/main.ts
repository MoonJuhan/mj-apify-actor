import { Actor } from 'apify'
import { Dataset, PlaywrightCrawler } from 'crawlee'

await Actor.init()
const proxyConfiguration = await Actor.createProxyConfiguration()

const targetUrl = process.env.APIFY_TARGET_URL
const targetUrls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((id) => `${targetUrl}?category_id=${id}` as string)

const crawler = new PlaywrightCrawler({
  proxyConfiguration,
  maxRequestsPerCrawl: 100,
  async requestHandler({ page, request, log }) {
    log.info(`Crawling ${request.url}`)
    const title = await page.title()
    const html = await page.content()

    await Dataset.pushData({
      url: request.loadedUrl,
      title,
      html,
    })
  },
  failedRequestHandler({ request, error }) {
    console.log(`Request ${request.url} failed: ${(error as Error)?.message}`)
  },
})

await crawler.run(targetUrls)
await Actor.exit()
