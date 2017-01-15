var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var winston = require('winston');
winston.add(winston.transports.File, { filename: './logs/application.log' });
winston.remove(winston.transports.Console);

//set logging level
winston.level = process.env.NODE_ENV === 'development' ? 'debug' : 'error';

//register app root folder
global.appRoot = path.resolve(__dirname);

//mongodb init and schema
var mongoose = require('mongoose');
require('./models/Objects');

//connect to mongodb
winston.log('info', 'Initiate connection to mongodb.');
mongoose.connect('mongodb://localhost/objects');
winston.log('info', 'Connected to mongodb.');

var objects = require('./routes/objects');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routing
app.use('/objects', objects);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  winston.log('error', err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
		errors: err,
		message : err.message
	});

  //res.render('error');
});

module.exports = app;
