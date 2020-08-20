const Crawler = require('./crawlers');

(async function(){
    try {
        const crawl = new Crawler
        // await crawl.addActiveSitesToCrawler()
        // await crawl.crawlActiveWebsites()
        // await crawl.storeToMysql()
        // await crawl.crawlArticles()
        // await crawl.requeueArticles()
        await crawl.parseArticle({
            article_url: "https://tass.com/world/1189075"
        })
    } catch (error) {
        console.error(error)
    }
})()
