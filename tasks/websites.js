const fetch = require('./fetch')

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
        let _url = source_enpoint+'web?limit=100'
        let rq = await fetch(_url, 'GET', event.headers)
        fs.writeFile('websites.json', JSON.stringify(rq.data, null, 4), function(err){
            if(!err){
                console.log('Save')
            }
        })
    } catch (error) {
        console.log(error)
    }
}

websites()