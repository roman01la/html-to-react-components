#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var meow = require('meow');
var chalk = require('chalk');
var glob = require('glob');
var extractReactComponents = require('./');

var cli = meow(`
    Usage
      $ html2react <input> [options]

    Options
      -c, Type of generated React components. Default is 'es5'.
      -m, Type of generated JavaScript modules. Default is 'es6'.
      -d, Delimiter character to be used in modules filename. Default is '-'.
      -o, Output directory path. Default is 'components'.
      -e, Output files extension. Default is 'js'.

    More info at https://github.com/roman01la/html-to-react-components
`,
{
  alias: {
    h: 'help'
  }
});

var flags = cli.flags;
var components = [];

glob(cli.input[0], function(err, files) {

  files.forEach(function(f) {

    var html = fs.readFileSync(path.join(process.cwd(), f), 'utf8');

    var component = extractReactComponents(html, {
      componentType: flags.c,
      moduleType: flags.m,
      moduleFileNameDelimiter: flags.d,
      output: {
        path: flags.o,
        fileExtension: flags.e
      }
    });

    components.push(component);
  });

  var stats = components.reduce(function(agg, cs) {

    var names = Object.keys(cs);

    agg.count += names.length;
    agg.names = agg.names.concat(names);

    return agg;
  }, { count: 0, names: [] });

  console.log(
    chalk.green(`Successfully generated ${chalk.red.bold(stats.count)} components: ${chalk.red.bold(stats.names.join(', '))}`));
});
