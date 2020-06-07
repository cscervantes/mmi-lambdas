const fetch = require('./fetch')

const async = require('async')

const lambda_enpoint = "http://localhost:3030/lambda-api/"
const source_enpoint = "http://localhost:4040/mmi-endpoints/v0/"

const event = {}
event.url = null
event.headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.f2X7W_6J8g6y-jKto1fMj5zq7QkOLu9WBGw5b-sHAIc"
}

const crawlSectionFunc = async () => {
    try {
        let countQ = await fetch(source_enpoint+"queue/count", "GET", event.headers)
        // event.url = source_enpoint+"queue?limit=10"
        event.url = source_enpoint+"queue?limit="+countQ
        let result = await fetch(event.url, "GET", event.headers)
        let sectionIds = result.data.map(v=>{
            return {
                qid: v._id,
                url:source_enpoint+"section/"+v.section,
                headers: event.headers
            }
        })
        let sectionWebsites = await Promise.allSettled(sectionIds.map(async(v)=> await fetch(v.url, "GET", v.headers)))
        let websites = sectionWebsites.map(v=>v.value.data)
        
        let taskQ = async.queue(function (task, callback) {
            let ms = Math.floor(Math.random() * 1000) + 5000
            console.log('Processing',task.name.section_url, ms)
            let website = task.name.website._id
            let section = task.name._id
            let article_source_url = task.name.website.fqdn
            console.log('Size', taskQ.length())
            console.log()
            let opts = {
                url: lambda_enpoint+"website/test_filters",
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: {
                    url: task.name.section_url,
                    request_source: task.name.website.request_source,
                    website_url: task.name.website.website_url,
                    needs_search_params: task.name.website.needs_search_params,
                    needs_https: task.name.website.needs_https,
                    needs_endslash: task.name.website.needs_endslash,
                    section_filters: task.name.website.section_filter,
                    article_filters: task.name.website.article_filter
                }
            }
            fetch(opts.url, opts.method, opts.headers, opts.body)
            .then(v=>{
                setTimeout(async () => {
                    console.log('Total article for', v.url, v.articles.length)
                    let bodyOpts = v.articles.map(article=>{
                        return {
                            url: source_enpoint+"article/count",
                            method: "POST",
                            headers: event.headers,
                            body: {
                                article_url: article,
                                // article_status: "Done"
                            }
                        }
                    })
                    let mapArticles = await Promise.allSettled(bodyOpts.map(async (u)=> {
                        // check if article exists
                        let r = await fetch(u.url, u.method, u.headers, u.body)
                        if(r.data.result > 0){
                            console.log('Existing url', r.data.article_url)
                        }else{
                            let article_url = r.data.article_url
                            let article_status = "Queued"
                            let date_created = new Date()
                            let date_updated = new Date()
                            let articleOpts = {
                                url: source_enpoint+"article",
                                method: "POST",
                                headers: event.headers,
                                body: {
                                    website, section, article_source_url,
                                    article_url, article_status, date_created,
                                    date_updated
                                }
                            }
                            // store article
                            let s = await fetch(articleOpts.url, articleOpts.method, articleOpts.headers, articleOpts.body)
                            // console.log(s)
                        }
                    }))
                    callback()
                }, ms);
            }).catch(e=>{
                console.log(e)
                setTimeout(callback, ms);
            })
            
        }, 10)
        taskQ.drain = function (){
            console.log('Done.')
        }
        websites.forEach(element => {
            taskQ.push({name:element}, function(err){
                if(err){
                    console.log(err)
                }
            })
        });


    } catch (error) {
        console.log(error)
    }
}

crawlSectionFunc()