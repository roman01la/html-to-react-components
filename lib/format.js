var prettier = require('prettier');

function formatCode(components) {
  return Object.keys(components).reduce(
    function(cs, name) {
      cs[name] = prettier.format(components[name]);
      return cs;
    },
    {}
  );
}

module.exports = formatCode;
