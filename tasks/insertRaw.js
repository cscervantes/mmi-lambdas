
const fetch = require('./fetch')

const async = require('async')

// const source_enpoint = "http://localhost:4040/mmi-endpoints/v0/"
const source_enpoint = "http://192.168.3.143:4040/mmi-endpoints/v0/"

const event = {}
event.url = null
event.headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.f2X7W_6J8g6y-jKto1fMj5zq7QkOLu9WBGw5b-sHAIc"
}


const syncMediaWeb = async () => {
    try {
        event.url = source_enpoint+'article?is_in_mysql=false&article_status=Done&limit=1000'
        event.method = "GET"
        event.headers['Content-type'] = 'application/json'
        let countFalse = await fetch(event.url, event.method, event.headers)
        console.log(countFalse)
        await Promise.allSettled(countFalse.data.map(async v => {
            let body = {
                mwe_src_url: v.article_source_url,
                mwe_src_aut_full_name: (v.article_authors.length > 0 ) ? JSON.stringify(Object.assign({}, v.article_authors)) : JSON.stringify({"0":"No - Author"}),
                mwe_src_aut_first_name: '',
                mwe_src_aut_last_name: '',
                mwe_src_med_type: 'Web',
                mwe_full_url: v.article_url,
                mwe_content: v.article_content,
                mwe_title: v.article_url,
                mwe_section: v.article_sections.join(', '),
                mwe_val: v.article_ad_value,
                mwe_mod_val: v.article_pr_value,
                mwe_date: v.article_publish_date,
                mwe_datetime: v.article_publish_date,
                mwe_img_vid_url: JSON.stringify({
                    img: v.article_images,
                    vid: v.article_videos
                }),
                mwe_pub_name: v.website.website_name,
                mwe_pub_cc: v.website.country_code,
                mwe_lang: v.article_language || 'en',
                // mwe_status: 'Testing'
            }
            let countArticle = await fetch(source_enpoint+'media/count', 'POST', event.headers, {mwe_full_url: v.article_url})
            if(countArticle[0].total > 0){
                // upate article collection
                await fetch(source_enpoint+'article/'+v._id,"PUT",event.headers,{"is_in_mysql": true})
            }else{
                // inser to media_web_raw
                let insert_raw = await fetch(source_enpoint+'media/insert_raw', 'POST', event.headers, body)
                if(insert_raw.affectedRows > 0){
                    await fetch(source_enpoint+'article/'+v._id,"PUT",event.headers,{"is_in_mysql": true})
                }
            }
        }))
    } catch (error) {
        console.log(error)
    }
}

syncMediaWeb()