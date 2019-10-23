const FbScrape = require('./fbScraper.js')

const fbScrape = new FbScrape({
    id: "100004269196300",
    username: 'trouble_mike@hotmail.com',
    password: 'cwTesting'
})

fbScrape.getData().then((data)=>{
    console.log(data,'data')
})