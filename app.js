
// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

// jsではsortが安定しないのでsort用関数. (e.g.): [ [X, 4], [Y, 33] ] => [ [Y, 33], [X, 4] ]
var compare = function(arr1, arr2){
  return arr1[1] - arr2[1];
}

// ユーザーがコピペしたテキストを取得する(angularを利用して瞬時に取得する)
// 取得したテキストを形態素解析にかける(token化)
var check_wordfreq = function(tokens){
    var wordfreq = {}

    // 単語の出現頻度数え上げ
    tokens.forEach(function(token){

        word = token[0]

        if(word in wordfreq){
            wordfreq[word] = wordfreq[word] + 1
        }
        else{
            wordfreq[word] = 1
        }
    })

    // Hashmap => Sorted Array by Word Frequency
    sorted_wordfreq = []
    for(word in wordfreq){
        sorted_wordfreq.push([word, wordfreq[word]])
    }

    sorted_wordfreq.sort(compare)
    sorted_wordfreq.reverse()
    console.log(sorted_wordfreq)
    return sorted_wordfreq
}

// tokensをまとめてwordcountする

// wordcount結果を表示する
var mainCtrl = function($scope) {
  
    $scope.message = "NlpKitへようこそ！下の入力欄に解析したい文章をコピペしてください！長い文章だと少々時間がかかります！"

    $scope.report = ""

    $scope.text = ""
    $scope.tokens = [] // format: [ ["tanaka", "N"], ["ga", "X"], ["Work", "V"] ]
    $scope.wordcount = 0
    $scope.wordfreq = []

    //ユーザーがコピペしたテキストを取得する(angularを利用して瞬時に取得する)
    $scope.$watch("text", function(newValue, oldValue){
        $scope.wordcount = newValue.length
        $scope.tokens = rma.tokenize(newValue)
        $scope.text = newValue
        $scope.wordfreq = check_wordfreq($scope.tokens)
    });

    $scope.analyze = function(){
        
    }

    $scope.clear = function(){
        $scope.text = ""
    }

}
