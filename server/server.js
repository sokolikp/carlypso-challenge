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

var merge = function(left, right, param) {
  var result  = [];
  var leftIndex = 0;
  var rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length){
    console.log(left[leftIndex][param], right[rightIndex][param]);
    if (left[leftIndex][param] < right[rightIndex][param]){
        result.push(left[leftIndex++]);
    } else {
        result.push(right[rightIndex++]);
    }
  }
  console.log(result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex)));
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

var mergeSort = function(collection, param) {
  if(collection.length < 2) {
      return collection;
  }
  var middle = Math.floor(collection.length / 2);
  var left    = collection.slice(0, middle);
  var right   = collection.slice(middle);

  return merge(mergeSort(left), mergeSort(right), param);
};

app.get('/sort', function(req, res) {
  console.log('requesting', req.query);
  // res.send(req.query);
  var sorted;
  var sort = req.query;
  for(var key in sort) {
    console.log('sorting on', key);
    sorted = mergeSort(carData, key);
  }
  res.send(sorted);
});

app.get('/range', function(req, res) {
  var range = req.query.range;
  ranges = range.split('-');
  ranges[0] = parseInt(ranges[0]);
  ranges[1] = parseInt(ranges[1]);
  var results = [];

  for(var i=0; i<carData.length; i++) {
    console.log(carData[i].price);
    console.log(ranges[0], ranges[1]);
    if(carData[i].price >= ranges[0] && carData[i].price <= ranges[1]) {
      results.push(carData[i]);
    }
  }

  res.send(results);
});

app.listen(port);
console.log('Server now listening on port ' + port);

module.exports = app;
