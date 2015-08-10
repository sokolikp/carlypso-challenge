var express = require('express');
var request = require('request');
var app = express();
var port = 8080;

app.use(express.static(__dirname + "/../client"));

var carData;
request('http://interview.carlypso.com/listings?offset=0&limit=10', function (err, res, body) {
  if(err) {
    console.log('Error requesting data');
  } else {
    var data = JSON.parse(body);
    carData = data.value;
    console.log(carData);
  }
});

Array.prototype.sortCarData = function(param) {
  var numbers = ['year', 'odometer', 'condition', 'price'];

  // console.log(this);
  console.log(numbers.indexOf(param));
  this.sort(function(a,b) {
    console.log(a[param], b[param]);
    if(a[param] === undefined && b[param] !== undefined) {
      console.log('undefined a');
      return 1;
    } else if(a[param] !== undefined && b[param] === undefined) {
      console.log('undefined b');
      return -1;
    } else if(numbers.indexOf(param) !== -1) { //sort number fields
      console.log('numbers compare', b[param]-a[param]);
      return b[param]-a[param];
    } else { //sort alphabetic fields
      console.log('string compare', a[param] < b[param] ? -1 : 1)
      return a[param] < b[param] ? -1 : 1;
    }
  });

};

app.get('/sort', function(req, res) {
  console.log('requesting', req.query);
  var sorted;
  var sort = req.query;
  for(var key in sort) {
    console.log('sorting on', key);
    // sorted = sortCarData(carData, key);
    carData.sortCarData(key);
  }
  res.send(carData);
});

app.get('/range', function(req, res) {
  var range = req.query.range;
  ranges = range.split('-');
  ranges[0] = parseInt(ranges[0]);
  ranges[1] = parseInt(ranges[1]);
  var results = [];

  for(var i=0; i<carData.length; i++) {
    if(carData[i].price >= ranges[0] && carData[i].price <= ranges[1]) {
      results.push(carData[i]);
    }
  }

  res.send(results);
});

app.listen(port);
console.log('Server now listening on port ' + port);

module.exports = app;
