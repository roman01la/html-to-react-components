function formatCode(components) {
  if (typeof IN_BROWSER === "undefined") {
    var prettier = require("prettier");
    return Object.keys(components).reduce(function(cs, name) {
      cs[name] = prettier.format(components[name], {
        semi: true,
        parser: "babel"
      });
      return cs;
    }, {});
  } else {
    return components;
  }
}

module.exports = formatCode;
