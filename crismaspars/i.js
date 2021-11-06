const axios = require('axios')
const cheerio = require('cheerio')

axios.get('https://kakoyprazdnik.com').then(html => {
    const $ = cheerio.load(html.data)
    let text = ''
    $('#bloktxt > h4').each((i, elem) => {
        text += `${$(elem).text()}\n`

    })
    console.log(text);
})
