var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next){
    res.status(200).send('MMI Lambda endpoints')
})

require('./websiteRoute')('/website', router)
require('./articleRoute')('/article', router)

module.exports = router