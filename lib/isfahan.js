'use strict';

var wm = require('./windowManager');

function Isfahan(options) {
  console.log(options);
}

Isfahan.prototype = {
};

module.exports = function(options) {
    return new Isfahan(options);
};
