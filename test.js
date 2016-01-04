var fs = require('fs');
var getComponentsLib = require('./lib');

var html = fs.readFileSync('./test/basic.html',  'utf8');

var components = getComponentsLib(html);

console.log(components);
