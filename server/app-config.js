var express = require('express'); // require express server
var querystring = require('querystring'); // require querystring to part url
var apiHelper = require('./beatsApiHelper.js');  //require beatApiHelper which handles beat API calls

var app = express();

// allow CORS and set options
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// configure express and serve client page (index.html)
app.configure(function() {
  app.use(express.bodyParser());
  app.use(allowCrossDomain);
  app.use(express.static(__dirname + './../client'));
});

// public routes
app.get('/auth/beatsmusic', apiHelper.redirect);

app.get('/auth/beatsmusic/callback', apiHelper.requestToken);

app.get('/questions', apiHelper.createQuestions);

// requesting a route that doesn't exist
app.all('*', function (req, res) {
  res.send(404, 'bad route');
});

module.exports = app;
