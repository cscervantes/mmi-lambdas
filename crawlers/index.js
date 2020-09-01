require('dotenv').config()

const _ = require('lodash')
const async = require('async')
const request = require('request').defaults({json:true})
const $string = require('string')
const $moment = require('moment')
const $franc = require('franc')

const lambda_enpoint = (JSON.parse(process.env.PRODUCTION)) ? process.env.PRODUCTION_LAMBDA_ENDPOINT : process.env.DEVELOPMENT_LAMBDA_ENDPOINT
console.log('Lamba URL', lambda_enpoint)
const source_enpoint = (JSON.parse(process.env.PRODUCTION)) ? process.env.PRODUCTION_SOURCE_ENDPOINT : process.env.DEVELOPMENT_SOURCE_ENDPOINT
console.log('Source URL', source_enpoint)

const headers = {
    "Authorization": "Bearer "+process.env.BEARER_TOKEN
}

const { url_helper, html_helper, article_url, media_value_helper, transaction_helper } = require('../mmi_modules')

const status = process.env.STATUS || "ACTIVE"
const website_type = process.env.WEBSITE_TYPE || "LOCAL_NEWS"
const duration = process.env.DURATION || '1week'
const page_offset = process.env.PAGE_OFFSET || 0
const page_size = process.env.PAGE_SIZE || 100

class Crawler {

    async addActiveSitesToCrawler(){
        let func = this.addActiveSitesToCrawler.name
        try {
            console.log("###################################")
            console.log('Calling function', func)           
            console.log('Status', status)
            console.log('Type', website_type)
            console.log('Duration', duration)
            console.log("###################################")
            let url = source_enpoint+`crawl/last_modified_active_websites?status=${status}&website_type=${website_type}&duration=${duration}&skip=${page_offset}&limit=${page_size}`
            let result = await fetch(url, "GET", headers)
            let embedded = result.data.map(v=>{
                let websites = []
                v.main_sections.forEach(element => {
                    let website = v._id
                    let section_url = element
                    websites.push({
                        website, section_url
                    })
                })
                return websites
            })
            // console.log(embedded)
            let sections = _.flattenDeep(embedded)
            // console.log(sections, sections.length)

            let tasks = async.queue(function(task, callback){
                setTimeout(() => {
                    fetch(source_enpoint+'section', 'POST', headers, task)
                    .then(response=>{
                        console.log(response)
                        callback()
                    })
                    .catch(error=>{
                        console.error(error)
                        callback()
                    })
                    
                }, 200);
            }, 100)

            sections.forEach(element=>{
                tasks.push(element)
            })
            tasks.error(function(err, task) {
                console.log(task.section_url, err)
            })
            tasks.drain(function(){
                console.log('Done.')
            })
        } catch (error) {
            throw Error(error)
        }
    }

    async crawlActiveWebsites(){
        let func = this.crawlActiveWebsites.name
        try {
            console.log("###################################")
            console.log('Calling function', func)           
            console.log('Status', status)
            console.log('Type', website_type)
            console.log('Offset', page_offset)
            console.log('Size', page_size)
            console.log("###################################")
            let fields = {
                "_id":1,
                "fqdn":1,
                "website_url":1,
                "request_source":1,
                "needs_search_params":1,
                "needs_https":1,
                "needs_endslash":1,
                "section_filter":1,
                "article_filter":1,
                "main_sections":1
            }
            // console.log(page_offset, page_size)
            let url = source_enpoint+`crawl/crawl_active_websites?status=${status}&website_type=${website_type}&fields=${JSON.stringify(fields)}&skip=${page_offset}&limit=${page_size}`
            let result = await fetch(url, 'GET', headers)
            let data = result.data
            let mapData = data.map(v=>{
                let websites = []
                v.embedded_sections.forEach(element => {
                    let website = v._id
                    let section_url = element.section_url
                    let section = element._id
                    let fqdn = v.fqdn
                    let request_source = v.request_source
                    let website_url = v.website_url
                    let needs_search_params = v.needs_search_params
                    let needs_https = v.needs_https
                    let needs_endslash = v.needs_endslash
                    let section_filter = v.section_filter
                    let article_filter = v.article_filter
                    websites.push({
                        website,
                        section_url,
                        section,
                        fqdn,
                        website_url,
                        request_source,
                        needs_search_params,
                        needs_https,
                        needs_endslash,
                        section_filter,
                        article_filter
                    })
                });
                return websites
            })
            let flatData = _.shuffle(_.flattenDeep(mapData))

            // console.log(flatData.length)

            // console.log(flatData)

            let tasks = async.queue( (task, done) => {
                
                setTimeout( async function(){
                    // console.log(task)
                    const _req_url = task.section_url

                    const request_source = task.request_source

                    const home_url = task.website_url

                    const includeSearch = task.needs_search_params
                    
                    const startHttps = task.needs_https

                    const endSlash = task.needs_endslash

                    const section_filters = task.section_filter

                    const article_filters = task.article_filter
                    
                    const _uri = new url_helper(_req_url, request_source, includeSearch, startHttps, endSlash)

                    const _uri_response = await _uri.MAKE_REQUEST()

                    // const url = await _uri.FORMATTED_URL()

                    const _htm = new html_helper(_uri_response, home_url, includeSearch, startHttps, endSlash, section_filters, article_filters)

                    const articles = await _htm.ARTICLE_LINKS()

                    // console.log(articles)
                    await processArticle(task.website, task.section, task.fqdn, articles)
                    done()
                },500);
            }, 10)
            flatData.forEach(function(element){
                tasks.push(element)
            })
            tasks.error(function(err, task) {
                console.log(task.section_url, err)
            })
            tasks.drain(function(){
                console.log('Done.')
            })
        } catch (error) {
            throw Error(error)
        }
    }

    async crawlArticles(){
        let func = this.crawlArticles.name
        try {
            console.log("###################################")
            console.log('Calling function', func)
            console.log("###################################")   
            let article_source_from = "NodeJS Static Scraper"
            let countQueued = await fetch(source_enpoint+'article/count', 'POST', headers, {article_status: "Queued"})
            let queuedArticles = await fetch(source_enpoint+`article?article_status=Queued&article_source_from=${article_source_from}&limit=${countQueued.data.result}`, 'GET', headers) 
            let mapArticles = _.shuffle(queuedArticles.data)

            console.log('Total Queued',mapArticles.length)

            let tasks = async.queue(function(task, callback){
                let time = Math.floor((Math.random() * 5000) + 750)
                setTimeout( async () => {
                    try {
                        console.log(`${time}ms Parsing`,task.article_url)

                        fetch(source_enpoint+'article/'+task._id, 'PUT', headers,{
                            article_status: "Processing",
                            date_updated: new Date()
                        }).then( async response => {
                            console.log(response)
                            let body = {}
            
                            const request_source = task.website.request_source

                            const home_url = task.website.website_url

                            const includeSearch = task.website.needs_search_params
                            
                            const startHttps = task.website.needs_https

                            const endSlash = task.website.needs_endslash

                            const selectors = task.website.selectors

                            const code = task.website.code_snippet

                            const is_using_selectors = JSON.parse(task.website.is_using_selectors)

                            const is_using_snippets = JSON.parse(task.website.is_using_snippets)

                            const website_cost = task.website.website_cost

                            const global_rank = task.website.alexa_rankings.global

                            const local_rank = task.website.alexa_rankings.local

                            const _uri = new url_helper(task.article_url, request_source, includeSearch, startHttps, endSlash)

                            const _uri_response = await _uri.MAKE_REQUEST()

                            const url = await _uri.FORMATTED_URL()

                            const _htm = new html_helper(_uri_response, home_url, includeSearch, startHttps, endSlash)

                            const _raw_html = await _htm.HTML()

                            if(is_using_selectors){

                                const _article = new article_helper(_raw_html, selectors)
                
                                const title = await _article.ARTICLE_TITLE()
                
                                const date = await _article.ARTICLE_PUBLISH()
                
                                const author = await _article.ARTICLE_AUTHOR()
                
                                const section = await _article.ARTICLE_SECTION()
                
                                // const html = await _article.ARTICLE_HTML()
                
                                const text = await _article.ARTICLE_TEXT()
                
                                const image = await _article.ARTICLE_IMAGE()
                
                                const video = await _article.ARTICLE_VIDEO()
                
                                const values = await media_value_helper(global_rank, local_rank, website_cost, text, image, video)
                
                                const advalue = values.advalue
                
                                const prvalue = values.prvalue
                
                                body.article_url = url
                
                                body.article_title = title
                
                                body.article_authors = author
                
                                body.article_publish_date = date
                
                                body.article_sections = section
                
                                body.article_content = text
                
                                body.article_images = image
                
                                body.article_videos = video
                
                                body.article_ad_value = advalue
                
                                body.article_pr_value = prvalue
                
                                body.article_status = 'Done'
                
                                body.article_language = $franc(text)

                                body.date_updated = new Date()
                
                            }else if(is_using_snippets){
                
                                const Snippet = module.exports = Function(code)()
                
                                const _article = new Snippet(_raw_html, $string, $moment, url)
                
                                const title = await _article.ARTICLE_TITLE()
                
                                const date = await _article.ARTICLE_PUBLISH()
                
                                const author = await _article.ARTICLE_AUTHOR()
                
                                const section = await _article.ARTICLE_SECTION()
                
                                // const html = await _article.ARTICLE_HTML()
                
                                const text = await _article.ARTICLE_TEXT()
                
                                const image = await _article.ARTICLE_IMAGE()
                
                                const video = await _article.ARTICLE_VIDEO()
                
                                const values = await media_value_helper(global_rank, local_rank, website_cost, text, image, video)
                                
                                const advalue = values.advalue
                
                                const prvalue = values.prvalue
                
                                body.article_url = url
                
                                body.article_title = title
                
                                body.article_authors = author
                
                                body.article_publish_date = date
                
                                body.article_sections = section
                
                                body.article_content = text
                
                                body.article_images = image
                
                                body.article_videos = video
                
                                body.article_ad_value = advalue
                
                                body.article_pr_value = prvalue
                
                                body.article_status = 'Done'
                
                                body.article_language = $franc(text)

                                body.date_updated = new Date()
                
                            }else{

                                body.article_status = "Error"

                                body.article_error_status = 'Selectors and Snippets are not configured!'

                                body.date_updated = new Date()
                            }

                            fetch(source_enpoint+'article/'+task._id, 'PUT', headers, body)
                            .then(r=>{

                                console.log(r)

                                callback()

                            })
                            .catch(e=>{

                                console.error(e)

                                callback()

                            })

                        }).catch(error=>{

                            console.error(error)

                            callback()

                        })   

                    } catch (error) {
                        console.log('Error parsing', task.article_url)
                        await fetch(source_enpoint+'article/'+task._id, 'PUT', headers,{
                            article_status: "Error",
                            date_updated: new Date(),
                            article_error_status: error
                        })
                        console.error(error)
                        callback()
                    }
                    
                }, time);
            }, 10)

            mapArticles.forEach(element=>{
                tasks.push(element)
            })

            tasks.error(function(err, task) {
                console.log(task.article_url, err)
            })
            tasks.drain(function(){
                console.log('Done.')
            })
        } catch (error) {
            throw Error(error)
        }
    }

    async storeToMysql(){
        let func = this.storeToMysql.name
        try {
            console.log("###################################")
            console.log('Calling function', func)
            console.log("###################################")
            // let article_source_from = "NodeJS Static Scraper"
            // let result = await fetch(source_enpoint+`article?is_in_mysql=false&article_status=Done&article_source_from=${article_source_from}&limit=1000`, 'GET', headers)
            let result = await fetch(source_enpoint+`article?is_in_mysql=false&article_status=Done&limit=1000`, 'GET', headers)
            console.log(result.data.length)
            Promise.allSettled(result.data.map(async v => {
                let countMedia = await fetch(source_enpoint+'media/count', 'POST', headers, {mwe_full_url: v.article_url})
                if(countMedia[0].total > 0){
                    // upate article collection
                    await fetch(source_enpoint+'article/'+v._id,"PUT",headers,{"is_in_mysql": true})
                }else{
                    // inser to media_web_raw
                    let insert_raw = await fetch(source_enpoint+'media/insert_raw', 'POST', headers, {
                        mwe_src_url: v.article_source_url,
                        mwe_src_aut_full_name: (v.article_authors.length > 0 ) ? JSON.stringify(Object.assign({}, v.article_authors)) : JSON.stringify({"0":"No - Author"}),
                        mwe_src_aut_first_name: '',
                        mwe_src_aut_last_name: '',
                        mwe_src_med_type: 'Web',
                        mwe_full_url: v.article_url,
                        mwe_content: v.article_content,
                        mwe_title: v.article_title,
                        mwe_section: v.article_sections.join(', '),
                        mwe_val: v.article_ad_value,
                        mwe_mod_val: v.article_pr_value,
                        mwe_date: v.article_publish_date,
                        mwe_datetime: v.article_publish_date,
                        mwe_img_vid_url: JSON.stringify({
                            img: v.article_images,
                            vid: v.article_videos
                        }),
                        mwe_pub_name: v.website.website_name,
                        mwe_pub_cc: v.website.country_code,
                        mwe_lang: v.article_language || 'en'
                    })

                    if(insert_raw.affectedRows > 0){
                        await fetch(source_enpoint+'article/'+v._id,"PUT",headers,{"is_in_mysql": true})
                    }
                }
            }))
        } catch (error) {
            throw Error(error)
        }
    }

    async requeueArticles(){
        let func = this.requeueArticles.name
        try {
            console.log("###################################")
            console.log('Calling function', func)
            console.log("###################################")   
            let countProcessing = await fetch(source_enpoint+'article/count', 'POST', headers, {article_status: "Processing"})
            let processingArticles = await fetch(source_enpoint+"article?article_status=Processing&limit="+countProcessing.data.result, 'GET', headers) 
            let mapArticles = _.shuffle(processingArticles.data)
            console.log('Total Processing',mapArticles.length)

            let tasks = async.queue(function(task, callback){
                let timeout = 200
                setTimeout(() => {
                    if(task.article_url && task.article_content){
                        fetch(source_enpoint+'article/'+task._id, 'PUT', headers, {
                            article_status: "Done",
                            is_in_mysql: false,
                            date_updated: new Date()
                        }).then(response=>{
                            console.log(response)
                            callback()
                        }).catch(error=>{
                            console.error(error)
                            callback()
                        })
                    }else{
                        fetch(source_enpoint+'article/'+task._id, 'PUT', headers, {
                            article_status: "Queued",
                            date_updated: new Date()
                        }).then(response=>{
                            console.log(response)
                            callback()
                        }).catch(error=>{
                            console.error(error)
                            callback()
                        })
                    }
                    
                }, timeout);
            }, 10)

            mapArticles.forEach(element=>{
                tasks.push(element)
            })

            tasks.error(function(err, task) {
                console.log(task.article_url, err)
            })

            tasks.drain(function(){
                console.log('Done.')
            })

        } catch (error) {
            throw Error(error)
        }
    }

    async parseArticle(context){
        let func = this.parseArticle.name
        try {
            let body = {}
            console.log('Calling function', func)
            // console.log(context)
            if(context.hasOwnProperty('_id')){
                
                console.log('Coming from system', context.article_url)

                const request_source = context.website.request_source

                const home_url = context.website.website_url

                const includeSearch = context.website.needs_search_params
                
                const startHttps = context.website.needs_https

                const endSlash = context.website.needs_endslash

                const selectors = context.website.selectors

                const code = context.website.code_snippet

                const is_using_selectors = JSON.parse(context.website.is_using_selectors)

                const is_using_snippets = JSON.parse(context.website.is_using_snippets)

                const website_cost = context.website.website_cost

                const global_rank = context.website.alexa_rankings.global

                const local_rank = context.website.alexa_rankings.local

                const _uri = new url_helper(context.article_url, request_source, includeSearch, startHttps, endSlash)

                const _uri_response = await _uri.MAKE_REQUEST()

                const url = await _uri.FORMATTED_URL()

                const _htm = new html_helper(_uri_response, home_url, includeSearch, startHttps, endSlash)

                const _raw_html = await _htm.HTML()

                if(is_using_selectors){

                    const _article = new article_helper(_raw_html, selectors)
    
                    const title = await _article.ARTICLE_TITLE()
    
                    const date = await _article.ARTICLE_PUBLISH()
    
                    const author = await _article.ARTICLE_AUTHOR()
    
                    const section = await _article.ARTICLE_SECTION()
    
                    // const html = await _article.ARTICLE_HTML()
    
                    const text = await _article.ARTICLE_TEXT()
    
                    const image = await _article.ARTICLE_IMAGE()
    
                    const video = await _article.ARTICLE_VIDEO()
    
                    const values = await media_value_helper(global_rank, local_rank, website_cost, text, image, video)
    
                    const advalue = values.advalue
    
                    const prvalue = values.prvalue
    
                    body.article_url = url
    
                    body.article_title = title
    
                    body.article_authors = author
    
                    body.article_publish_date = date
    
                    body.article_sections = section
    
                    body.article_content = text
    
                    body.article_images = image
    
                    body.article_videos = video
    
                    body.article_ad_value = advalue
    
                    body.article_pr_value = prvalue
    
                    body.article_status = 'Done'
    
                    body.article_language = $franc(text)

                    body.date_updated = new Date()
    
                }else if(is_using_snippets){
    
                    const Snippet = module.exports = Function(code)()
    
                    const _article = new Snippet(_raw_html, $string, $moment, url)
    
                    const title = await _article.ARTICLE_TITLE()
    
                    const date = await _article.ARTICLE_PUBLISH()
    
                    const author = await _article.ARTICLE_AUTHOR()
    
                    const section = await _article.ARTICLE_SECTION()
    
                    // const html = await _article.ARTICLE_HTML()
    
                    const text = await _article.ARTICLE_TEXT()
    
                    const image = await _article.ARTICLE_IMAGE()
    
                    const video = await _article.ARTICLE_VIDEO()
    
                    const values = await media_value_helper(global_rank, local_rank, website_cost, text, image, video)
                    
                    const advalue = values.advalue
    
                    const prvalue = values.prvalue
    
                    body.article_url = url
    
                    body.article_title = title
    
                    body.article_authors = author
    
                    body.article_publish_date = date
    
                    body.article_sections = section
    
                    body.article_content = text
    
                    body.article_images = image
    
                    body.article_videos = video
    
                    body.article_ad_value = advalue
    
                    body.article_pr_value = prvalue
    
                    body.article_status = 'Done'
    
                    body.article_language = $franc(text)

                    body.date_updated = new Date()
    
                }else{

                    body.article_status = "Error"

                    body.article_error_status = 'Selectors and Snippets are not configured!'

                    body.date_updated = new Date()
                }

                return body

            }else{
                
                console.log('Only Article Url', context.article_url)

                let _article_url = (context.article_url.indexOf('%') != -1 ) ? decodeURI(context.article_url) : context.article_url

                let check_if_exist = await transaction_helper.CHECK_DOMAIN(_article_url)

                if(check_if_exist.data > 0){

                    let get_website = await transaction_helper.GET_WEBSITE(_article_url)

                    let urlHelper = new url_helper(_article_url, get_website.request_source, get_website.needs_search_params, get_website.needs_https, get_website.needs_endslash)

                    let clean_url = await urlHelper.FORMATTED_URL()

                    body.website = get_website._id

                    body.article_source_url = get_website.fqdn

                    body.article_url = clean_url

                    if(!context.hasOwnProperty('section')){

                        let check_section = await transaction_helper.CHECK_SECTION(get_website.website_url)
    
                        if(check_section.data > 0){
    
                            let get_section = await transaction_helper.GET_SECTION(get_website.website_url)
    
                            body.section = get_section._id
    
                        }else{
    
                            body.section_url = get_website.website_url
    
                            body.website = get_website._id
    
                            let storeSection = await transaction_helper.STORE_SECTION(body)
    
                            body.section = storeSection.data._id
    
                        }
    
                    }

                    const request_source = get_website.request_source

                    const home_url = get_website.website_url

                    const includeSearch = get_website.needs_search_params
                    
                    const startHttps = get_website.needs_https

                    const endSlash = get_website.needs_endslash

                    const selectors = get_website.selectors

                    const code = get_website.code_snippet

                    const is_using_selectors = JSON.parse(get_website.is_using_selectors)

                    const is_using_snippets = JSON.parse(get_website.is_using_snippets)

                    const website_cost = get_website.website_cost

                    const global_rank = get_website.alexa_rankings.global

                    const local_rank = get_website.alexa_rankings.local

                    const _uri = new url_helper(clean_url, request_source, includeSearch, startHttps, endSlash)

                    const _uri_response = await _uri.MAKE_REQUEST()

                    const url = await _uri.FORMATTED_URL()

                    const _htm = new html_helper(_uri_response, home_url, includeSearch, startHttps, endSlash)

                    const _raw_html = await _htm.HTML()

                    if(is_using_selectors){

                        const _article = new article_helper(_raw_html, selectors)

                        const title = await _article.ARTICLE_TITLE()

                        const date = await _article.ARTICLE_PUBLISH()

                        const author = await _article.ARTICLE_AUTHOR()

                        const section = await _article.ARTICLE_SECTION()

                        // const html = await _article.ARTICLE_HTML()

                        const text = await _article.ARTICLE_TEXT()

                        const image = await _article.ARTICLE_IMAGE()

                        const video = await _article.ARTICLE_VIDEO()

                        const values = await media_value_helper(global_rank, local_rank, website_cost, text, image, video)

                        const advalue = values.advalue

                        const prvalue = values.prvalue

                        body.article_url = url

                        body.article_title = title

                        body.article_authors = author

                        body.article_publish_date = date

                        body.article_sections = section

                        body.article_content = text

                        body.article_images = image

                        body.article_videos = video

                        body.article_ad_value = advalue

                        body.article_pr_value = prvalue

                        body.article_status = 'Done'

                        body.article_language = $franc(text)

                    }else if(is_using_snippets){

                        const Snippet = module.exports = Function(code)()

                        const _article = new Snippet(_raw_html, $string, $moment, url)

                        const title = await _article.ARTICLE_TITLE()

                        const date = await _article.ARTICLE_PUBLISH()

                        const author = await _article.ARTICLE_AUTHOR()

                        const section = await _article.ARTICLE_SECTION()

                        // const html = await _article.ARTICLE_HTML()

                        const text = await _article.ARTICLE_TEXT()

                        const image = await _article.ARTICLE_IMAGE()

                        const video = await _article.ARTICLE_VIDEO()

                        const values = await media_value_helper(global_rank, local_rank, website_cost, text, image, video)
                        
                        const advalue = values.advalue

                        const prvalue = values.prvalue

                        body.article_url = url

                        body.article_title = title

                        body.article_authors = author

                        body.article_publish_date = date

                        body.article_sections = section

                        body.article_content = text

                        body.article_images = image

                        body.article_videos = video

                        body.article_ad_value = advalue

                        body.article_pr_value = prvalue

                        body.article_status = 'Done'

                        body.article_language = $franc(text)

                    }else{

                        body.article_status = "Error"

                        body.article_error_status = 'Selectors and Snippets are not configured!'
    
                        body.date_updated = new Date()

                    }

                    return body

                }else{
                    console.log('Website is not in monitoring!')
                }
            }
        } catch (error) {
            throw Error(error)
        }
    }
}

async function fetch(uri, method, headers, body) {
    const p = new Promise((resolve, reject) => {
        try {
            let options = {
                "url": uri,
                "method": method || 'GET'
            }

            if(headers){
                options.headers = headers
            }

            if(body){
                options.body = body
            }
            
            request(options, (error, response, body) => {
                if(error) {
                    // console.error(error)
                    reject(error)
                }else{
                    // console.log(body)
                    resolve(body)
                }
            })
        } catch (error) {
            reject(error)
        }
    })

    return p
}

async function processArticle(website, section, fqdn, articleLinks) {
    try {
        Promise.allSettled(articleLinks.map(v => {
            setTimeout(() => {
                fetch(source_enpoint+`article/count`, 'POST', headers, {article_url:v})
                .then(d=>{
                    if(d.data.result > 0){
                        console.log('Existing url',d.data.article_url)
                    }else{
                        let article_source_url = fqdn
                        let article_url = d.data.article_url
                        let article_status = "Queued"
                        let date_created = new Date()
                        let date_updated = new Date()
                        fetch(source_enpoint+'article', 'POST', headers, {
                            website, section, article_source_url,
                            article_url, article_status, date_created, date_updated
                        }).then(console.log).catch(console.error)
                    }
                })
                .catch(console.error)
            }, 200);
        }))
    } catch (error) {
        throw Error(error)
    }
}

module.exports = Crawler