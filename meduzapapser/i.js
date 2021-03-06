const fs = require('fs')
const puppeteer = require('puppeteer')

let link = 'https://meduza.io/'

const parsNews = async click => {
    try {
        let browser = await puppeteer.launch({
            headless: true,
            slowMo: 100,
            devtools: true
        })

        let page = await browser.newPage()
        await page.setViewport({
            width: 1400,
            height: 900
        })
        await page.goto(link, { waitUntil: 'domcontentloaded'});
        const selector = await page.$('div.InfoPanel-switcher');
        await selector.click()
        await page.waitForSelector('div.Chronology-wrapper')
        for (let i = 0; i < click; i++) {
            const button = await page.$('button.Button-module_root__RpsiW.Button-module_default__28Vo_.Button-module_gold__ZMYg- ')
            await button.click()

        }
        let html = await page.evaluate(async ()=> {
            let res = []
            let container = await document.querySelectorAll('div.Chronology-item')

            container.forEach(item => {
                let title = item.querySelector('div.ChronologyItem-header').innerText
                let time = item.querySelector('time.Timestamp-module_root__coOvT').innerText
                let link = item.querySelector('a.ChronologyItem-link').href
                let img
                try {
                    img = item.querySelector('div.ChronologyItem-image').getAttribute('style')
                } catch (e) {
                    img = null
                }

                res.push({
                    title,
                    time,
                    link,
                    img
                })
            })

            return res
        })

        for (let i = 0; i < html.length; i++) {
            await page.goto(html[i].link, {waitUntil: 'domcontentloaded'})
            await page.waitForSelector('div.GeneralMaterial-article').catch(e =>{ console.log(e);})
            console.log(i);
            let article = await page.evaluate(async ()=> {
                let article = null
                try {
                    article = document.querySelector('div.GeneralMaterial-article').innerText
                } catch (e) {
                    article = null
                }

                return article
            })

            html[i]['text'] = article
        }

        console.log('news length: ', html.length);

        await browser.close()
        fs.writeFile('meduza.json', JSON.stringify(html), function(err) {
            if (err) throw err

            console.log('saved meduza.json file');

        })

    } catch (e) {
        await browser.close()
        console.log(e);
    }
}

parsNews(0)
