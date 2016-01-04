var meow = require('meow');
var extractReactComponents = require('./');

var cli = meow(`
    Usage
      $ html2react <input>

    Options
      -c, componentType
      -m, moduleType
      -d, moduleFileNameDelimiter
`);

extractReactComponents(cli.input[0], cli.flags);
