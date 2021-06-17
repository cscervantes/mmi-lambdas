const { $cheerio, $path } = require('../npm_mods')

class HtmlHelper {
    constructor(_html, _baseUrl, _includeSearch, _startWithHttps, _endsWithSlash, _sectionFilters, _articleFilters){
        this._html = _html //string
        this._baseUrl = _baseUrl // string
        this._includeSearch = JSON.parse(_includeSearch) // boolean
        this._startWithHttps = JSON.parse(_startWithHttps) // boolean
        this._endsWithSlash = JSON.parse(_endsWithSlash) // boolean
        this._sectionFilters = _sectionFilters // array object
        this._articleFilters = _articleFilters // array object
    }
}

HtmlHelper.prototype.HTML = async function() {
    return $cheerio.load(this._html, {decodeEntities: true})
}

HtmlHelper.prototype.ALL_LINKS = async function(){

    // Initialize html
    const html = await this.HTML()

    const p = new Promise((resolve, reject) => {
        try{
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

            // let formatLinks = rawLinks.map( v => {
            //     let vUrl = v
            //     vUrl = (this._startWithHttps) ? vUrl.replace(/^(http\:)/g, 'https:') : vUrl.replace(/^(https\:)/g, 'http:')
            //     vUrl = (this._endsWithSlash) ? (vUrl.substr(-1) != '/') ? vUrl+'/' : vUrl : vUrl.replace(/\/$/g, '')
            //     return new URL(vUrl).href
            // }).filter(v=>{
            //     return !v.includes('facebook.com') && !v.includes('twitter.com') && !v.includes('youtube.com')
            //     && !v.includes('instagram.com') && !v.includes('pinterest.com') && !v.includes('google.com') 
            //     && !v.includes('bit.ly') && !v.includes('/cdn-cgi/') && !v.includes('.jpg') && !v.includes('.jpeg')
            //     && !v.includes('.mpeg') && !v.includes('.png') && !v.includes('.gif') && !v.includes('.pdf') && !v.includes('.doc')
            //     && !v.includes('.xls') && !v.includes('.mp3') && !v.includes('.mp4') && !v.includes('.wav') && !v.includes('.flac')
            //     && !v.includes('.ogg') && !v.includes('.txt')
            // })

            let formatLinks = rawLinks.filter(v=>{
                return !v.includes('facebook.com') && !v.includes('twitter.com') && !v.includes('youtube.com')
                && !v.includes('instagram.com') && !v.includes('pinterest.com') && !v.includes('google.com') 
                && !v.includes('bit.ly') && !v.includes('/cdn-cgi/') && !v.includes('.jpg') && !v.includes('.jpeg')
                && !v.includes('.mpeg') && !v.includes('.png') && !v.includes('.gif') && !v.includes('.pdf') && !v.includes('.doc')
                && !v.includes('.xls') && !v.includes('.mp3') && !v.includes('.mp4') && !v.includes('.wav') && !v.includes('.flac')
                && !v.includes('.ogg') && !v.includes('.txt')
            })

            resolve(formatLinks)

        }catch(e){

            reject(e)
        }
    })
    return p
}

HtmlHelper.prototype.SECTION_LINKS = async function() {
    const all_links = await this.ALL_LINKS()
    let filters = this._sectionFilters
    const p = new Promise((resolve, reject) => {
        try{
            let filteredSections = all_links.filter( v => {
                if(filters.excludes.length > 0){
                    let f = filters.excludes.map(f=>{
                        return `"${encodeURI(v)}".search(/${f}/g) == -1`
                    }).join(' && ')
                    return eval(f.toString())
                }else{
                    return v
                }
            }).filter( v => {
                if(filters.includes.length > 0){
                    let f = filters.includes.map(f=>{
                        return `"${encodeURI(v)}".search(/${f}/g) != -1`
                    }).join(' || ')
                    return eval(f.toString())
                }else{
                    return v
                }
            }).map( v => {
                let _u = new URL(v)
                if(_u.hash){
                    _u.hash = ''
                }
                let vUrl = _u.href
                vUrl = (this._includeSearch) ? vUrl  : new URL(vUrl).origin+new URL(vUrl).pathname
                
                // vUrl = (this._startWithHttps) ? vUrl.replace(/^(http\:)/g, 'https:') : vUrl.replace(/^(https\:)/g, 'http:')
                vUrl = vUrl.replace(/^(https\:)/g, 'http:')
                
                // vUrl = (this._endsWithSlash) ? (vUrl.substr(-1) != '/') ? vUrl+'/' : vUrl : vUrl.replace(/\/$/g, '')
                vUrl = vUrl.replace(/\/$/g, '')
                
                return (vUrl.indexOf('%') != -1) ? decodeURI(vUrl) : encodeURI(vUrl)
            })
            resolve(Array.from(new Set(filteredSections)))
        }catch(e){
            reject(e)
        }
    })
    return p
}

HtmlHelper.prototype.ARTICLE_LINKS = async function() {
    const all_links = await this.ALL_LINKS()
    let filters = this._articleFilters
    const p = new Promise((resolve, reject) => {
        try{
            let filteredSections = all_links.filter( v => {
                if(filters.excludes.length > 0){
                    let f = filters.excludes.map(f=>{
                        return `"${encodeURI(v)}".search(/${f}/g) == -1`
                    }).join(' && ')
                    return eval(f.toString())
                }else{
                    return v
                }
            }).filter( v => {
                if(filters.includes.length > 0){
                    let f = filters.includes.map(f=>{
                        return `"${encodeURI(v)}".search(/${f}/g) != -1`
                    }).join(' || ')
                    return eval(f.toString())
                }else{
                    return v
                }
            }).map( v => {
                let _u = new URL(v)
                if(_u.hash){
                    _u.hash = ''
                }
                let vUrl = _u.href
                vUrl = (this._includeSearch) ? vUrl  : new URL(vUrl).origin+new URL(vUrl).pathname
                
                // vUrl = (this._startWithHttps) ? vUrl.replace(/^(http\:)/g, 'https:') : vUrl.replace(/^(https\:)/g, 'http:')
                vUrl = vUrl.replace(/^(https\:)/g, 'http:')
                
                // vUrl = (this._endsWithSlash) ? (vUrl.substr(-1) != '/') ? vUrl+'/' : vUrl : vUrl.replace(/\/$/g, '')
                vUrl = vUrl.replace(/\/$/g, '')
                
                return (vUrl.indexOf('%') != -1) ? decodeURI(vUrl) : encodeURI(vUrl)
            })
            resolve(Array.from(new Set(filteredSections)))
        }catch(e){
            reject(e)
        }
    })
    return p
}

module.exports = HtmlHelper