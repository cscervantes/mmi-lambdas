const uri = "https://www.loc.gov/standards/iso639-2/php/code_list.php"
const { url_helper, html_helper } = require('./mmi_modules')
const fs = require('fs')

const run = async function() {
    try {
        const _uri = new url_helper(uri)

        const _uri_response = await _uri.MAKE_REQUEST()

        const _html = new html_helper(_uri_response)

        let $ = await _html.HTML()

        let language_lists = $('table > tbody tr').slice(1).map((i, e)=>{
            return {
                'iso_3_codes': $(e).children('td').eq(0).text(),
                'iso_2_codes': $(e).children('td').eq(1).text(),
                'english_name': $(e).children('td').eq(2).text(),
                'french_name': $(e).children('td').eq(3).text(),
                'german_name': $(e).children('td').eq(4).text()

            }
        }).get()
        fs.writeFile('mmi_modules/cnt_lang_helper/language_lists.json', JSON.stringify(language_lists, null, 4), (err) => {
            if(err){
                console.log(err)
            }else{
                console.log('Saved in mmi_modules/cnt_lang_helper/language_lists.json')
            }
        })
        // console.log(language_lists)
    } catch (error) {
        console.log(error)
    }
}

run()