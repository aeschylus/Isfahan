'use strict';
/*
   The Tiler is responsible for maintaining an internal
   representation of the windowmanager's Windows. Tiler calculates
   the dimensions and positions of each Window within the hierarchy,
   via the use of Nodes and layout.
   */
var Tiler = function(settings) {
  this.settings = settings;
  this.bind = settings.bind; // DOM element to bind
  this.container = settings.container || 
    jQuery('<div id="windowManager">');

  this.padding = settings.padding || 0;
  this.pad = d3_layout_cellPadNull,
    this.hierarchy: d3.layout.hierarchy(),

    // inject WindowManager container element into bound element,
    // but only at init, not for reset.
    this.container.appendTo(this.bind);
  this.init(settings);
};

Tiler.prototype = {

  init: function() {
          this.layout = this.settings.layout || {type: "row"};
          this.nodes = this.hierarchy(settings.layout);
        },
  reset: function() {
           this.init();
         },

  /* Called by WindowManager render */
  prime: function() { 
           var _this = this;

           function divisor(node, row, rect, group, n) {

             var old = false,
                 dimension = row ? 'dy' : 'dx',
                 total = rect[dimension],
                 divisor;
             // if not already set, divide equally.
             group.forEach(function(item) {
               if (!item[dimension] === undefined) { 
                 old = true;
               }
             });

             if (old) {
               console.log('preserved');
               var sum = group.reduce(
                   function(previousValue, currentValue, index, array) {
                     return previousValue[dimension] + currentValue[dimension];
                   });
               console.log('sum: ' + sum);

               divisor = (node[dimension]/sum)*total;
               console.log("divisor: "+divisor);
               return divisor;
             } else {
               return n;
             }
           }

           /* Positions the specified row of nodes. Modifies `rect`. The
              ternary statements, specify whether a particular child is a
              row or not. Allows easy, centralised description of the
              parameter calculations that can be switched from row to
              column.
              */
           function position(group, type, rect) {
             var i = -1,
                 row = (groupType === "row") ? false : true,
                 n = group.length,
                 x = rect.x,
                 y = rect.y,
                 o;
             var offset = 0;
             while (++i < n) {
               o = group[n-(i+1)],
                 d = divisor(o, row, rect, group, n),
                   o.id = typeof o.id !== 'undefined' ? o.id : genUuid(),
                   o.x = row ?  x : x + offset,
                   o.y = row ? y + offset : y,
                   o.dx = row ? rect.dx : rect.dx/d,
                   o.dy = row ? rect.dy/d : rect.dy,
                   offset += row ? o.dy : o.dx;
             }
           }

           function calculateLayout(node) {
             var children = node.children;

             if (children && children.length) {
               var rect = _this.pad(node),
                 type = node.type,
                      group = [],
                      remaining = children.slice(), // copy-on-write
                      child,
                      n;

               while ((n = remaining.length) > 0) {
                 group.push(child = remaining[n - 1]);
                 remaining.pop();
               }

               position(group, node.type, rect);
               children.forEach(function(child, index) {
                 child.address = node.address.concat("." + child.type + (index + 1));
               })
               children.forEach(calculateLayout);
             }
           }

           var nodes = hierarchy(_this.layout);
           root = nodes[0];
           root.x = 0;
           root.y = 0;
           root.dx = containerSize(containerId)[0];
           root.dy = containerSize(containerId)[1];
           root.address = root.type + "1";
           root.id = root.id || genUuid();

           _this.calculateLayout(root);
           _this.padding(padding);
           nodes = nodes.map(function(node) {
             return merge(node, pad(node));
           });

           _this.layout = nodes;
         },

  getNode: function(id) {
             return jQuery.grep(this.layout, function(node) {
               return node.id === id;
             })[0];
           }
}
