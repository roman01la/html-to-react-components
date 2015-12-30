var fs = require('fs');
var path = require('path');

function toFileName(delimiter, name) {

  return name.replace(/[a-z][A-Z]/g, function(str) {
    return str[0] + delimiter + str[1];
  }).toLowerCase();
}

function writeToFS(components, options) {

  var outPath = options.path;
  var delimiter = options.moduleFileNameDelimiter || '-';
  var ext = options.fileExtension || 'js';

  if (!outPath) {
    throw Error('Output path is not specified');
  }

  Object.keys(components)
    .forEach(function(name) {

      fs.writeFileSync(
        path.join(outPath, toFileName(delimiter, name)) + '.' + ext,
        components[name],
        'utf8');
    });
}

module.exports = {
  toFileName: toFileName,
  writeToFS: writeToFS
};
