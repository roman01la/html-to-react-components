var parse = require('posthtml-parser');
var htmlToReactComponentsLib = require('./processor');
var writeToFS = require('./writer').writeToFS;

module.exports = function extractReactComponents(html, options) {

  var components = htmlToReactComponentsLib(parse(html), options);

  if (options.output) {
    writeToFS(components, options.output);
  }

  return components;
};
