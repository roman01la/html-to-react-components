var fs = require('fs');
var path = require('path');
var assert = require('assert');
var getComponentsLib = require('../lib');
var html = fs.readFileSync(path.join(__dirname, 'basic.html'), 'utf8');
var expected = require('./expected');

function equal(o1, o2) {

  var o1k = Object.keys(o1);
  var o2k = Object.keys(o2);

  if (o1k.length !== o2k.length) {
    return false;
  }

  return o1k.every(function(k) {
    return o1[k] === o2[k];
  });
}

describe('HTML to React components', function() {

  it('should generate ES5 React components', function() {

    assert.ok(equal(expected[0], getComponentsLib(html)));
  });

  it('should generate ES5 React components', function() {

    assert.ok(equal(expected[0], getComponentsLib(html, {
      componentType: 'es5'
    })));
  });

  it('should generate ES6 React components', function() {

    assert.ok(equal(expected[1], getComponentsLib(html, {
      componentType: 'es6'
    })));
  });

  it('should generate stateless React components', function() {

    assert.ok(equal(expected[2], getComponentsLib(html, {
      componentType: 'stateless'
    })));
  });

  it('should generate ES5 React components as ES6 modules', function() {

    assert.ok(equal(expected[3], getComponentsLib(html, {
      moduleType: 'es6'
    })));
  });

  it('should generate ES5 React components as CommonJS modules', function() {

    assert.ok(equal(expected[4], getComponentsLib(html, {
      moduleType: 'cjs'
    })));
  });
});
