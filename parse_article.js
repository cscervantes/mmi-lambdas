const { url_helper, html_helper, article_helper } = require('./mmi_modules');

const parse = async function(){
    const selectors = {
        title: [
            {
                'selector': 'h1[class="news-title"]',
                'attribute': null,
                'ignore_tags': [],
                'replace': []
            }
        ],
        publish: [
            {
                'selector': 'meta[name="pubdate"]',
                'attribute': 'content',
                'ignore_tags': [],
                'replace': []
            }
        ],
        author: [
            {
                'selector': 'meta[property="article:author"]',
                'attribute': 'content',
                'ignore_tags': [],
                'replace': []
            }
        ],
        section: [
            {
                'selector': 'meta[property="article:section"]',
                'attribute': 'content',
                'ignore_tags': [],
                'replace': []
            }
        ],
        body: [
            {
                'selector': 'article',
                'attribute': null,
                'ignore_tags': ['script', '#relatedArticleList', '.sharebar', '#internal-tags', 
                '.article-metakey', '.breadcrumb-block', '.article-label', '.news-title', '.author-block'],
                'replace': [{
                    'find':'Prior',
                    'replace': ''
                },
                {
                    'find':'&#x2014;',
                    'replace': ''
                }]
            }
        ],
        image: [
            {
                'selector': 'meta[property="article:author"]',
                'attribute': 'content',
                'ignore_tags': [],
                'replace': []
            }
        ],
        video: [
            {
                'selector': 'meta[property="article:author"]',
                'attribute': 'content',
                'ignore_tags': [],
                'replace': []
            }
        ]
    }
    try {
        let _uri = process.argv[2]
        if(!_uri){
            throw new Error('Missing Url')
        }
        const _url = new url_helper(_uri)
        const _request = await _url.MAKE_REQUEST()
        const url = await _url.FORMATTED_URL()

        const _html = new html_helper(_request)
        const _parse = await _html.HTML()

        const _article = new article_helper(_parse, selectors)
        const title = await _article.ARTICLE_TITLE()
        const date = await _article.ARTICLE_PUBLISH()
        const author = await _article.ARTICLE_AUTHOR()
        const section = await _article.ARTICLE_SECTION()
        const html = await _article.ARTICLE_HTML()
        const text = await _article.ARTICLE_TEXT()
        const image = await _article.ARTICLE_IMAGE()
        const video = await _article.ARTICLE_VIDEO()
        return  {url, title, date, author, section, html, text, image, video}
    } catch (error) {
        return error
    }
}
parse().then(console.log).catch(console.error)

