# mmi-lambdas
lambdas

- Setup
    * clone repo    
    * cd repo
    * npm install

- Production Setup
    * clone repo
    * sudo chown -R $USER:$(id -gn $USER) repo
    * npm install

- Requirements
    * linux server
    * node v12 or higher
    * npm v6 or higher
    * pm2 system process management (https://pm2.keymetrics.io/docs/usage/quick-start/)

- Scripts
    * tasks/addSection.js (This will run new added website's sections to import to queue collections for scraping.)
        - run "WEBSITE_TYPE=LOCAL_NEWS STATUS=ACTIVE node tasks/addSection" (cron this every 2hours for now, it will change later when websites are growing.)
    * tasks/crawlSection.js (This will obviously crawl the sections that have been saved in queue collections.)
        - run "node tasks/crawlSection" (cron this every 2 hours)
    * tasks/crawlArticle.js (This will scrape queue articles from article collections.)
        - run "node tasks/crawlArticle" (cron this every 2hours)
    * tasks/insertRaw.js (This will sync data from mongodb article collections to mysql media_web_raw)
        - run "node tasks/insertRraw" (cron this every 3 minutes)

- PM2 Startup
    *  PRODUCTION=true pm2 start lambda-server/serve.js --name lambda-server -i 4(number of cluster)