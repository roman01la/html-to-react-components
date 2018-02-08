var parse = require("posthtml-parser")
var htmlToReactComponentsLib = require("./processor")

module.exports = function extractReactComponents(html, options) {
  options = options || {}

  var components = htmlToReactComponentsLib(parse(html), options)

  if (IN_BROWSER === false) {
    require("./writer").writeToFS(components, options)
  }

  return components
}
