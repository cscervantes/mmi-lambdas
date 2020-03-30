module.exports = {
    '$request': require('request').defaults({json:true}),
    '$cloudscraper': require('cloudscraper').defaults({json:true}),
    '$cheerio': require('cheerio'),
    '$useragent': require('user-agents'),
    '$url': require('url').parse,
    '$path': require('path'),
    '$string': require('string'),
    '$moment': require('moment'),
    '$stripcomments': require('strip-html-comments')
}