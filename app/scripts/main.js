var Isfahan = (function() {
  
  var isfahan = function(configObject) {
    var isfahan = {};

    var hierarchy = d3.layout.hierarchy(),
    layoutDescription = configObject.layoutDescription,
    nodes = d3.layout.hierarchy(layoutDescription.layout);
    return nodes; 
  };

  return d3.rebind(isfahan, d3.layout.hierarchy, "sort", "children", "value");

})();
