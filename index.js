'use strict';
var Promise = require('bluebird');

// purep :: a -> Promise a
exports.purep = Promise.resolve;

// apply :: (a -> b ... -> n -> x) -> [a, b ... n] -> x
exports.apply = function(fn) {
  return function(args) {
    return fn.apply(this, args);
  };
};

exports.curry2 = function(fn) {
  return function (a, b) {
    if (b === undefined) {
      return function(b, c) {
        if (c === undefined) {
          return fn(a, b);
        } else {
          return fn(a, b)(c);
        }
      };
    } else {
      return fn(a, b);
    }
  };
};

// id :: a -> a
exports.id = function(a) {
  return a;
};

// always :: a -> b -> a
// > exports.always(1, 2)
// 1
// > exports.always(1)(2)
// 1
// > exports.always(exports.id)(1, 2)
// 2
// > exports.always(exports.id)(1)(2)
// 2
exports.always = exports.curry2(exports.id);

var slice = Array.prototype.slice;

var toArray = function(a) {
  return slice.call(a);
};

// liftp :: (a -> b -> ... n -> x)
//          -> Promise a -> Promise b -> ... -> Promise n
//          -> Promise x
exports.liftp = function(fn) {
  return function() {
    return Promise.all(toArray(arguments)).then(exports.apply(fn));
  };
};

// alias <* firstp
// firstp :: Promise a -> Promise b -> Promise a
exports.firstp = exports.liftp(exports.always);

// alias *> secondp
// secondp :: Promise a -> Promise b -> Promise b
exports.secondp = exports.liftp(exports.always(exports.id));

// mapp :: (a -> b) -> Promise a -> Promise b
exports.mapp = exports.curry2(function(fn, p) {
  return p.then(fn);
});

// traversep :: (a -> Promise b) -> Array a -> Promise Array b
exports.traversep = function() {

};

// sequensep :: Array Promise a -> Promise Array a
exports.sequensep = function() {

};

