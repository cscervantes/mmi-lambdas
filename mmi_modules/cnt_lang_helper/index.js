const fs = require('fs')
const dir = process.env.OLDPWD+'/mmi-lambdas/mmi_modules/cnt_lang_helper'
module.exports.country_lists = async function(needle){
    const promise = new Promise((resolve, reject) => {
        try {
            let countries = JSON.parse(fs.readFileSync(dir+'/country_lists.json', 'utf-8'))
            let iso = countries.find(({country}) => country.search(new RegExp(`^${needle}`, 'gi')) != -1)
            resolve(iso.iso_codes)
        } catch (error) {
            // console.log(error)
            reject('PHL')
        }
    })
    return promise
}

module.exports.language_lists = async function(needle){
    const promise = new Promise((resolve, reject) => {
        try {
            let languages = JSON.parse(fs.readFileSync(dir+'/language_lists.json', 'utf-8'))
            let lang = languages.find(({iso_2_codes}) => iso_2_codes.search(new RegExp(`^${needle}`, 'gi')) != -1)
            resolve(lang.english_name)
        } catch (error) {
            // console.log(error)
            reject('English')
        }
    })
    return promise
}