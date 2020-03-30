const { url_helper, html_helper } = require('../mmi-lambdas/mmi_modules');

(async () => {

    let sFilters = {
        includes: [
        ],
        excludes: [
            '(vouchers\\.inquirer\\.net)',
            '\\/redirect\\/',
            '\\/(\\\d+)\\/'
        ]
    }
    
    let aFilters = {
        includes: [
            '(malaya\\.com\\.ph)\\/(.+)\\/(.+)\\/'
        ],
        excludes: [
            '\\/page-one-single\\/'
        ]
    }

    try{
        // const url = 'https://news.abs-cbn.com/'
        // const url = 'https://www.philstar.com/'
        // const url = 'https://www.manilatimes.net/'
        // const url = 'https://malaya.com.ph/index.php'
        // const url = 'https://www.gmanetwork.com/news/'
        // const url = 'https://www.inquirer.net/'
        // const url = 'https://www.bworldonline.com/'
        const url = process.argv[2]
        const _u = new url_helper(url)
        const _baseUrl = await _u.RELATIVE_PATH()
        // console.log( await _u.URL())

        // console.log( await _u.FQDN())

        // let mapUA = await Promise.allSettled(Array(1000).fill().map(async () => await _u.USER_AGENT()))
        // console.log(mapUA)

        // console.log( await _u.RELATIVE_PATH(url))

        // console.log( await _u.MAKE_REQUEST(url))

        const html = await _u.MAKE_REQUEST(url, 'cloudscraper')

        const _h = new html_helper(html, _baseUrl, true, true, sFilters, aFilters)

        // const _links = await _h.ALL_LINKS()

        const _sections = await _h.SECTION_LINKS()

        const _articles = await _h.ARTICLE_LINKS()

        console.log({_sections, _articles})
        
        // console.log(_links)

    }catch(e){

        console.error(e)

    }
})()