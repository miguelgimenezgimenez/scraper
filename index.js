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
                // this.__getAbout();

                // this.__getMusic();

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
        return this.driver.findElement(By.css('a[data-tab-key="about"]')).getAttribute("href").then((href) => {
            console.log(href)
            const url = URL.parse(href);
            this.__fbName = url.pathname.replace("about", '').replace(/\//g, '');
        });
    }

    __getAbout() {
        if (!this.__fbName) throw "name is null";

        this.driver.get(`https://www.facebook.com/${this.__fbName}/about`);

        this.driver.findElement(By.css('[data-overviewsection="places"] > div > div > div a')).getText().then((el) => {
            this.__location = el.trim();
        });
        this.driver.findElements(By.css('[data-overviewsection="contact_basic"] li')).then((els) => {
            els.forEach((el) => {
                webdriver.promise.fulfilled(el)
                    .then((pElem) => {
                        return pElem.getText();
                    })
                    .then((text) => {
                        const data = text.split("\n");
                        if (data[0] == "Birthday" && moment(data[1], 'MMM DD, YYYY').isValid()) {
                            this.__birthday = moment(data[1], 'DD MMM YYYY').format('DD-MM-YYYY')
                        }
                    })
            })
        });

        this.driver.get(`https://www.facebook.com/${this.__fbName}/about?section=contact-info&pnref=about`);
        this.driver.findElements(By.css('#pagelet_basic ul li > div')).then((els) => {
            els.forEach((el) => {
                webdriver.promise.fulfilled(el)
                    .then((pElem) => {
                        return pElem.findElement(By.css('div:nth-child(1)')).getText().then((text) => {
                            if (text == 'Gender') {
                                return pElem.findElement(By.css('div:nth-child(2)')).getText().then((val) => {
                                    this.__gender = val;
                                })
                            }
                        })
                    })
            })
        });
    }

    __getMusic() {
        if (!this.__fbName) throw "name is null";

        this.driver.get(`https://www.facebook.com/${this.__fbName}/music`);
        this.driver.findElements(By.css("[id*='collection_wrapper_'] [data-collection-item] a[href*='profile']")).then((els) => {
            if (els.length) {
                this.__music = [];
            }
            els.forEach((el, index) => {
                webdriver.promise.fulfilled(el)
                    .then((pElem) => {
                        return pElem.getText().then((text) => {
                            this.__music.push(text)
                        })
                    })
            });
        });
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