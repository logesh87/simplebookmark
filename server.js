var express         = require('express');
var mongoose        = require('mongoose');
var qs 				= require('querystring');
var cors 			= require('cors');
var colors 			= require('colors');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var request 		= require('request');
var cors            = require('cors');
var app             = express();

var port            = process.env.PORT || 5000;
var db = require('./config/db');
mongoose.connect(db.url);

 
app.use(express.static(__dirname + '/public'));                 

app.use(morgan('dev'));                                         
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  
app.use(methodOverride());

require('./app/routes')(app); 


app.listen(port);	
console.log('Listening on ' + port); 			
exports = module.exports = app; 						