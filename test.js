var fs = require('fs');
var getComponentsLib = require('./');

var components = getComponentsLib(fs.readFileSync('./test/basic.html',  'utf8'));

console.log(components);
