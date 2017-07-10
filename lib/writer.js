var fs, path, mkdirp;

function toFileName(delimiter, name) {
  if (delimiter === '') {
    return name;
  }

  return name
    .replace(/[a-z][A-Z]/g, function(str) {
      return str[0] + delimiter + str[1];
    })
    .toLowerCase();
}

if (!process.env.NO_WRITE_FS) {
  fs = require('fs');
  path = require('path');
  mkdirp = require('mkdirp');

  function writeToFS(components, options, moduleFileNameDelimiter) {
    options = options || {};

    var outPath = options.path || 'components';
    var delimiter = moduleFileNameDelimiter || '';
    var ext = options.fileExtension || 'js';

    mkdirp.sync(path.join(process.cwd(), outPath));

    Object.keys(components).forEach(function(name) {
      fs.writeFileSync(
        path.join(outPath, toFileName(delimiter, name)) + '.' + ext,
        components[name],
        'utf8'
      );
    });
  }

  module.exports = {
    toFileName: toFileName,
    writeToFS: writeToFS
  };
} else {
  module.exports = {
    toFileName: toFileName
  };
}
