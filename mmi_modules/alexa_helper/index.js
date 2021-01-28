/**
 * This script is for getting the rankings from alex.com
 */

const { $request, $string, $cheerio } = require('../npm_mods')
const { country_lists, country_extension_lists } = require('../cnt_lang_helper')
const dns = require('dns')
const { count } = require('console')

class Alexa {
    constructor(fqdn){
        this._fqdn = fqdn.replace(/^www\./g, '').trim()
    }

    async fetchAlexa(){
        const promise = new Promise((resolve, reject)=>{
            try {
                // let alexaUrl = 'http://www.alexa.com/siteinfo/'+this._fqdn
                let alexaUrl = 'http://data.alexa.com/data?cli=10&dat=snbamz&url='+this._fqdn
                $request.get(alexaUrl, async (err, resp, body)=>{
                    if(err) reject(err);
                    else {
                        let $ = $cheerio.load(body, {decodeEntities:true, xmlMode:true})

                        let websiteName = $string(this._fqdn.split('.')[0]).humanize().s

                        let globalRank = 0

                        let localRank = 0
                        
                        let country = 'Unknown'
                        
                        let delta = 0

                        let reach = 0
                        
                        let relatedLinks = []

                        let title = $('SD TITLE')

                        let owner = $('SD OWNER')

                        let sd = $('SD POPULARITY')

                        let rls = $('RLS RL')

                        let ct = $('SD COUNTRY')

                        let dlt = $('SD RANK')
                        
                        let rc = $('SD REACH')

                        if(dlt.length > 0){
                            delta = parseInt(dlt.attr('DELTA'))
                        }

                        if(rc.length > 0){
                            reach = parseInt(rc.attr('RANK'))
                        }

                        if(title.length>0){
                            websiteName = title.attr('TEXT')
                        }else if(owner.length>0){
                            websiteName = owner.attr('NAME')
                        }

                        if(sd.length > 0){
                            globalRank = parseInt(sd.eq(0).attr('TEXT'))
                        }

                        if(ct.length > 0){
                            country = ct.eq(0).attr('NAME')
                            localRank = parseInt(ct.eq(0).attr('RANK'))
                        }

                        if(rls.length > 0){
                            relatedLinks = rls.map((i,e)=>{
                                return $(e).attr('HREF').replace(/\/$/g, '').trim().replace(/^www\./g, '').trim().split('/')[0].trim()
                            }).get()
                        }

                        let fqdn = this._fqdn

                        if(country === 'Unknown'){
                            let ext = fqdn.split('.').splice(-1)
                            country = await country_extension_lists('.'+ext)
                        }else if(!country){
                            country = await this.geolocation()
                        }

                        let country_code = await country_lists(country)

                        resolve({globalRank,localRank,country, websiteName, relatedLinks, fqdn, country_code, delta, reach})

                    }
                })
            } catch (error) {
                // console.log(error)
                reject(error)
            }
        })
        return promise
    }

    async ip(){
        const promise = new Promise(async(resolve, reject)=>{
            try {
                const ip = dns.lookup(this._fqdn, (err, addresses, family) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(addresses)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })

        return promise
    }

    async geolocation(){
        const promise = new Promise(async(resolve, reject)=>{
            try {
                let geolocationUrl = 'https://ipgeolocation.abstractapi.com/v1/?api_key=f4b61e710fd846c48350bd35faacfc51&ip_address='+await this.ip()
                $request.get(geolocationUrl,{headers: {"Content-Type": "application/json", "Origin": "https://www.abstractapi.com", "Referer": "https://www.abstractapi.com/"}}, async (err, resp, body)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(body.country)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
        return promise
    }
}

module.exports = async (fqdn) => {
    
    const promise = new Promise(async(resolve, reject)=>{
        try {
            const alexa = new Alexa(fqdn)
            const rank = await alexa.fetchAlexa()
            const global = rank.globalRank
            const local =  rank.localRank
            const country = rank.country
            const country_code = rank.country_code
            const name = rank.websiteName
            const similar_websites = rank.relatedLinks
            const domain = rank.fqdn
            const home_url = `http://${fqdn}`
            const delta = rank.delta
            const reach = rank.reach
            resolve({name, home_url, domain, country, country_code, global,local, similar_websites, delta, reach})
        } catch (error) {
            reject({
                'global': 0,
                'local': 0,
                'delta': 0,
                'reach': 0,
                'country': 'Unknown',
                'country_code': 'NoC',
                'domain': fqdn.replace(/^www\./g, '').trim(),
                'name': $string(fqdn.replace(/^www\./g, '').trim().split('.')[0]).humanize().s,
                'home_url': `http://${fqdn.replace(/^www\./g, '').trim()}`,
                'similar_websites': []
            })
        }
    })
    return promise
}