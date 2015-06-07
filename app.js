
  var fill = d3.scale.category20();

  function makeWordCloud(wordfreqs){
    var sizeScale = d3.scale.linear().domain([0, 5]).range([10, 100])

    d3.layout.cloud().size([300, 300])
      .words(wordfreqs)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return sizeScale(d.freq); })
      .on("end", draw)
      .start();
  }
  function draw(words) {
    d3.select("svg").remove()
    d3.select("#notebook").append("svg")
        .attr("width", 500)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.word; });
  }


// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

// jsではsortが安定しないのでsort用関数. (e.g.): [ [X, 4], [Y, 33] ] => [ [Y, 33], [X, 4] ]
var compare = function(dic1, dic2){
  return dic1.freq - dic2.freq;
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
        sorted_wordfreq.push({"word": word, "freq": wordfreq[word]})
    }

    sorted_wordfreq.sort(compare)
    sorted_wordfreq.reverse()
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
        console.log($scope.wordfreq)
        makeWordCloud($scope.wordfreq)
    });

    $scope.analyze = function(){
        
    }

    $scope.clear = function(){
        $scope.text = ""
    }

}

// wordcloud

  