const Crawler = require('./crawlers');

(async function(){
    try {
        const crawl = new Crawler
        // await crawl.addActiveSitesToCrawler()
        await crawl.crawlActiveWebsites()
    } catch (error) {
        console.error(error)
    }
})()
