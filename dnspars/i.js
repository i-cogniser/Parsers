const fs = require('fs')
const puppeteer = require('puppeteer')

const link = '/?p=';


(async ()=>{
    let flag = true
    let res = []
    let counter = 1
    try {
        let browser = puppeteer.launch({
            headless: false,
            slowMo: 100,
            devtools: true
        })
        let page = await (await browser).newPage()
        await page.setViewport({
            width:1440, height: 900
        })
        while (flag) {
            await page.goto(`${link}${counter}`)
            await page.waitForSelector('a.pagination-widget__page-link_next')
            console.log(counter);

            let html = await page.evaluate(async ()=> {
                let page = []
                try {
                    let divs = document.querySelectorAll('div.catalog-product')
                    divs.forEach(div=> {
                        let a = div.querySelector('a.catalog-product__name')

                        let obj = {
                            title: a !== null
                                 ? a.innerText
                                 :'HO-PRICE',
                            link: a.href,
                            price: div.querySelector('div.product-buy__price') !== null
                                 ? div.querySelector('div.product-buy__price').innerText
                                 : 'NO-LINK'
                        }
                        page.push(obj)
                    })
                } catch (error) {
                    console.log(error);
                }

                return page
            }, {waitUntil: 'a.pagination-widget__page-link_next'})

            await res.push(html)

            for(let i in res) {
                if (res[i].length === 0) flag = false
           }

            counter++
        }

      (await browser).close()

        res = res.flat()

        fs.writeFile('dns.json', JSON.stringify({ 'data': res }), err =>{
            if(err) throw err
            console.log('dns.json saved');
            console.log('dns.json saved: ', res.length);
        })

    } catch (error) {
        console.log(error);
        (await browser).close()
    }
})();
