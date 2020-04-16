// this will be configure later
class Article {
    constructor($wrapper, $string, $moment){
        this._cheerio = $wrapper;
        this._string = $string;
        this._moment = $moment;
    }
}

//Dont modify this block
Article.prototype.ENTITY = function(){
    return this._cheerio
}

//Dont modify this block
Article.prototype.STRING = function(){
    return this._string
}

//Dont modify this block
Article.prototype.MOMENT = function(){
    return this._moment
}

// You can modify this function
Article.prototype.ARTICLE_TITLE = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Title here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_PUBLISH = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Date here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_AUTHOR = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Author here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_SECTION = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Section Here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_HTML = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('HTML here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_TEXT = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Text here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_IMAGE = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Image here')
        }catch(error){
            reject(error)
        }
    })
    return p
}

Article.prototype.ARTICLE_VIDEO = async function(){
    const $ = this.ENTITY()
    const p = new Promise(async (resolve, reject) => {
        try{
            // insert your code here
            resolve('Video here')
        }catch(error){
            reject(error)
        }
    })
    return p
}


return Article;