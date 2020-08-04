const _ = require('lodash')
const request = require('request').defaults({json:true})

const source_enpoint = "http://localhost:4040/mmi-endpoints/v0/"
// const source_enpoint = "http://192.168.3.143:4040/mmi-endpoints/v0/"

const event = {}
event.url = null
event.headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.f2X7W_6J8g6y-jKto1fMj5zq7QkOLu9WBGw5b-sHAIc"
}
const status = process.env.STATUS || "ACTIVE"
const website_type = process.env.WEBSITE_TYPE || "LOCAL_NEWS"

class Crawler {
    async addActiveSitesToCrawler(){
        try {
            event.url = source_enpoint+`crawl/last_modified_active_websites?status=${status}&website_type=${website_type}`
            console.log(event.url)
            let result = await fetch(event.url, "GET", event.headers)
            let embedded = result.data.map(v=>v.embedded_sections)
            console.log(embedded)
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
            console.log(error)
        }
    }

    async edit(){
        try {
            console.log('Edit function')
        } catch (error) {
            console.error('Something is wrong')
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