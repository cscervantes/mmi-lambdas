var createError = require('http-errors')
const { url_helper, html_helper } = require('../../mmi_modules')


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
            
            const _uri = new url_helper(_req_url)

            const _uri_response = await _uri.MAKE_REQUEST()

            const _uri_origin = await _uri.RELATIVE_PATH()

            const _htm = new html_helper(_uri_response, _uri_origin)

            const urls = await _htm.ALL_LINKS()

            res.status(200).send(urls)

        } catch (error) {
            next(createError(error))
        }
    })
}