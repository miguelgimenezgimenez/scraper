const webdriver = require('selenium-webdriver'),
    moment = require('moment'),
    URL = require('url'),
    fs = require('fs');

const
    By = webdriver.By,
    until = webdriver.until;

class FbScraper {
    constructor(config) {
        this.driver = new webdriver.Builder()
            .forBrowser('chrome')
            .usingServer('http://localhost:4444/wd/hub')
            .build();
        this.config = config;
        this.__fbName = null;
        this.__birthday = null;
        this.__gender = null;
        this.__music = null;
        this.__location = null;
    }

    getData() {
        return new Promise((resolve) => {
            this.__openAccount()
            .then(() => {
                console.log('-------------')
               

                this.__quit().then(() => {
                    resolve({
                        id: this.config.id,
                        name: this.__fbName,
                        birthday: this.__birthday,
                        gender: this.__gender,
                        location: this.__location,
                        music: this.__music
                    })
                });
            })
        })
    }

    __openAccount() {
        this.driver.get(`https://www.facebook.com/`);
        this.driver.findElement(By.name('email')).sendKeys(this.config.username);
        this.driver.findElement(By.name('pass')).sendKeys(this.config.password);
        this.driver.findElement(By.css("#loginbutton")).click();

        this.driver.get(`https://www.facebook.com/${this.config.id}`);
        return this.driver.findElements(By.className('_44wv _1-l4'))
        .then((items)=>{
            webdriver.promise.map(items, (item)=>{
               item.getAttribute('innerHTML').then(inner=>{
                   console.log(inner)
               })
            })
        })
        // .getAttribute("innerHTML").then((items) => {
        //     console.log(items)
        //     // const url = URL.parse(href);
        //     // this.__fbName = url.pathname.replace("about", '').replace(/\//g, '');
        // });
    }


    __saveScreenshot() {
        return this.driver.takeScreenshot().then((data) => {
            fs.writeFile(this.config.id, data.replace(/^data:image\/png;base64,/, ''), 'base64', (err) => {
                if (err) throw err;
            });
        })
    }

    __quit() {
        return this.driver.quit()
    }
}


/**/

module.exports = FbScraper;