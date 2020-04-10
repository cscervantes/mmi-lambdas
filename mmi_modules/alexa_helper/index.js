/**
 * This script is for getting the rankings from alex.com
 */

const { $request, $string, $cheerio } = require('../npm_mods')

class Alexa {
    constructor(fqdn){
        this._fqdn = fqdn.replace(/^www\./g, '').trim()
    }

    async fetchAlexa(){
        const promise = new Promise((resolve, reject)=>{
            try {
                let alexaUrl = 'http://www.alexa.com/siteinfo/'+this._fqdn
                $request.get(alexaUrl, (err, resp, body)=>{
                    if(err) reject(err);
                    else resolve($cheerio.load(body))
                })
            } catch (error) {
                reject(error)
            }
        })
        return promise
    }

    async globalRank() {
        let $ = await this.fetchAlexa()
        const promise = new Promise((resolve, reject)=>{
            try {
                let rank = 0
                if($('div#card_rank section.rank .rank-global p.big.data').length > 0){
                    rank = $('div#card_rank section.rank .rank-global p.big.data').not('span.hash').text()
                    rank = rank.replace(/[^0-9]/g, '').trim()
                    rank = parseInt(rank)
                }
                resolve(rank)
            } catch (error) {
                // console.log(error)
                reject(0)
            }
        })
        return promise
    }

    async localRank() {
        let $ = await this.fetchAlexa()
        const promise = new Promise((resolve, reject)=>{
            try {
                let rank = 0
                if($('#countrydropdown ul').length > 0){
                    rank = $('#countrydropdown ul').removeAttr('style').children('li').eq(0).attr('data-value')
                    rank = rank.replace(/[^0-9]/g, '').trim()
                    rank = parseInt(rank)
                }
                resolve(rank)
            } catch (error) {
                // console.log(error)
                reject(0)
            }
        })
        return promise
    }

    async originCountry(){
        let $ = await this.fetchAlexa()
        const promise = new Promise((resolve, reject)=>{
            try {
                let country = 'Philippines'
                if($('#countrydropdown ul').length > 0){
                    country = $('#countrydropdown ul').removeAttr('style').children('li').not('span').eq(0).text()
                    country = country.replace(/[^a-zA-Z]/g, '').split(/(?=[A-Z])/g).join(' ')
                    country = country.trim()
                }
                resolve(country)
            } catch (error) {
                // console.log(error)
                reject('Philippines')
            }
        })
        return promise
    }
}

module.exports = async (fqdn) => {
    
    const promise = new Promise(async(resolve, reject)=>{
        try {
            const alexa = new Alexa(fqdn)
            const global = await alexa.globalRank()
            const local = await alexa.localRank()
            const country = await alexa.originCountry()
            resolve({global,local,country})
        } catch (error) {
            reject({
                'global': 0,
                'local': 0,
                'country': 'Philippines'
            })
        }
    })
    return promise
}