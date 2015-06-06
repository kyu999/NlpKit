// 形態素解析のためにkuromojiをロードする
var DIC_URL = "dictionary/";

tokenizer = null;
kuromoji.builder({ dicPath: DIC_URL }).build(function (error, _tokenizer) {
    tokenizer = _tokenizer
});

console.log(tokenizer.tokenize("俺は空を飛ぶ"));

// ユーザーがコピペしたテキストを取得する(angularを利用して瞬時に取得する)

// 取得したテキストを形態素解析にかける(token化)

var check_wordfreq = function(text){

}

// tokensをまとめてwordcountする

// wordcount結果を表示する
var mainCtrl = function($scope) {

    $scope.message = "どすこい解析器へようこそ！下の入力欄に解析したい文章をコピペしたください！長い文章だと少々時間がかかります！"

    $scope.report = ""

    $scope.text = ""
    $scope.tokens = []
    $scope.wordcount = 0
    $scope.wordlist = []
    $scope.wordfreq = [
        {"name" : "tanaka", "freq" : 20}, 
        {"name" : "yamada", "freq" : 11}, 
        {"name" : "oga", "freq" : 7}
    ]

    //ユーザーがコピペしたテキストを取得する(angularを利用して瞬時に取得する)
    $scope.$watch("text", function(newValue, oldValue){
        $scope.wordcount = newValue.length
        /*
        if($scope.wordcount > 1){
            $scope.message = "現在解析中。。。ちょいおまち！"
        }
        */

        $scope.tokens = rma.tokenize(newValue)
        $scope.text = newValue

        //if($scope.wordcount > 1){ $scope.message = "解析終了！"; }

    });

    $scope.analyze = function(){
        
    }

}