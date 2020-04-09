var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var app = express();

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/lambda-api', require('./routes'))

module.exports = app