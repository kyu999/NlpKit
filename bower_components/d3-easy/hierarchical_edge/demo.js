d3.json("demo.json", function(error, classes) {

  if (error) throw error;
  console.log("class amount is " + classes.length)
  makeHierarchicalEdge(classes, 880)

})

var data = [
{"name":"tanaka","size":3,"imports":["higashi"]},
{"name":"higashi","size":1,"imports":["suzuki","toudou"]},
{"name":"suzuki","size":3,"imports":["tanaka", "higashi"]},
{"name":"toudou","size":4,"imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka2","size":3,"imports":["higashi"]},
{"name":"higashi2","size":1,"imports":["suzuki","toudou"]},
{"name":"suzuki2","size":3,"imports":["tanaka", "higashi"]},
{"name":"toudou2","size":4,"imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka3","size":3,"imports":["higashi"]},
{"name":"higashi3","size":1,"imports":["suzuki","toudou"]},
{"name":"suzuki3","size":3,"imports":["tanaka", "higashi"]},
{"name":"toudou3","size":4,"imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka4","size":3,"imports":["higashi"]},
{"name":"higashi4","size":1,"imports":["suzuki","toudou"]},
{"name":"suzuki4","size":3,"imports":["tanaka", "higashi"]},
{"name":"toudou4","size":4,"imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka5","size":3,"imports":["higashi"]},
{"name":"higashi5","size":1,"imports":["suzuki","toudou"]},
{"name":"suzuki5","size":3,"imports":["tanaka", "higashi"]},
{"name":"toudou5","size":4,"imports":["tanaka", "higashi", "suzuki"]}
]

console.log(data)

makeHierarchicalEdge(data, 280)