var fs = require('fs');
var path = require('path');
var assert = require('assert');
var getComponentsLib = require('../lib');
var html = readFile('basic.html');
var expected = require('./expected');

function readFile(file) {
  return fs.readFileSync(path.join(__dirname, file), 'utf8');
}

function assertKeysEqual(o1, o2) {
  var o1k = Object.keys(o1);
  var o2k = Object.keys(o2);

  try {
    assert.equal(o1k.length, o2k.length);

    o1k.forEach(function(key) {
      assert.ok(o2.hasOwnProperty(key));
    });
  } catch (err) {
    err.expected = o1k;
    err.actual = o2k;
    err.showDiff = true;
    throw err;
  }

}

function equal(o1, o2) {

  assertKeysEqual(o1, o2);

  try {
    Object.keys(o1).forEach(function(key) {
      assert.equal(o1[key], o2[key]);
    });
  } catch (err) {
    err.expected = o1;
    err.actual = o2;
    err.showDiff = true;
    throw err;
  }
}

describe('HTML to React components', function() {

  it('should generate ES5 React components', function() {

    equal(expected[0], getComponentsLib(html, {
      componentType: 'es5',
      moduleType: false
    }));
  });

  it('should generate ES6 React components', function() {

    equal(expected[1], getComponentsLib(html, {
      componentType: 'es6',
      moduleType: false
    }));
  });

  it('should generate stateless React components', function() {

    equal(expected[2], getComponentsLib(html, {
      componentType: 'stateless',
      moduleType: false
    }));
  });

  it('should generate ES5 React components as ES6 modules', function() {

    equal(expected[3], getComponentsLib(html, {
      componentType: 'es5',
      moduleType: 'es6'
    }));
  });

  it('should generate ES5 React components as CommonJS modules', function() {

    equal(expected[4], getComponentsLib(html, {
      componentType: 'es5',
      moduleType: 'cjs'
    }));
  });

  it('should generate file names in lowercase with the specified delimiter', function() {

    equal(expected[5], getComponentsLib(html, {
      componentType: 'es5',
      moduleType: 'es6',
      moduleFileNameDelimiter: '-'
    }));
  });

  it('should throw an error if there\'s data-component attribute without a value in HTML', function() {

    try {
      getComponentsLib(readFile('fail.html'));
    } catch (error) {
      assert.equal(error.message, 'There\'s annotated component without a name!');
    }
  });
});
