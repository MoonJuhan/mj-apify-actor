import { Dataset, createPlaywrightRouter } from 'crawlee'

export const router = createPlaywrightRouter()

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  const targetUrl = process.env.APIFY_TARGET_URL
  log.info(`enqueueing new URLs: ${targetUrl}`)

  await enqueueLinks({
    globs: [targetUrl as string],
    label: 'detail',
  })
})

router.addHandler('detail', async ({ request, page, log }) => {
  const title = await page.title()
  const html = await page.content()
  log.info(`${title}`, { url: request.loadedUrl })

  await Dataset.pushData({
    url: request.loadedUrl,
    title,
    html,
  })
})
