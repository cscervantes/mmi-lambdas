const Crawler = require('./crawlers');

(async function(){
    try {
        const crawl = new Crawler
        // await crawl.addActiveSitesToCrawler()
        // await crawl.crawlActiveWebsites()
        // await crawl.storeToMysql()
        await crawl.crawlArticles()
    } catch (error) {
        console.error(error)
    }
})()
