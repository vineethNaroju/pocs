const rp = require('request-promise');
const cheerio = require('cheerio');

(async () => {
    try {

        let res = await rp.get('http://localhost:3421/somequery');

        let $ = cheerio.load(res);

        console.log($('main'));





















    } catch(e) {
        console.trace(e);
    }
})();