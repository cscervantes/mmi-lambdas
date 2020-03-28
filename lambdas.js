const { url_helper, html_helper } = require('../mmi-lambdas/mmi_modules');

(async () => {
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
        // console.log( await _u.USER_AGENT())
        // console.log( await _u.RELATIVE_PATH(url))
        // console.log( await _u.MAKE_REQUEST(url))
        const html = await _u.MAKE_REQUEST(url, 'cloudscraper')
        const _h = new html_helper(html, _baseUrl)
        const _links = await _h.ALL_LINKS()
        console.log(_links)
    }catch(e){
        console.error(e)
    }
})()