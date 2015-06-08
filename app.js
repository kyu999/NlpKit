// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

// jsではsortが安定しないのでsort用関数. (e.g.): [ {"???": X, "freq": 4}, {"???": Y, "freq": 33} ] => [ {"???": Y, "freq": 33}, {"???": X, "freq": 4} ]
var compare = function(dic1, dic2){
  return dic1.freq - dic2.freq;
}

// 有効な品詞群
var validFeature = ["E", "N-n", "N-nc", "N-pn", "V-c", "F", "J-c", "J-tari"]
console.log(validFeature)

// ユーザーがコピペしたテキストを取得する(angularを利用して瞬時に取得する)
// 取得したテキストを形態素解析にかける(token化)
var check_wordfreq = function(tokens){
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

// angulerJS controller
var mainCtrl = function($scope) {

    $scope.text = ""
    $scope.tokens = [] // format: [ ["tanaka", "N"], ["ga", "X"], ["Work", "V"] ]
    $scope.wordcount = 0
    $scope.wordfreq = []

    //ユーザーがコピペしたテキストが変更されるたびに実行
    $scope.$watch("text", function(newValue, oldValue){
        $scope.lettercount = newValue.length
        $scope.tokens = rma.tokenize(newValue)
        $scope.wordcount = $scope.tokens.length
        $scope.text = newValue
        $scope.wordfreq = check_wordfreq($scope.tokens)

        // グローバス関数呼び出し
        window.makeWordCloud($scope.wordfreq, "#notebook", 500)
    });

    $scope.clear = function(){
        $scope.text = ""
    }

}
  