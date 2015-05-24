'use strict';

var _wm = this; // ref to window manager
var Window = function(id, container, buffer) {
  return {
    "id": id,
      "container": container,
      "buffer": buffer // object storing user's data
  }
};
Window.prototype = {
  /* Sets the buffer contents of the Window */
  set: function(buffer) {
         this.buffer = buffer;
       },

  /* Remove this window. Calls to this WindowManager's Tiler
   * to remove this Window and its underlying node from the
   * layout. If this window is selectedWindow, should delegate
   * its selectedness to closest neighbor or parent (or null)
   */
  remove: function() {
            var _this = this;
            _wm.tiler.node.delete(this.id);
            if (_wm.selectedWindow.id === this.id) {
              // XXX TODO: Select one of this window's nearest
              // neighbors or parent and update selectedWindow.
              _this.selectedWindow = null;
            }
            delete _wm.windows[this.id];
            _wm.render();
          },

  /* Retrieves a list of windows neighboring this one. Useful
   * for selecting a neighboring window.
   */
  neighbors: function() { console.log('neighbors'); },

  /* Declare this window to be currently selected */
  select: function() { console.log('select'); },

  /* Splitting */
  vsp: function(after) {
    var _this = this;
    var node = _wm.getNode(_this.id);
    var offset = direction === 'd' ? 1 : 0;
    if (node.type === 'column') {
      node.insertParent(offset);
    } else {
      node.insertSibling(offset);
    }
    return node;
  },

  /* Performs a horizontal split */
  hsp: function(after) {
         var _this = this;
         var node = _wm.getNode(_this.id);
         var offset = direction === 'r' ? 1 : 0;
         if (node.type === 'column') {
           node.insertSibling(offset);
         } else {
           node.insertParent(offset);
         }
         return node;
       },

  split: function(window, direction, after) {
           var _this = this;
           var node = (function insert() {
             if (['l', 'r'].indexOf(direction) != -1) {
               _this.splitHorizontally(window, after);
             } else { 
               _this.splitVertically(window, after);
             }
           })();
           // recalculates via _this.tiler.prime()
           _this.render();
         }  
};

module.exports = function(options) {
  return new Window(options);
};
