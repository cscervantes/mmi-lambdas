const { $useragent, $request, $cloudscraper } = require('../npm_mods')

class UrlHelper {
    constructor(_url, _request_source, includeSearch, startWithHttp, endsWithSlash){
        this._url = _url
        this._request_source = _request_source
        this._includeSearch = JSON.parse(includeSearch) // boolean
        this._startWithHttp = JSON.parse(startWithHttp)
        this._endsWithSlash = JSON.parse(endsWithSlash)
    }
}

UrlHelper.prototype.FORMATTED_URL = async function() {
    let _u = new URL(this._url)
    if(_u.hash){
        _u.hash = ''
    }
    let vUrl = _u.href
    vUrl = (this._includeSearch) ? vUrl  : new URL(vUrl).origin+new URL(vUrl).pathname
    vUrl = (this._startWithHttp) ? vUrl.replace(/^(http\:)/g, 'https:') : vUrl.replace(/^(https\:)/g, 'http:')
    vUrl = (this._endsWithSlash) ? (vUrl.substr(-1) != '/') ? vUrl+'/' : vUrl : vUrl.replace(/\/$/g, '')
    return encodeURI(vUrl)
}

UrlHelper.prototype.HOME_URL = async function(){
    return new URL(await this.FORMATTED_URL()).origin
}

UrlHelper.prototype.FQDN = async function() {
    return new URL(this._url).hostname
}

UrlHelper.prototype.USER_AGENT = async function(){
    const ua = new $useragent()
    return ua.toString()
}

UrlHelper.prototype.RELATIVE_PATH = async function(){
    const url = new URL(this._url)
    return url.origin
}

UrlHelper.prototype.MAKE_REQUEST = async function(){
    const headers = {
        'User-Agent': await this.USER_AGENT()
    }
    // console.log(headers)
    const promise = new Promise((resolve, reject) => {
        const _uri = (this._url.indexOf('%') != -1) ? decodeURI(this._url) : encodeURI(this._url)
        try{
            if(this._request_source === 'cloudscraper'){
                $cloudscraper.get(_uri, {headers: headers}, function(error, response, body){
                    // console.log(error, body)
                    if(error) reject(error);
                    else if(!body && !error) reject('Something is wrong with the website.');
                    else resolve(body);
                })
            }else{
                $request.get(_uri, {headers: headers}, function(error, response, body){
                    if(error) reject(error);
                    else if(!body && !error) reject('Something is wrong with the website.');
                    else resolve(body);
                })
            }
            
        }catch(e){
            reject(e)
        }
    })
    return promise
}

module.exports = UrlHelper