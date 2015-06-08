// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

// jsではsortが安定しないのでsort用関数. (e.g.): [ {"???": X, "freq": 4}, {"???": Y, "freq": 33} ] => [ {"???": Y, "freq": 33}, {"???": X, "freq": 4} ]
function compare(dic1, dic2){
  return dic1.freq - dic2.freq;
}

// 有効な品詞群
var validFeature = ["E", "N-n", "N-nc", "N-pn", "V-c", "F", "J-c", "J-tari"]

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

    // Hashmap => Sorted Array by Word Frequency
    sorted_wordfreq = []
    for(word in wordfreq){
        sorted_wordfreq.push({"word": word, "freq": wordfreq[word]})
    }

    sorted_wordfreq.sort(compare)
    sorted_wordfreq.reverse()
    return sorted_wordfreq
}

var welcome_msg = "Welcome to NlpKit :) NlpKit is a tool to analyze Japanese text easily on your browser. You don't need to install anything. Just copy and paste the text."

function startMsg(value){
    if(value.length < 3){
        return welcome_msg
    }else{
        return "Wait a moment... It take a bit time to show your result."
    }
}

function finishMsg(value){
    if(value.length < 3){
        return welcome_msg
    }else{
        return "Done Analyzing!! Please check out the result!!"
    }
}

// angulerJS controller
function mainCtrl($scope) {

    $scope.text = ""
    $scope.lettercount = 0
    $scope.tokens = [] // format: [ ["tanaka", "N"], ["ga", "X"], ["Work", "V"] ]
    $scope.wordcount = 0
    $scope.wordfreq = []

    //ユーザーがコピペしたテキストが変更されるたびに実行
    $scope.$watch("text", function(newValue, oldValue){
        $scope.msg = startMsg(newValue)
        $scope.lettercount = newValue.length
        $scope.tokens = rma.tokenize(newValue)
        $scope.wordcount = $scope.tokens.length
        $scope.text = newValue
        $scope.wordfreq = check_wordfreq($scope.tokens)

        // グローバス関数呼び出し
        window.makeWordCloud($scope.wordfreq, "#notebook", 500)

        $scope.msg = finishMsg(newValue)
    });

    $scope.clear = function(){
        $scope.text = ""
    }

}
  