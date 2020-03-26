const { $url, $useragent, $request, $cloudscraper } = require('../npm_mods')

class UrlHelper {
    constructor(_url){
        this._url = _url
    }
}

UrlHelper.prototype.URL = async function() {
    return this._url
}

UrlHelper.prototype.FQDN = async function() {
    return $url(this._url).hostname
}

UrlHelper.prototype.USER_AGENT = async function(){
    const ua = new $useragent()
    return ua.toString()
}

UrlHelper.prototype.RELATIVE_PATH = async function(base_url){
    const protocol = $url(base_url).protocol
    const path = $url(base_url).hostname
    const r_path = `${protocol}//${path}`
    return r_path
}

UrlHelper.prototype.MAKE_REQUEST = async function(url){
    const headers = {
        'User-Agent': await this.USER_AGENT()
    }
    const promise = new Promise((resolve, reject) => {
        try{
            $request.get(url, {headers: headers}, function(error, response, body){
                // console.log(error, body)
                if(error) reject(error);
                else if(!body && !error) reject('Something is wrong with the website.');
                else resolve(body);
            })
        }catch(e){
            reject(e)
        }
    })
    return promise
}

module.exports = UrlHelper