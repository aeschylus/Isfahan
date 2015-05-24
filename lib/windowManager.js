'use strict';

/* Constructs WindowManagers which offer an interface for
 * manipulating Windows through Tilers. Interfaces with d3 for
 * rendering/drawing.
 *
 * var wm = new Isfahan.WindowManager(...)
 */

var WindowManager = function(options) {      
  this.windows = {};
  this.selectedWindow = options.selectedWindow || null;

  // Tiler; manages layout
  this.tiler = new _isfahan.Tiler({
    bind: options.bind,
    container: options.element,
    layout: options.layout,
    padding: options.padding
  });

  // Callbacks for window creation
  this.onCreate = options.onCreate || function(window) {};
  this.onUpdate = options.onUpdate || function(window) {};
  this.onDelete = options.onDelete || function(window) {};
};
WindowManager.prototype = {

  /* TODO: Returns a deep copy of this workspace's settings, but not
   * its data. This is useful if you want to create a new empty
   * workspace with the same configuration or settings as this one.
   */
  clone: function() {},

  /* TODO: Returns a shallow copy which is an exact replica of this
   * workspace, including its nodes and data.
   */
  copy: function() {},

  /* Get a window by its DOM/d3 element id */
  getWindow: function(id) { return this.windows[id]; },

  /* Grep the tiler layout for node representing id */
  getNode: function(id) { return this.tiler.getNode(id); },

  /*
     Changes focus to the specified Window or, the Window to the
     `direction` ∈ ['l' | 'u' | 'r' | 'd'] of Window.
     */
  select: function(window, direction) {
    var _this = this;
    var node = _this.getNode(window.id);
    // XXX use window.neighbors
    console.log('select this window')
  },

  /* Reset the window manager based on the initial layout and
   * parameters */
  reset: function() {
           this.tiler.reset(); // resets tiler to default layout
           this.render(); // performs tiler.prime()
         },      

  render: function() {
            var _this = this;

            // tiler recalculates size + pos from current state of layout
            _this.tiler.prime();

            var data = _this.tiler.layout.filter(function(d) {
              return !d.children;
            });

            // Data Join.
            var divs = d3.select("#" + _this.element.attr('id'))
              .selectAll(".layout-slot")
              .data(data, function(d) { return d.id; });

            // Update
            // Implicitly updates the existing elements.
            // Must come before the enter function.
            divs.call(cell).each(function(d) {
              _this.onUpdate(_this.getWindow(d.id));
            });

            // Enter
            divs.enter().append("div")
              .attr("class", "layout-slot")
              .attr("data-layout-slot-id", function(d) { return d.id; })
              .call(cell)
              .each(function(d) {
                var $container = jQuery(
                  _this.element.children('div')
                  .filter('[data-layout-slot-id="' + d.id + '"]')[0]
                  );
                var window = new _this.Window({ id: d.id, container: $container });
                _this.windows[d.id] = window;
                _this.onCreate(window);
              });

            // Exit
            divs.exit()
              .remove("div")
              .each(function(d) { _this.onDelete(); });

            function cell() {
              _this
                .style("left", function(d) { return d.x + "px"; })
                .style("top", function(d) { return d.y + "px"; })
                .style("width", function(d) { return Math.max(0, d.dx ) + "px"; })
                .style("height", function(d) { return Math.max(0, d.dy ) + "px"; });
            }
          },

  /* Allows the WindowManager to react to browser events,
   * e.g. resizing
   */
  bindEvents: function() {
                var _this = this;
                d3.select(window).on('resize', function(event) {
                  _this.render();
                });
              }
};

module.exports = function(options) {
  return new WindowManager(options);
};
