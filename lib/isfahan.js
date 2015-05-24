var node = require('./node');

function Isfahan(options) {
  node();
}

Isfahan.prototype = {
  myMethod: function() {
              console.log('I am a method');
              console.log('you might even say a new new new method');
            }
}

window.isfahan = function(options) {
    return new Isfahan(options);
}
