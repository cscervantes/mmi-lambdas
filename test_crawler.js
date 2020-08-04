const Crawler = require('./crawlers');

(async function(){
    try {
        const crawl = new Crawler
        await crawl.addActiveSitesToCrawler()
        await crawl.edit()
    } catch (error) {
        
    }
})()
