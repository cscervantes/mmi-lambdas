const Crawler = require('./crawlers');

const functionName = process.argv[2];

(async function(){
    try {
        const crawl = new Crawler
        if(functionName === "addActiveSitesToCrawler"){
            await crawl.addActiveSitesToCrawler()
        }else if(functionName === "crawlActiveWebsites"){
            await crawl.crawlActiveWebsites()
        }else if(functionName === "crawlArticles"){
            await crawl.crawlArticles()
        }else if(functionName === "storeToMysql"){
            await crawl.storeToMysql()
        }else if(functionName === "requeueArticles"){
            await crawl.requeueArticles()
        }else{
            console.log('Function is undefined')
            process.exit()
        }
    } catch (error) {
        console.error(error)
    }
})()
