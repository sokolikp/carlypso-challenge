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

// var merge = function(left, right, param) {
//   var result  = [];
//   var leftIndex = 0, rightIndex = 0;
//   var leftCompare, rightCompare;

//   while (leftIndex < left.length && rightIndex < right.length){
//     if(parseInt(left[leftIndex][param])) {
//       console.log('I am a number');
//       leftCompare = parseInt(left[leftIndex][param]);
//       rightCompare = parseInt(right[rightIndex][param]);
//     } else { //if string or undefined
//       console.log('I am a string');
//       leftCompare = left[leftIndex][param];
//       rightCompare = right[rightIndex][param];
//     }
//     if (leftCompare < rightCompare){
//         result.push(left[leftIndex++]);
//     } else {
//         result.push(right[rightIndex++]);
//     }
//   }
//   console.log(result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex)));
//   console.log('next');
//   return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
// };

// var mergeSort = function(collection, param) {
//   if(collection.length < 2) {
//       return collection;
//   }
//   var middle = Math.floor(collection.length / 2);
//   var left    = collection.slice(0, middle);
//   var right   = collection.slice(middle);

//   return merge(mergeSort(left), mergeSort(right), param);
// };

var sortCarData = function(collection, param) {
  var numbers = ['year', 'odometer', 'condition', 'price'];

  var sorted = [];
  sorted = collection.sort(function(a,b) {
    console.log(a[param], b[param]);
    if(a[param] === undefined && b[param] !== undefined) {
      return 1;
    } else if(a[param] !== undefined && b[param] === undefined) {
      return -1;
    } else if(numbers.indexOf(param)) { //number data
      return b[param]-a[param];
    } else {
      return a[param] < b[param] ? -1 : 1;
    }
  });

  return sorted;
};

app.get('/sort', function(req, res) {
  console.log('requesting', req.query);
  // res.send(req.query);
  var sorted;
  var sort = req.query;
  for(var key in sort) {
    console.log('sorting on', key);
    sorted = sortCarData(carData, key);
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
    if(carData[i].price >= ranges[0] && carData[i].price <= ranges[1]) {
      results.push(carData[i]);
    }
  }

  res.send(results);
});

app.listen(port);
console.log('Server now listening on port ' + port);

module.exports = app;
