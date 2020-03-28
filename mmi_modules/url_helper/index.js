const { $useragent, $request, $cloudscraper } = require('../npm_mods')

class UrlHelper {
    constructor(_url){
        this._url = _url
    }
}

UrlHelper.prototype.FORMATTED_URL = async function(startWithHttp, endsWithSlash) {
    return this._url
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
    const protocol = url.protocol
    const path = url.hostname
    const r_path = `${protocol}//${path}`
    return r_path
}

UrlHelper.prototype.MAKE_REQUEST = async function(url, request_source){
    const headers = {
        'User-Agent': await this.USER_AGENT()
    }
    const promise = new Promise((resolve, reject) => {
        try{
            if(request_source === 'cloudscraper'){
                $cloudscraper.get(encodeURI(url), {headers: headers}, function(error, response, body){
                    // console.log(error, body)
                    if(error) reject(error);
                    else if(!body && !error) reject('Something is wrong with the website.');
                    else resolve(body);
                })
            }else{
                $request.get(encodeURI(url), {headers: headers}, function(error, response, body){
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