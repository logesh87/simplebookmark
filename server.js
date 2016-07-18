var express = require('express'),
    mongoose = require('mongoose'),
    qs = require('querystring'),    
    colors = require('colors'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),    
    request = require('request'),    
    app = express(),
    port = process.env.PORT || 5000,
    //db = require('./config/db'),
    mongoose = require('mongoose'),
    compress = require('compression');

mongoose.connect(process.env.db);
app.use(compress());
var cacheTime = 86400000*7;     // 7 days
app.use(express.static(__dirname + '/public',{ maxAge: cacheTime }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
var router = express.Router();
require('./app/routes')(app, router);


app.listen(port);
console.log('Listening on ' + port);
exports = module.exports = app; 						