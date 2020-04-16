var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var app = express();

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(function(req, res, next){
    if(req.path === '/'){
        res.redirect('/lambda-api')
    }else{
        next()
    }
})
app.use('/lambda-api', require('./routes'))

module.exports = app