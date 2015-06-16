var util = require('util'),
twitter = require('twitter');

var twit = new twitter({
        consumerKey: "G3cFcg0CNH7yt2opIs7UBPMiZ",
        consumerSecret: "KWPaEqLQ3234jBylFwFZJfK20VfvY6kjXatfLKUKBZ3iA7YgFB",
        accessToken: "GkMeKQzMrK4SbSaYVhHbjuMpi5MsvatVhPbsLzg",
        accessTokenSecret: "VWpuzF6fatsqee6qCqGoqqrMeXmo4Xju3h9Z162O060hB"    
    });

//キーワードで検索
twit.get('/search/tweets.json', {"q":"#Node"}, function(data) {
    console.log(data);
});
