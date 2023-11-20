export default class TRNScraper {
  /**
   * @param {import("puppeteer").Page} page
   */
  constructor(page) {
    this.page = page;
    this.base = 'https://api.tracker.gg/api/v1/bfv';
  }

  async get(relativeURL) {
    const url = this.base + relativeURL;
    await this.page.goto(url);
    return this.page.evaluate(() => JSON.parse(document.querySelector('body').innerText));
  }
}
