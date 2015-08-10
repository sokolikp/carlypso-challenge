var express = require('express');
var request = require('request');
var app = express();
var port = 8080;

var carData;
request('http://interview.carlypso.com/listings?offset=0&limit=10000', function (err, res, body) {
  if(err) {
    console.log('Error requesting data');
  } else {
    console.log(body);
    carData = body;
  }
});

app.get('/signup', function(req, res) {
  res.render('signup');
});


app.listen(port);
console.log('Server now listening on port ' + port);

module.exports = app;
