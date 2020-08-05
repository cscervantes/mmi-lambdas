require('dotenv').config()

const _ = require('lodash')
const async = require('async')
const request = require('request').defaults({json:true})

const lambda_enpoint = (JSON.parse(process.env.PRODUCTION)) ? process.env.PRODUCTION_LAMBDA_ENDPOINT : process.env.DEVELOPMENT_LAMBDA_ENDPOINT
console.log('Lamba URL', lambda_enpoint)
const source_enpoint = (JSON.parse(process.env.PRODUCTION)) ? process.env.PRODUCTION_SOURCE_ENDPOINT : process.env.DEVELOPMENT_SOURCE_ENDPOINT
console.log('Source URL', source_enpoint)

const headers = {
    "Authorization": "Bearer "+process.env.BEARER_TOKEN
}

const { url_helper, html_helper } = require('../mmi_modules')

const status = process.env.STATUS || "ACTIVE"
const website_type = process.env.WEBSITE_TYPE || "LOCAL_NEWS"

class Crawler {
    async addActiveSitesToCrawler(){
        let func = this.addActiveSitesToCrawler.name
        try {
            let url = source_enpoint+`crawl/last_modified_active_websites?status=${status}&website_type=${website_type}`
            let result = await fetch(url, "GET", headers)
            let embedded = result.data.map(v=>v.embedded_sections)
            // console.log(embedded)
            let sections = _.flattenDeep(embedded).map(v=>{
                return {
                    section: v._id,
                    type:v.type
                }
            })
            console.log(sections, sections.length)
            // process.exit(0)
            // let sectionOptions = {
            //     "url": source_enpoint+"queue",
            //     "method": "POST",
            //     "headers": event.headers
            // }
            // await Promise.allSettled(sections.map(async(v)=>await fetch(sectionOptions.url, sectionOptions.method, sectionOptions.headers, v)))
        } catch (error) {
            throw Error(error)
        }
    }

    async crawlActiveWebsites(){
        let func = this.crawlActiveWebsites.name
        try {
            console.log('Calling',func)
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
            let url = source_enpoint+`crawl/crawl_active_websites?status=${status}&website_type=${website_type}&fields=${JSON.stringify(fields)}`
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

            console.log(flatData.length)

            // console.log(flatData)

            // let tasks = async.queue( (task, done) => {
                
            //     setTimeout( async function(){
            //         const _req_url = task.section_url

            //         const request_source = task.request_source

            //         const home_url = task.website_url

            //         const includeSearch = task.needs_search_params
                    
            //         const startHttps = task.needs_https

            //         const endSlash = task.needs_endslash

            //         const section_filters = task.section_filter

            //         const article_filters = task.article_filter
                    
            //         const _uri = new url_helper(_req_url, request_source, includeSearch, startHttps, endSlash)

            //         const _uri_response = await _uri.MAKE_REQUEST()

            //         const url = await _uri.FORMATTED_URL()

            //         const _htm = new html_helper(_uri_response, home_url, includeSearch, startHttps, endSlash, section_filters, article_filters)

            //         const articles = await _htm.ARTICLE_LINKS()

            //         console.log(articles)
            //         done()
            //     },500);
            // }, 10)
            // flatData.forEach(function(element){
            //     tasks.push(element)
            // })
            // tasks.error(function(err, task) {
            //     console.log(task.section_url, err)
            // })
            // tasks.drain(function(){
            //     console.log('Done.')
            // })
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

module.exports = Crawler