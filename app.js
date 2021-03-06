// jsではsortが安定しないのでsort用関数. (e.g.): [ {"???": X, "freq": 4}, {"???": Y, "freq": 33} ] => [ {"???": Y, "freq": 33}, {"???": X, "freq": 4} ]
function compare(dic1, dic2){
  return dic1.freq - dic2.freq;
}

// 有効な品詞群
var validFeature = ["E", "N-nc", "N-pn", "V-c", "F", "J-c", "J-tari"]

function check_wordfreq(tokens){
    var wordfreq = {}

    // 単語の出現頻度数え上げ
    tokens.forEach(function(token){

        word = token[0]
        feature = token[1]

        // 前置詞など不要な単語はカウントせず。inArrayはtrueなら含まれているなら0、そうでないなら-1を返すを思われる
        if($.inArray(feature, validFeature) >= 0){

          if(word in wordfreq){
              wordfreq[word] = wordfreq[word] + 1
          }
          else{
              wordfreq[word] = 1
          }

        }

    })

    wordfreq_dic = []
    for(word in wordfreq){
        wordfreq_dic.push({"text": word, "value": wordfreq[word]})
    }

    return wordfreq_dic
}

var welcome_msg = "Welcome to NlpKit :) NlpKit is a tool to analyze Japanese text easily on your browser. You don't need to install anything. Just copy and paste the text."

// angulerJS controller
angular.module('app', []).controller('mainCtrl', function($timeout, $q) {
    
    // you can use own color converting function if you want
    var my_color = d3.scale.category20();
    var href_func = function(d){ return "#" + d.text }

    var ctrl = this;

    ctrl.msg = welcome_msg
    ctrl.text = ""
    ctrl.lettercount = 0
    ctrl.tokens = [] // format: [ ["tanaka", "N"], ["ga", "X"], ["Work", "V"] ]
    ctrl.wordcount = 0
    ctrl.wordfreq = []

    ctrl.getPromiseTokens = function(text){

        // to embrace by promise
        var defer = $q.defer();
        var worker = new Worker("worker.js");

        worker.postMessage(text)

        worker.onmessage = function(e) {
            return defer.resolve(e.data);
        };

        return defer.promise

    }

    ctrl.clear = function(){
        ctrl.text = ""
        ctrl.lettercount = 0
        ctrl.wordcount = 0
    }

    ctrl.start = function(){
        swal("Good job!", "We start analyzing. It take a bit time to show your result. If the text is too long, this page cannot response for a while, but please hold on...", "success")
        
        ctrl.text = $("#text")[0].value
        ctrl.lettercount = ctrl.text.length
        
        ctrl.getPromiseTokens(ctrl.text)
            .then(Success, Fail)

    }

    function Success(tokens){
        ctrl.tokens = tokens
        ctrl.wordcount = ctrl.tokens.length
        ctrl.text = ctrl.text
        ctrl.wordfreq = check_wordfreq(ctrl.tokens)

        console.log(ctrl.wordfreq)
        makeWordCloud(ctrl.wordfreq, href_func, "#notebook", 500, "wordcloud", "Impact", true, my_color)
        swal("Done Analyzing!!", "Please check out the result!!", "success")
        
    }

    function Fail(data){
        console.log("Fail... what the hell...")
    }

})