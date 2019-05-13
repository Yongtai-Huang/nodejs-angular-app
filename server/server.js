'use strict';

const http = require('http');
const path = require('path');
const methods = require('methods');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// Middlewares
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  //mongoose.connect(process.env.MONGODB_URI);
  mongoose.connect('mongodb://localhost/photoapp', { useNewUrlParser: true });
  mongoose.set('debug', !isProduction);
} else {
  mongoose.connect('mongodb://localhost/photoapp', { useNewUrlParser: true });
  mongoose.set('debug', true);
}

// Models
require('./models/user');
require('./models/photo_comment');
require('./models/photo');

// Passport
require('./config/passport');

//routes
app.use(require('./routes'));

/// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// Production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// Start the server...
const server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
