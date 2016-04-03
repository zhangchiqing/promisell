'use strict';

var Promise = require('bluebird');
var liftp = require('./index').liftp;
var firstp = require('./index').firstp;
var secondp = require('./index').secondp;
var purep = require('./index').purep;
var expect = require('chai').expect;

var add = function(a, b) {
  return a + b;
};

describe('liftp', function() {
  it('success', function() {
    return liftp(add)(Promise.resolve(1), Promise.resolve(2))
    .then(function(r) {
      expect(r).to.equal(3);
    });
  });

  it('fail first', function() {
    return liftp(add)(Promise.reject(1), Promise.resolve(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });

  it('fail second', function() {
    return liftp(add)(Promise.resolve(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(2);
    });
  });

  it('fail both', function() {
    return liftp(add)(Promise.reject(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });

});

describe('firstp', function() {
  it('success', function() {
    return firstp(Promise.resolve(1), Promise.resolve(2))
    .then(function(r) {
      expect(r).to.equal(1);
    });
  });

  it('fail first', function() {
    return firstp(Promise.reject(1), Promise.resolve(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });

  it('fail second', function() {
    return firstp(Promise.resolve(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(2);
    });
  });

  it('fail both', function() {
    return firstp(Promise.reject(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });
});

describe('secondp', function() {
  it('success', function() {
    return secondp(Promise.resolve(1), Promise.resolve(2))
    .then(function(r) {
      expect(r).to.equal(2);
    });
  });

  it('fail first', function() {
    return secondp(Promise.reject(1), Promise.resolve(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });


  it('fail second', function() {
    return secondp(Promise.resolve(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(2);
    });
  });


  it('fail both', function() {
    return secondp(Promise.reject(1), Promise.reject(2))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal(1);
    });
  });
});

describe('validation', function() {
  var query = function(email, password) {
    return { email: email, password: password };
  };

  var notEmpty = function(field) {
    return function(a) {
      if (!a) {
        return Promise.reject('Field ' + field + ' cannot be empty');
      } else {
        return Promise.resolve(a);
      }
    };
  };

  it('should success', function() {
    var q = { email: 'a@b.c', password: 'ppp' };
    return liftp(query)(
      secondp(notEmpty('email')(q.email), purep(q.email)),
      secondp(notEmpty('password')(q.password), purep(q.password)))
    .then(function(validQ) {
      expect(validQ).to.eql(q);
    });
  });

  it('should fail if mising field', function() {
    var q = { email: 'a@b.c', password: undefined };
    return liftp(query)(
      secondp(notEmpty('email')(q.email), purep(q.email)),
      secondp(notEmpty('password')(q.password), purep(q.password)))
    .then(function() {
      throw new Error('should fail');
    })
    .catch(function(r) {
      expect(r).to.equal('Field password cannot be empty');
    });
  });
});
