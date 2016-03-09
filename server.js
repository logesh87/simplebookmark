var express = require('express'),
    mongoose = require('mongoose'),
    qs = require('querystring'),
    cors = require('cors'),
    colors = require('colors'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    request = require('request'),
    cors = require('cors'),
    app = express(),
    port = process.env.PORT || 5000,
    db = require('./config/db'),
    mongoose = require('mongoose')


mongoose.connect(db.url);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app/uploads'));


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

require('./app/routes')(app);


app.listen(port);
console.log('Listening on ' + port);
exports = module.exports = app; 						