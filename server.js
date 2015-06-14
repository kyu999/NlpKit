var w2v = require('word2vec');
var fs = require('fs');
var kuromoji = require("kuromoji");

// create wakati file
/*
fs.readFile("raw.txt", "utf-8", function(err, data){

    console.log("raw data")
    console.log(data)

    kuromoji.builder({ dicPath: "node_modules/kuromoji/dist/dict/" }).build(function (err, tokenizer) {
        var tokens = tokenizer.tokenize(data);
        console.log("tokens")
        console.log(tokens)

        var wakati_data = ""
        tokens.forEach(function(d){
            wakati_data = wakati_data + " " + d.surface_form
        })

        console.log("start write wakati.txt")
        fs.writeFile("wakati.txt", wakati_data, function(write_err){ console.log(write_err) })
        console.log("done write wakati.txt")

    });

})
*/


w2v.loadModel("wakati.txt", function(err, model){

  console.log(model)
  console.log(model.mostSimilar('国', 20))

});

/*

3. try similarities: => fuck. Because of Japanese? gensim(python package) works well... what the fuck.
    => change server from js to python? or create python task runner remaining js as server lang
4. come up with ideas that convert this similarities data into hierarchical format data
5. draw hierarchy in practice(not connect server and client yet. just read file and construct)
6. maybe, browser do not allow it to read and write local file
7. study the way to R&W by browser
8. connect everyting together

*/