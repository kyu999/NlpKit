d3.json("demo.json", function(error, classes) {

  if (error) throw error;
  //console.log("class amount is " + classes.length)
  //makeHierarchicalEdge(classes, 960)

})

var data = [
// {"name":"X","size":3,"imports":["dlkfd;sakjdsa;l"]},
// like above, if the data contains not existing pointer, it ruins everything. Need to validation, and throw error if find weired data or we can change to ignoring
// also, the string pointer is not efficient, so better to just look at index
{"name":"tanaka","imports":["higashi"]},
{"name":"higashi","imports":["suzuki","toudou"]},
{"name":"suzuki","imports":["tanaka", "higashi"]},
{"name":"toudou","imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka2","imports":["higashi"]},
{"name":"higashi2","imports":["suzuki","toudou"]},
{"name":"suzuki2","imports":["tanaka", "higashi"]},
{"name":"toudou2","imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka3","imports":["higashi"]},
{"name":"higashi3","imports":["suzuki","toudou"]},
{"name":"suzuki3","imports":["tanaka", "higashi"]},
{"name":"toudou3","imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka4","imports":["higashi"]},
{"name":"higashi4","imports":["suzuki","toudou"]},
{"name":"suzuki4","imports":["tanaka", "higashi"]},
{"name":"toudou4","imports":["tanaka", "higashi", "suzuki"]},
{"name":"tanaka5","imports":["higashi"]},
{"name":"higashi5","imports":["suzuki","toudou"]},
{"name":"suzuki5","imports":["tanaka", "higashi"]},
{"name":"0XXXXXXXXXXXXXX0","imports":["tanaka", "higashi", "suzuki"]}
]

console.log(data)

var dom_classes = {
      "node": "node_default",
      "link": "link_default",
      "in_node": "linked_node",
      "out_node": "linking_node",
      "in_link": "linked",
      "out_link": "linking"
    }

//makeHierarchicalEdge(data, 300, 200, 10, 30, "white")

makeHierarchicalEdge(data, 300, 200, 10, 30, dom_classes)