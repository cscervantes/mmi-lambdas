const { $useragent, $request, $cloudscraper } = require('../npm_mods')

class UrlHelper {
    constructor(_url, _request_source, startWithHttp, endsWithSlash){
        this._url = _url
        this._request_source = _request_source
        this._startWithHttp = startWithHttp
        this._endsWithSlash = endsWithSlash
    }
}

UrlHelper.prototype.FORMATTED_URL = async function() {
    let vUrl = this._url
    vUrl = (this._startWithHttp) ? vUrl.replace(/^(http\:)/g, 'https:') : vUrl.replace(/^(https\:)/g, 'http:')
    vUrl = (this._endsWithSlash) ? (vUrl.substr(-1) != '/') ? vUrl+'/' : vUrl : vUrl.replace(/\/$/g, '')
    return vUrl
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
        try{
            if(this._request_source === 'cloudscraper'){
                $cloudscraper.get(encodeURI(this._url), {headers: headers}, function(error, response, body){
                    // console.log(error, body)
                    if(error) reject(error);
                    else if(!body && !error) reject('Something is wrong with the website.');
                    else resolve(body);
                })
            }else{
                $request.get(encodeURI(this._url), {headers: headers}, function(error, response, body){
                    // console.log(error, body)
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