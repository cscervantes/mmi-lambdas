const { $cheerio, $string, $stripcomments, $pretty } = require('../npm_mods')
class ArticleHelper {
    constructor(html, selectors){
        this._html = html // loaded from cheerio
        this._selectors = selectors // array
    }
}

ArticleHelper.prototype.ARTICLE_TITLE = async function(){
    const _entity = this._html
    const titleSelectors = this._selectors.title
    const p = new Promise((resolve, reject) => {
        try {
            let title = _entity('title').text().trim()
            if(titleSelectors.length > 0){
                for(let i = 0; i < titleSelectors.length; i++){
                    let selector = _entity(titleSelectors[i].selector)
                    let attribute = titleSelectors[i].attribute
                    if(selector.length > 0){
                        if(attribute){
                            title = selector.attr(attribute)
                        }else{
                            title = selector.text().trim()
                        }
                        break;
                    }  
                }
            }
            if(title){
                resolve(title)
            }else{
                reject('Missing title')
            } 
        } catch (error) {
            reject(error)
        }
    })
    return p
}

ArticleHelper.prototype.ARTICLE_PUBLISH = async function(){
    const _entity = this._html
    const dateSelectors = this._selectors.publish
    const p = new Promise((resolve, reject) => {
        try {
            let date = _entity('meta[property="article:published_time"]').attr('content')
            if(dateSelectors.length > 0){
                for(let i = 0; i < dateSelectors.length; i++){
                    let selector = _entity(dateSelectors[i].selector)
                    let attribute = dateSelectors[i].attribute
                    if(selector.length > 0){
                        if(attribute){
                            date = selector.attr(attribute)
                        }else{
                            date = selector.text().trim()
                        }
                        break;
                    }  
                }
            }
            if(date){
                resolve(date)
            }else{
                reject('Missing date')
            } 
        } catch (error) {
            reject(error)
        }
    })
    return p
}

ArticleHelper.prototype.ARTICLE_AUTHOR = async function(){
    const _entity = this._html
    const authorSelectors = this._selectors.author
    const p = new Promise((resolve, reject) => {
        try {
            let authors = [_entity('meta[property="article:author"]').attr('content') || 'No - Author']
            if(authorSelectors.length > 0){
                for(let i = 0; i < authorSelectors.length; i++){
                    let selector = _entity(authorSelectors[i].selector)
                    let attribute = authorSelectors[i].attribute
                    if(selector.length > 0){
                        if(attribute){
                            authors.push(selector.attr(attribute))
                        }else{
                            authors.push(selector.text().trim())
                        }
                        break;
                    }  
                }
            }
            resolve(Array.from(new Set(authors.filter(v=>v)))) 
        } catch (error) {
            reject(error)
        }
    })
    return p
}

ArticleHelper.prototype.ARTICLE_SECTION = async function(){
    const _entity = this._html
    const sectionSelectors = this._selectors.section
    const p = new Promise((resolve, reject) => {
        try {
            let sections = [_entity('meta[property="article:section"]').attr('content')]
            if(sectionSelectors.length > 0){
                for(let i = 0; i < sectionSelectors.length; i++){
                    let selector = _entity(sectionSelectors[i].selector)
                    let attribute = sectionSelectors[i].attribute
                    if(selector.length > 0){
                        if(attribute){
                            sections.push(selector.attr(attribute))
                        }else{
                            sections.push(selector.text().trim())
                        }
                        break;
                    }  
                }
            }
            resolve(Array.from(new Set(sections.filter(v=>v))))
        } catch (error) {
            reject(error)
        }
    })
    return p
}

ArticleHelper.prototype.ARTICLE_HTML = async function(){
    const _entity = this._html
    const bodySelectors = this._selectors.body
    const p = new Promise((resolve, reject) => {
        try {
            
            let body = null
            if(bodySelectors.length > 0){
                for(let i = 0; i < bodySelectors.length; i++){
                    removeTags(_entity, bodySelectors[i].ignore_tags)
                    let selector = _entity(bodySelectors[i].selector)
                    let attribute = bodySelectors[i].attribute
                    let find_replace = bodySelectors[i].replace
                    if(selector.length > 0){
                        if(attribute){
                            body = selector.attr(attribute)
                        }else{
                            body = $stripcomments(selector.html())
                            body = $string(body).collapseWhitespace().s
                            body = find_replace.length > 0 ? eval(`$string(body).${removeTexts(find_replace)}.s`) : body
                            // body = eval(body+'.'+removeTexts(find_replace)+'.s')
                        }
                        break;
                    }  
                }
            }

            if(body){
                resolve(body)
            }else{
                reject('Missing body')
            }
             
        } catch (error) {
            reject(error)
        }
    })
    return p
}

ArticleHelper.prototype.ARTICLE_TEXT = async function(){
    const html = await this.ARTICLE_HTML()
    const title = await this.ARTICLE_TITLE()
    const p = new Promise((resolve, reject) => {
        try {
            let text = $cheerio.load($pretty(html, {ocd:true}), {decodeEntities:true})
            text = $string(text.text()).stripTags().s
            text = $string(text).collapseWhitespace().s
            if(text){
                resolve(text)
            }else{
                resolve(title)
            }
        } catch (error) {
            reject(error)
        }
    })
    return p
}

ArticleHelper.prototype.ARTICLE_IMAGE = async function(){
    const html = await this.ARTICLE_HTML()
    let fromContent = $cheerio.load(html, {decodeEntities:true})
    const _entity = this._html
    let imageSelectors = this._selectors.image
    const p = new Promise((resolve, reject) => {
        try {
            let imageFromContent = fromContent('img').map(function(){
                return fromContent(this).attr('src')
            }).get()

            let imageFromSelector = [_entity('meta[property="og:image"]').attr('content')]
            if(imageSelectors.length > 0){
                for(let i = 0; i < imageSelectors.length; i++){
                    let selector = _entity(imageSelectors[i].selector)
                    let attribute = imageSelectors[i].attribute
                    if(selector.length > 0){
                        imageFromSelector.push(selector.attr(attribute))
                        break;
                    }  
                }
            }

            let images = imageFromContent.concat(imageFromSelector).filter(v=>v)
            resolve(Array.from(new Set(images)))
        } catch (error) {
            reject(error)
        }
    })
    return p
    
}

ArticleHelper.prototype.ARTICLE_VIDEO = async function(){
    const html = await this.ARTICLE_HTML()
    let fromContent = $cheerio.load(html, {decodeEntities:true})
    const _entity = this._html
    let videoSelectors = this._selectors.video
    const p = new Promise((resolve, reject) => {
        try {
            let videoFromContent = fromContent('iframe').map(function(){
                return fromContent(this).attr('src')
            }).get()

            let videoFromSelector = []
            if(videoSelectors.length > 0){
                for(let i = 0; i < videoSelectors.length; i++){
                    let selector = _entity(videoSelectors[i].selector)
                    let attribute = videoSelectors[i].attribute
                    if(selector.length > 0){
                        videoFromSelector.push(selector.attr(attribute))
                        break;
                    }  
                }
            }

            let videos = videoFromContent.concat(videoFromSelector).filter(v=>v)
            resolve(Array.from(new Set(videos)))
        } catch (error) {
            reject(error)
        }
    })
    return p
}

module.exports = ArticleHelper

function removeTags($, arrayTags){
    return arrayTags.map((v)=>{
        return $(v).remove()
    })
}

function removeTexts(arrayObj){
    return arrayObj.map(({find, replace}) => {
        return `replaceAll("${find}", "${replace}")`
    }).join('.')
}