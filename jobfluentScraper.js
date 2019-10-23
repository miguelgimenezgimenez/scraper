const webdriver = require('selenium-webdriver')

const { By } = webdriver

class JobFluentScraper {
  constructor (config) {
    this.driver = new webdriver.Builder()
      .forBrowser('chrome')
      .usingServer('http://localhost:4444/wd/hub')
      .build()
  }

  goodReadsScrapeByCss (url, element, attr) {
    return new Promise((resolve) => {
      this.driver.get(url)
      this.driver.findElements(By.className(element)).then((els) => {
        const promises = webdriver.promise.map(els, pEl => {
          return pEl.getAttribute(attr).then(inner => {
            console.log(inner, '-')
            return inner
          })
        })
        Promise.all(promises).then(resolve)
      })
    })
  }

  __quit () {
    return this.driver.quit()
  }
}
const scraper = new JobFluentScraper()

module.exports = scraper
