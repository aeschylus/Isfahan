var Isfahan = function(configObject) {
  var _this = this,

  containerSize = (function(containerId) {
    return [document.getElementById(containerId).offsetWidth,
    document.getElementById(containerId).offsetHeight]
  })(configObject.containerId),
  pad = d3_layout_cellPadNull,
  round = Math.round,
  hierarchy = d3.layout.hierarchy(),
  layoutDescription = configObject.layoutDescription;

  function calculateLayout(node) {
    var children = node.children;
    node.type = node.type ? node.type : (children[0].type === "column" ? "row" : "column");

    if (children && children.length) {
      var rect = pad(node),
      type = node.type,
      group = [],
      remaining = children.slice(), // copy-on-write
      child,
      n;
      
      while ((n = remaining.length) > 0) {
        group.push(child = remaining[n - 1]);
        remaining.pop();
      }
      if (group.length) {
        position(group, node.type, rect);
        group.length = 0;
      }
      children.forEach(calculateLayout);
    }
  }
  
  // Positions the specified row of nodes. Modifies `rect`.
  function position(group, type, rect) {
    console.log(type);
    console.log(rect);
    var i = -1,
        n = group.length,
        x = rect.x,
        y = rect.y,
        o;
    if (type === "column") { // vertical subdivision (children are rows)
      while (++i < n) {
        o = group[i];
        o.x = x;
        o.y = (rect.dy/n) * i; // TODO: adjust to siblings.
        o.dx = rect.dx;
        o.dy = rect.dy/n;
      }
    } else { // horizontal subdivision (children are columns)
      while (++i < n) {
        o = group[i];
        o.x = (rect.dx/n) * i; // TODO: adjust to siblings.
        o.y = y;
        o.dx = rect.dx/n;
        o.dy = rect.dy;
      }
    }
  }

  function isfahan(configObject) {
    var nodes = hierarchy(configObject.layoutDescription),
    root = nodes[0];
    size = (function(containerSelector) {
      var width = jQuery(containerSelector).width();
      var height = jQuery(containerSelector).height();

      return [width, height];
    })(configObject.containerSelector);
    root.x = 0;
    root.y = 0;
    root.dx = containerSize[0];
    root.dy = containerSize[1];

    calculateLayout(root);
    isfahan.nodes = nodes;

    return nodes;
  } 

  isfahan.size = function(x) {
    if (!arguments.length) return containerSize;
    containerSize = x;
    return isfahan;
  };
  
  isfahan.round = function(x) {
    if (!arguments.length) return round != Number;
    round = x ? Math.round : Number;
    return treemap;
  };
  
  isfahan.padding = function(x) {
    if (!arguments.length) return padding;

    function padFunction(node) {
      var p = x.call(treemap, node, node.depth);
      return p == null
          ? d3_layout_cellPadNull(node)
          : d3_layout_cellPad(node, typeof p === "number" ? [p, p, p, p] : p);
    }

    function padConstant(node) {
      return d3_layout_cellPad(node, x);
    }

    var type;
    pad = (padding = x) == null ? d3_layout_cellPadNull
        : (type = typeof x) === "function" ? padFunction
        : type === "number" ? (x = [x, x, x, x], padConstant)
        : padConstant;
    return treemap;
  };

  function d3_layout_cellPadNull(node) {
    return {x: node.x, y: node.y, dx: node.dx, dy: node.dy};
  }

  function d3_layout_cellPad(node, padding) {
    var x = node.x + padding[3],
    y = node.y + padding[0],
    dx = node.dx - padding[1] - padding[3],
    dy = node.dy - padding[0] - padding[2];
    if (dx < 0) { x += dx / 2; dx = 0; }
    if (dy < 0) { y += dy / 2; dy = 0; }
    return {x: x, y: y, dx: dx, dy: dy};
  }

  // return d3.rebind(isfahan, hierarchy,"sort", "children", "value");
  return isfahan(configObject);
};
