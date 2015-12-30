var fs = require('fs');
var getComponentsLib = require('./lib');

var html = fs.readFileSync('./test/basic.html',  'utf8');

var components = getComponentsLib(html, {
  componentType: 'es5',
  moduleType: 'es6',
  moduleFileNameDelimiter: '_',
  output: {
    path: './components',
    fileExtension: 'jsx'
  }
});

console.log(components);
