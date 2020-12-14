var createError = require('http-errors')
const { url_helper, html_helper, alexa_helper, country_language_helper} = require('../../mmi_modules')

module.exports = function(name, router){
    
    router.get(name, function(req, res, next){
        try {
            res.status(200).send('Website lambda endpoint.')
        } catch (error) {
            next(createError(error))
        }
    })
    
    router.post(name+'/parse_website', async function(req, res, next){
        
        try {
            
            const _req_url = req.body.url

            const _request_source = req.body.request_source
            
            const _uri = new url_helper(_req_url, _request_source, true, false, false)

            const _uri_response = await _uri.MAKE_REQUEST()

            const _uri_origin = await _uri.RELATIVE_PATH()

            const _htm = new html_helper(_uri_response, _uri_origin, true, false, false)

            const urls = await _htm.ALL_LINKS()

            res.status(200).send(urls)

        } catch (error) {
            // next(createError(error))
            next(error)
        }
    })

    router.post(name+'/new_website', async function(req, res, next){
        
        try {
            
            const _req_url = req.body.url

            const request_source = req.body.request_source
            
            const _uri = new url_helper(_req_url, request_source, true, false, false)

            const _uri_response = await _uri.MAKE_REQUEST()

            const _uri_origin = await _uri.RELATIVE_PATH()

            const fqdn = await _uri.FQDN()

            const home_url = await _uri.HOME_URL()

            const url = await _uri.FORMATTED_URL()

            const _htm = new html_helper(_uri_response, _uri_origin, true, false, false)

            let $ = await _htm.HTML()

            let icos = $('link').filter((i,e)=>{
                if($(e).attr('rel')){
                    return $(e).attr('rel').search(/icon$/g) != -1 || $(e).attr('rel').search(/shortcut/g) != -1
                }
            //    return $(e).attr('href').search(/\.ico$/gi) != -1 || $(e).attr('href').search(/icon/gi) != -1 || $(e).attr('href').search(/ico/gi) != -1  
            }).get()

            const base = $('base').attr('href') || _uri_origin
            
            // const fav_icon = icos.map(v=>base+$(v).attr('href')).slice(0)[0]
            const fav_icon = icos.map(v=>{
                let _fvcon = $(v).attr('href')
                if(_fvcon){
                    if(_fvcon.startsWith('//')){
                        return 'http:'+_fvcon
                    }else if(_fvcon.startsWith('/')){
                        return base+_fvcon
                    }else{
                        return _fvcon
                    }
                }else{
                    return ''
                }
            }).filter(v=>v).slice(0)[0]

            const title = ($('title').length > 0) ? $('title').text() : $('meta[property="og:title"]').attr('content')

            const lang = ($('html').attr('lang')) ? $('html').attr('lang') : 'en'

            const language = await country_language_helper.language_lists(lang.split('-')[0])

            const alexa_rankings = await alexa_helper(fqdn)

            const country_code = await country_language_helper.country_lists(alexa_rankings.country)

            const data = {
                url, home_url, fqdn, title, language, country_code, alexa_rankings, fav_icon, request_source
            }
            // https://www.similarweb.com/website/abs-cbn.com create function for ranking
            res.status(200).send(data)

        } catch (error) {
            // if(error.hasOwnProperty('stack')){
            //     res.status(500).send(error.stack)
            // }else{
            //     res.status(500).send(error)
            // }
            next(error)
        }
    })

    router.post(name+'/test_filters', async function(req, res, next){
        try {
            
            const _req_url = req.body.url

            const request_source = req.body.request_source

            const home_url = req.body.website_url

            const includeSearch = req.body.needs_search_params
            
            const startHttps = req.body.needs_https

            const endSlash = req.body.needs_endslash

            const section_filters = req.body.section_filters

            const article_filters = req.body.article_filters
            
            const _uri = new url_helper(_req_url, request_source, includeSearch, startHttps, endSlash)

            const _uri_response = await _uri.MAKE_REQUEST()

            const url = await _uri.FORMATTED_URL()

            const _htm = new html_helper(_uri_response, home_url, includeSearch, startHttps, endSlash, section_filters, article_filters)

            const articles = await _htm.ARTICLE_LINKS()

            const sections = await _htm.SECTION_LINKS()

            const data = {url, articles, sections}

            res.status(200).send(data)

        } catch (error) {
            // if(error.hasOwnProperty('stack')){
            //     res.status(500).send(error.stack)
            // }else{
            //     res.status(500).send(error)
            // }
            next(error)
        }
    })

    router.post(name+'/country_iso', async function(req, res, next){
        try {
            res.status(200).send(await country_language_helper.country_lists(req.body.country))
        } catch (error) {
            next(error)
        }
    })

}