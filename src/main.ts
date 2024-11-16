import { Actor } from 'apify'
import { Dataset, PlaywrightCrawler } from 'crawlee'

interface Input {
  startUrls: string[]
  maxRequestsPerCrawl: number
}

// Initialize the Apify SDK
await Actor.init()

const targetUrl = process.env.APIFY_TARGET_URL

// Structure of input is defined in input_schema.json
const { startUrls = [targetUrl as string], maxRequestsPerCrawl = 100 } =
  (await Actor.getInput<Input>()) ?? ({} as Input)

const proxyConfiguration = await Actor.createProxyConfiguration()

const crawler = new PlaywrightCrawler({
  proxyConfiguration,
  maxRequestsPerCrawl,
  async requestHandler({ page, request, log }) {
    log.info(`Crawling ${request.url}`)

    const title = await page.title()
    const html = await page.content()
    log.info(`${title}`, { url: request.loadedUrl })

    await Dataset.pushData({
      url: request.loadedUrl,
      title,
      html,
    })
  },
  // 오류 처리기
  failedRequestHandler({ request, error }) {
    console.log(`Request ${request.url} failed: ${error?.message}`)
  },
})

await crawler.run(startUrls)

// Exit successfully
await Actor.exit()
