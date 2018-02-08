var prettier

if (IN_BROWSER === true) {
  prettier = require("./prettier-browser")
} else {
  prettier = require("prettier")
}

function formatCode(components) {
  return Object.keys(components).reduce(function(cs, name) {
    cs[name] = prettier.format(components[name], { semi: true })
    return cs
  }, {})
}

module.exports = formatCode
