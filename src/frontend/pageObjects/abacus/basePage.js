import { fail } from 'k6'

export class BasePage {
  constructor(page, metrics) {
    this.page = page
    this.url = null
    this.frontendFailures = metrics.frontendFailures
  }
  async waitForElements(expectedElements) {
    if (Array.isArray(expectedElements)) await this.verifyPageLoad(expectedElements)
    else await this.verifyPageLoad([expectedElements])
  }
  async goTo() {
    await this.page.goto(this.url, { waitUntil: 'load' })
  }

  async waitForLoader() {
    await this.page.waitForFunction(
      () => !document.querySelector('.SkeletonLoader'),
      { timeout: 20000 } // Waits up to 20 seconds
    )
  }
  async waitForLoaderToExist() {
    await this.page.waitForSelector('.SkeletonLoader', { state: 'visible' })
  }
  async verifyPageLoad(expectedElements) {
    try {
      for (const selector of expectedElements) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout: 20000 })
      }
    } catch (error) {
      await this.page.screenshot({ path: `screenshots/failed-page-${Date.now()}.png` })
      this.frontendFailures.add(1)
      fail(`Browser failed to load page: ${error}`)
    }
    const isSnagPresent = await this.page.evaluate(() => {
      return document.body.innerText.includes('snag')
    })
    if (isSnagPresent) {
      await this.page.screenshot({ path: `screenshots/failed-page-${Date.now()}.png` })
      this.frontendFailures.add(1)
      fail('The word "snag" should not be present on the page but was found.')
    }
  }
}
