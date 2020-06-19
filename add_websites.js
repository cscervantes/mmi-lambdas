const fetch = require('./tasks/fetch')

const async = require('async')

const fs = require('fs')

const source_enpoint = "http://localhost:4040/mmi-endpoints/v0/"

const event = {}
event.url = null
event.headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.f2X7W_6J8g6y-jKto1fMj5zq7QkOLu9WBGw5b-sHAIc"
}

const websites = async () => {
    try {
        let websites = fs.readFileSync('websites.json', 'utf-8')
        event.headers['Content-type'] = 'application/json'
        let p = await Promise.allSettled(JSON.parse(websites).map( async v => {
            let f = await fetch(source_enpoint+'web', 'POST', event.headers, v)
            console.log(f)
            return f
        }))
        p.forEach(element => {
            console.log(element)
        });
        
    } catch (error) {
        console.log(error)
    }
}

websites()