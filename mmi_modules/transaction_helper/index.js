var request = require('request').defaults({json:true})
var config = require('../../lambda-server/config')

// mmi-endpoints
var configUrl = (process.env.PRODUCTION) ? config.endpoints.production.url : config.endpoints.development.url
var configHeaders = (process.env.PRODUCTION) ? config.endpoints.production.headers : config.endpoints.development.headers


let Transactions = {}

// check if exists
Transactions.STORE_ARTICLE = async(req) => {
    const p = new Promise((resolve, reject) => {
        try {
            request.post(configUrl+'crawl/article', {headers:configHeaders, body:req.body}, (err, resp, body) => {
                if(err) reject(err);
                else resolve(body)
            })
        } catch (error) {
           reject(error) 
        }
    })
    return p
}

Transactions.STORE_SECTION = async(req) => {
    const p = new Promise((resolve, reject) => {
        try {
            request.post(configUrl+'crawl/section', {headers:configHeaders, body:req.body}, (err, resp, body) => {
                if(err) reject(err);
                else resolve(body)
            })
        } catch (error) {
           reject(error) 
        }
    })
    return p
}

Transactions.CHECK_DOMAIN = async (url) => {
    const p = new Promise((resolve, reject)=>{
        try {
            let fqdn = new URL(url).hostname
            request.get(configUrl+'crawl/website/count?fqdn='+fqdn, {headers:configHeaders}, (err, resp, body)=>{
                if(err) reject(err);
                else resolve(body)
            })
        } catch (error) {
            reject(error)
        }
    })
    return p
}


module.exports = Transactions