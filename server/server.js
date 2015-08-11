var express = require('express');
var request = require('request');
var app = express();
var port = 8080;

app.use(express.static(__dirname + "/../client"));

var carData = [];
//use request library to retrieve initial car data. Can request up to 10,000 records

var getData = function(offset) {
  var requestURL = 'http://interview.carlypso.com/listings?offset=' + offset + '&limit=' + 10000;
  request(requestURL, function (err, res, body) {
    if(err) {
      console.log('Error requesting data');
    } else {
      var data = JSON.parse(body);
      if(data.value.length) {
        carData = carData.concat(data.value);
        getData(offset + 10000);
      }
      // console.log('complete', carData.length);
    }
  });
};

getData(0);

Array.prototype.sortCarData = function(params) {
  //use this array as baseline to check sorting type (number vs. string)
  var numbers = ['year', 'odometer', 'condition', 'price'];
  var index, sortKey;

  this.sort(function(a,b) {
    index = 0;
    //check whether to delegate to next sorting parameter (if fields are equal)
    while(a[params[index]] === b[params[index]] && index < params.length) {
      index++;
    }
    sortKey = params[index];

    if(a[sortKey] === undefined && b[sortKey] !== undefined) {
      return 1;
    } else if(a[sortKey] !== undefined && b[sortKey] === undefined) {
      return -1;
    } else if(numbers.indexOf(params[index]) !== -1) { //sort number fields
      return b[sortKey]-a[sortKey];
    } else { //sort string fields
      return a[sortKey] < b[sortKey] ? -1 : 1;
    }
  });

};

//REQUEST IN THE FORM: /sort?field1&field2&...
app.get('/sort', function(req, res) {
  console.log('requesting', req.query);
  var params = [];
  var sort = req.query;
  for(var key in sort) {
    params.push(key);
  }
  carData.sortCarData(params);
  res.send(carData);
});

//REQUEST IN THE FORM: /range?range=low-high
app.get('/range', function(req, res) {
  var range = req.query.range;
  ranges = range.split('-');
  ranges[0] = parseInt(ranges[0]);
  ranges[1] = parseInt(ranges[1]);
  var results = [];

  //this is the naive solution in O(n) time
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
