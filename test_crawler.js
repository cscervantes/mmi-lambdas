const Crawler = require('./crawlers');

(async function(){
    try {
        const crawl = new Crawler
        // await crawl.addActiveSitesToCrawler()
        // await crawl.crawlActiveWebsites()
        // await crawl.storeToMysql()
        // await crawl.crawlArticles()
        await crawl.requeueArticles()
    } catch (error) {
        console.error(error)
    }
})()
