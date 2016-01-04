var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

function toFileName(delimiter, name) {

  return name.replace(/[a-z][A-Z]/g, function(str) {
    return str[0] + delimiter + str[1];
  }).toLowerCase();
}

function writeToFS(components, options, moduleFileNameDelimiter) {

  options = options || {};

  var outPath = options.path || 'components';
  var delimiter = moduleFileNameDelimiter || '-';
  var ext = options.fileExtension || 'js';

  mkdirp(path.join(process.cwd(), outPath));

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
