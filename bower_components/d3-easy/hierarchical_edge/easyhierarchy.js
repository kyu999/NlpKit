function makeHierarchicalEdge(classes, diameter){

  // The gap between radius, innerRadius, and font-size determins how many letters can accept, so need to cul in advance

  // by culc., when the diameter size is less than 4 times of data amount, crumble layout 
  if(diameter < classes.length * 4){ console.log("The number of classes is too much. Need to expand diameter or reduce class amount.")}

  var unit = diameter / 8  // base number
      radius = diameter / 2,
      innerRadius = radius - unit; // just culc.
      // even the diameter is big enough, this innerRadius could shrink whole the circle size. this should be culculated by number of elements and font size

  // the size represents not only just width but also degree of circle
  var cluster = d3.layout.cluster()
      .size([360, innerRadius]) // cluster size: size[width, height], so in this case size(360, 960 - 120 = 840) => 
      .sort(null)
      .value(function(d) { return d.size; });

  var bundle = d3.layout.bundle();

  var line = d3.svg.line.radial()
      .interpolate("bundle")
      .tension(.85) // tries 3.85 => disaster
      .radius(function(d) { return d.y; })
      .angle(function(d) { return d.x / 180 * Math.PI; });

  var svg = d3.select("body").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  var link = svg.append("g").selectAll(".link"),
      node = svg.append("g").selectAll(".node");

  // use data from here? but perhaps need to modify from the fop
  var nodes = cluster.nodes(packageHierarchy(classes)),
      links = packageImports(nodes);

  link = link
      .data(bundle(links))
      .enter().append("path")
        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line);

  node = node
      .data(nodes.filter(function(n) { return !n.children; }))
      .enter().append("text")
        .attr("class", "node")
        .attr("dy", "5.31em")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .text(function(d) { return d.key; })
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted);

  function mouseovered(d) {
    node
      .each(function(n) { n.target = n.source = false; });

    link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
  }

  function mouseouted(d) {
    link
        .classed("link--target", false)
        .classed("link--source", false);

    node
        .classed("node--target", false)
        .classed("node--source", false);
  }

  d3.select(self.frameElement).style("height", diameter + "px");

  // Lazily construct the package hierarchy from class names.
  function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
      var node = map[name], i;
      if (!node) {
        node = map[name] = data || {name: name, children: []};
        if (name.length) {
          node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
          node.parent.children.push(node);
          node.key = name.substring(i + 1);
        }
      }
      return node;
    }

    classes.forEach(function(d) {
      find(d.name, d);
    });

    return map[""];
  }

  // Return a list of imports for the given array of nodes.
  function packageImports(nodes) {
    var map = {},
        imports = [];

    // Compute a map from name to node.
    nodes.forEach(function(d) {
      map[d.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
      if (d.imports) d.imports.forEach(function(i) {
        imports.push({source: map[d.name], target: map[i]});
      });
    });

    return imports;
  }

}