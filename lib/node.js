'use strict';

var Node = function(type, parent) {
  this.type = type;
  this.id = this.uuid();
  this.parent = parent;
};

Node.prototype = {

  uuid: function() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
            });
        },

  index: function() {
           return this.parent.children.indexOf(this);
         },

  // Auxilary function to retrieve neighbors
  neighbors: function() {
               return this.parent.children;
             },

  /* Insert a node above or below this node. Transforms both
   * the target node and its parent.
   * The old linked-list insert switch'aroo:
   - parent is this node's original parent.
   - point newParent's parent to this's parent
   - this node's parent becomes newParent
   */
  insertVertically: function(after) {
                      var _this = this;
                      // _tiler.layout.push(newParent, newSibling)
                    },

  insertHorizontally: function(after) {

                      },

  delete: function() {
            /* TODO:
               var index = this.index();
               if (this.parent.children.length === 2) {
            // remove this node from parent's children
            this.parent.children.splice(index, 1);

            // Since there are only 2 children of parent, and we just
            // deleted one of them (this), the parent ceases to serve any
            // purpose. Thus, we convert sibling into its own parent and
            // delete the antiquated parent reference.
            var sibling = this.parent.children[0];
            sibling.parent.id = sibling.id; // override parent
            delete this.parent;
            } else if (this.parent.children.length > 2) { 
            // If the node is one of more than 2 siblings,
            // simply splice it out of the parent's children 
            // array.
            this.parent.children.splice(index, 1);
            }
            */
          }
};

module.exports = function(options) {
  return new Node(options);
};
