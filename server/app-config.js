var express = require('express');
var querystring = require('querystring');
var apiHelper = require('./beatsApiHelper.js');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.configure(function() {
  app.use(express.bodyParser());
  app.use(allowCrossDomain);
  app.use(express.static(__dirname + './../client'));
});

// public routes
app.get('/auth/beatsmusic', apiHelper.redirect);

app.get('/auth/beatsmusic/callback', apiHelper.requestToken);

app.get('/app', apiHelper.requestToken);

app.all('*', function (req, res) {
  res.send(404, 'bad route');
});

module.exports = app;
