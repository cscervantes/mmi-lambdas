require('dotenv').config()

const { alexa_helper } = require('./mmi_modules')
// const lambda_enpoint = (JSON.parse(process.env.PRODUCTION)) ? process.env.PRODUCTION_LAMBDA_ENDPOINT : process.env.DEVELOPMENT_LAMBDA_ENDPOINT
// console.log('Lamba URL', lambda_enpoint)
const source_enpoint = (JSON.parse(process.env.PRODUCTION)) ? process.env.PRODUCTION_SOURCE_ENDPOINT : process.env.DEVELOPMENT_SOURCE_ENDPOINT
console.log('Source URL', source_enpoint)
const headers = {
    "Authorization": "Bearer "+process.env.BEARER_TOKEN
}

const request = require('request').defaults({json:true})
// const run = async () => {
//     try {
//         const alexa = await alexa_helper(process.argv[2])
//         console.log(alexa)
//     } catch (error) {
//         console.log(error)
//     }
// }
// run()

async function api(method, url, headers, body){
    const p = new Promise((resolve, reject)=>{
        try {
            request(url, {
                method:method,
                headers:headers,
                body:body
            }, (err, resp, body)=>{
                if(err) reject(err);
                else resolve(body)
            })
        } catch (error) {
            reject(error)
        }
    })
    return p
}

async function website(){
    try {
        let body = {"country": "Unknown"}
        let c = await api('POST', source_enpoint+'web/count_custom_query', headers, body)
        console.log(c)
        let d = await api('POST', source_enpoint+'web/custom_query?fields={"fqdn":1}&limit='+c.data, headers, body)
        let data = d.data
        for(let i = 0; i < data.length; i++){
            let time = Math.floor((Math.random() * 1000) + 800)
            setTimeout(async function(){
                try {
                    let r = await alexa_helper(data[i].fqdn)
                    let b = {
                        "country": r.country,
                        "country_code": r.country_code[1],
                        "alexa_rankings": {
                            "global": r.global,
                            "local": r.local
                        },
                        "date_updated": new Date()
                    }
                    let u = await api('PUT', source_enpoint+'web/'+data[i]._id, headers, b)
                    console.log('Updated',u.data.fqdn)
                } catch (error) {
                    console.log('Hain ang error', error)
                }
            }, i * time)
        }
    } catch (error) {
        console.error(error)
    }
}
 website()