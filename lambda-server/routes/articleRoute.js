var createError = require('http-errors')


module.exports = function(name, router){

    router.get(name, function(req, res, next){
        res.status(200).send('Article lambda endpoint.')
    })

}