const { $cheerio } = require('../npm_mods')
class HtmlHelper {
    constructor(_html){
        this._html = _html
    }
}

HtmlHelper.prototype.HTML = async function() {
    return $cheerio.load(this._html, {decodeEntities: true})
}

HtmlHelper.prototype.ALL_LINKS = async function(){
    const html = await this.HTML()
    let links = html('body a').map(function(){
        return html(this).attr('href')
    }).get()
    .filter(function(v){
        return v.startsWith('/') || v.startsWith('http')
    })

    let mapHttp = Array.from(new Set(links)).filter(function(v){
        return v.startsWith('http')
    })

    let mapSlash = Array.from(new Set(links)).filter(function(v){
        return v.startsWith('/')
    })

    return mapHttp.concat(mapSlash)
}

module.exports = HtmlHelper