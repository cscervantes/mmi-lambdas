const { $cheerio, $path } = require('../npm_mods')

class HtmlHelper {
    constructor(_html, _baseUrl){
        this._html = _html
        this._baseUrl = _baseUrl
    }
}

HtmlHelper.prototype.HTML = async function() {
    return $cheerio.load(this._html, {decodeEntities: true})
}

HtmlHelper.prototype.ALL_LINKS = async function(){

    // Initialize html
    const html = await this.HTML()

    // Parse html to get links inside body tag
    let links = html('body a').map(function(){
        return html(this).attr('href')
    }).get()
    .filter( v => {
        return v.startsWith('/') || v.startsWith('http')
    })

    let mapHttp = Array.from(new Set(links)).filter( v => {
        return v.startsWith('http')
    })

    let mapSlash = Array.from(new Set(links)).filter( v => {
        return v.startsWith('/')
    })

    let mapIncludeHttp = mapSlash.map( v => {
        if(v.startsWith('/')){
            return $path.join(this._baseUrl, v)
        }
    })

    let rawLinks = mapHttp.concat(mapIncludeHttp)

    return rawLinks
}

module.exports = HtmlHelper