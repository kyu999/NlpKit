
var fill = d3.scale.category20();

  var makeWordCloud = function(wordfreqs, parent_elem, svgscale){

      d3.select("svg").remove()

      var freq_max =  d3.max(wordfreqs, function(wf){ return wf.freq } );
      var sizeScale = d3.scale.linear().domain([0, freq_max]).range([0, 1])

      wordfreqs = wordfreqs.map(function(d) {
        return {text: d.word, size: 10 + sizeScale(d.freq) * 90};
      })

      d3.layout.cloud().size([svgscale, svgscale])
      .words(wordfreqs)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

      function draw(words) {
        d3.select(parent_elem).append("svg")
            .attr("width", svgscale)
            .attr("height", svgscale)
          .append("g")
            .attr("transform", "translate(" + svgscale / 2 + "," + svgscale / 2 + ")")
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
            .text(function(d) { return d.text; });
      }
  }


// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

// jsではsortが安定しないのでsort用関数. (e.g.): [ [X, 4], [Y, 33] ] => [ [Y, 33], [X, 4] ]
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

        // 前置詞など不要な単語はカウントせず
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

// tokensをまとめてwordcountする

// wordcount結果を表示する
var mainCtrl = function($scope) {
  
    $scope.message = "NlpKitへようこそ！下の入力欄に解析したい文章をコピペしてください！長い文章だと少々時間がかかります！"

    $scope.report = ""

    $scope.text = ""
    $scope.tokens = [] // format: [ ["tanaka", "N"], ["ga", "X"], ["Work", "V"] ]
    $scope.wordcount = 0
    $scope.wordfreq = []

    //ユーザーがコピペしたテキストが変更されるたびに実行
    $scope.$watch("text", function(newValue, oldValue){
        $scope.wordcount = newValue.length
        $scope.tokens = rma.tokenize(newValue)
        $scope.text = newValue
        $scope.wordfreq = check_wordfreq($scope.tokens)

        makeWordCloud($scope.wordfreq, "#notebook", 500)
    });

    $scope.clear = function(){
        $scope.text = ""
    }

}
  