
var fill = d3.scale.category20();

// windowオブジェクトのプロパティにすることでmakeWordCloudを他のファイルから呼び出せるようにする
window.makeWordCloud = function(wordfreqs, parent_elem, svgscale){

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
  }