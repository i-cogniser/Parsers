const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio');
let link = '/?=';

const parsMuztorg = async () => {
    try {
        let arr = []
        let i = 1
        let flag = false
        while (true) {
            console.log('step - ', i);
            await axios.get(link + i)
                .then(res => res.data)
                .then(res => {
                    let html = res
                    $ = cheerio.load(html)
                    let pagination = $('li.next.disabled').html()
                    $(html).find('section.product-thumbnail').each((index, element)=> {
                        let item = {
                            price:$(element).find('p.price').text().replace(/\s+/g,''),
                            name: $(element).find('div.title').text().trim(),
                            img: $(element).find('img.img-responsive').attr('data-src')
                        }

                        arr.push(item)
                    })

                    if (pagination !== null) {
                        flag = true
                    }
                })
                .catch(err => console.log(err))


            if (flag) {
                console.log('All guitars: ',arr.length);
                fs.writeFile('muztorg.json', JSON.stringify(arr), function(err){
                    if (err) throw err
                    console.log('Saved mustorg.json file');
                })
                break
            }
            i++
        }
    } catch (e) {
        console.log('err -', e);
    }
}
parsMuztorg()
