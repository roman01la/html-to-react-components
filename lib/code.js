var generate = require("babel-generator").default

function toCode(components) {
  return Object.keys(components).reduce(function(cs, name) {
    cs[name] = generate(components[name].body).code

    return cs
  }, {})
}

module.exports = toCode
