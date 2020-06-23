const fetch = require('./fetch')
const _ = require('lodash')

// const source_enpoint = "http://localhost:4040/mmi-endpoints/v0/"
const source_enpoint = "http://192.168.3.143:4040/mmi-endpoints/v0/"

const event = {}
event.url = null
event.headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.f2X7W_6J8g6y-jKto1fMj5zq7QkOLu9WBGw5b-sHAIc"
}

const status = process.env.STATUS || "ACTIVE"
const website_type = process.env.WEBSITE_TYPE || "LOCAL_NEWS"
const addSectionFunc = async () => {
    try {
        event.url = source_enpoint+`crawl?status=${status}&website_type=${website_type}`
        let result = await fetch(event.url, "GET", event.headers)
        let embedded = result.data.map(v=>v.embedded_sections)
        let sections = _.flattenDeep(embedded).map(v=>{
            return {
                section: v._id
            }
        })
        console.log(sections, sections.length)
        let sectionOptions = {
            "url": source_enpoint+"queue",
            "method": "POST",
            "headers": event.headers
        }
        await Promise.allSettled(sections.map(async(v)=>await fetch(sectionOptions.url, sectionOptions.method, sectionOptions.headers, v)))
    } catch (error) {
        console.log(error)
    }
}

addSectionFunc()