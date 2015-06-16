var util = require('util'),
twitter = require('twitter');
var express = require('express')
var app = express()

var twit = new twitter({
        consumerKey: "G3cFcg0CNH7yt2opIs7UBPMiZ",
        consumerSecret: "KWPaEqLQ3234jBylFwFZJfK20VfvY6kjXatfLKUKBZ3iA7YgFB",
        accessToken: "GkMeKQzMrK4SbSaYVhHbjuMpi5MsvatVhPbsLzg",
        accessTokenSecret: "VWpuzF6fatsqee6qCqGoqqrMeXmo4Xju3h9Z162O060hB"    
    });

app.get('/', function (req, res) {

  twit.get('/search/tweets.json', {"q":"#Node"}, function(data) {
    console.log(data);
    res.send(data)
  });

})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})