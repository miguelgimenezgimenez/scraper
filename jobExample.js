const scraper = require('./jobfluentScraper')

const getJobsUrls = async (url) => {
  return scraper
    .getByClassNameAndAttr('https://www.jobfluent.com/jobs-barcelona', 'text-dark text-no-decor', 'href')
    .then((response) => {
      return response
    }) 
}
getJobsUrls().then(jobs => {
  console.log('-------------',jobs)
})
