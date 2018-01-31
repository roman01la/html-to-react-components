var parse = require("posthtml-parser")
var htmlToReactComponentsLib = require("./processor")
var writeToFS

if (!process.env.NO_WRITE_FS) {
  writeToFS = require("./writer").writeToFS
}

module.exports = function extractReactComponents(html, options) {
  options = options || {}

  var components = htmlToReactComponentsLib(parse(html), options)

  if (!process.env.NO_WRITE_FS) {
    writeToFS(components, options)
  }

  return components
}
