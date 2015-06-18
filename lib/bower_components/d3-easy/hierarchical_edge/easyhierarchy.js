function makeHierarchicalEdge(classes, innerRadius, thickness, minFont, maxFont, dom_classes){

  if(dom_classes == null){

    var dom_classes = {
      "node": "node_default",
      "link": "link_default",
      "in_node": "linked_node",
      "out_node": "linking_node",
      "in_link": "linked",
      "out_link": "linking"
    }

  }

  var imports_max =  d3.max(classes, function(d){ return d.imports.length } );
  var sizeScale = d3.scale.linear().domain([0, imports_max]).range([minFont, maxFont])

  var unit = innerRadius / 3
      radius = innerRadius + thickness
      diameter = radius * 2
      
  var cluster = d3.layout.cluster()
      .size([360, innerRadius])
      .value(function(d) { return d.size; });

  var bundle = d3.layout.bundle();

  var line = d3.svg.line.radial()
      .interpolate("bundle")
      .tension(.85)
      .radius(function(d) { return d.y; })
      .angle(function(d) { return d.x / 180 * Math.PI; });

  var svg = d3.select("body").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  var link = svg.append("g").selectAll("." + dom_classes["link"]),
      node = svg.append("g").selectAll("." + dom_classes["node"]);

  var nodes = cluster.nodes(packageHierarchy(classes)),
      links = packageImports(nodes);

    link = link
        .data(bundle(links))
      .enter().append("path")
        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", dom_classes["link"])
        .attr("d", line);

    node = node
        .data(nodes.filter(function(n) { return !n.children; }))
      .enter().append("text")
        .attr("class", dom_classes["node"])
        .attr("dy", ".31em")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .style("font-size", function(d) { /*console.log(d); */ return sizeScale(d.imports.length) + "px"; })        
        .text(function(d) { return d.key; })
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted);

  function mouseovered(d) {
    node
        .each(function(n) { n.target = n.source = false; });

    link
        .classed(dom_classes["out_link"], function(l) { if (l.target === d) return l.source.source = true; })
        .classed(dom_classes["in_link"], function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    node
        .classed(dom_classes["out_node"], function(n) { return n.target; })
        .classed(dom_classes["in_node"], function(n) { return n.source; });
  }

  function mouseouted(d) {
    link
        .classed(dom_classes["out_link"], false)
        .classed(dom_classes["in_link"], false);

    node
        .classed(dom_classes["out_node"], false)
        .classed(dom_classes["in_node"], false);
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
      find(d.name, d)
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






/*

the size value of classes did not work. so i deleted.

*/