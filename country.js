const uri = "https://countrycode.org/"
const { url_helper, html_helper } = require('./mmi_modules')
const fs = require('fs')

const run = async function() {
    try {
        const _uri = new url_helper(uri)

        const _uri_response = await _uri.MAKE_REQUEST()

        const _html = new html_helper(_uri_response)

        let $ = await _html.HTML()

        let country_lists = $('table > tbody tr').map((i, e)=>{
            return {
                'country': $(e).children('td').eq(0).text(),
                'country_code': $(e).children('td').eq(1).text(),
                'iso_codes': $(e).children('td').eq(2).text().split('/').map(v=>v.trim()),
                'population': $(e).children('td').eq(3).text(),
                'area_km3': $(e).children('td').eq(4).text(),
                'gdp_usd': $(e).children('td').eq(5).text()

            }
        }).get()
        fs.writeFile('mmi_modules/cnt_lang_helper/country_lists.json', JSON.stringify(country_lists, null, 4), (err) => {
            if(err){
                console.log(err)
            }else{
                console.log('Saved in mmi_modules/cnt_lang_helper/country_lists.json')
            }
        })
    } catch (error) {
        console.log(error)
    }
}

run()