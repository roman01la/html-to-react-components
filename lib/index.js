var parse = require('posthtml-parser');
var htmlToReactComponentsLib = require('./processor');
var writeToFS = require('./writer').writeToFS;

module.exports = function extractReactComponents(html, options) {

  options = options || {};

  var components = htmlToReactComponentsLib(parse(html), options);

  writeToFS(components, options.output, options.moduleFileNameDelimiter);

  return components;
};
