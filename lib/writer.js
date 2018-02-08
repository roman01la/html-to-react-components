var fs, path, mkdirp

function toFileName(delimiter, name) {
  if (delimiter === "") {
    return name
  }

  return name
    .replace(/[a-z][A-Z]/g, function(str) {
      return str[0] + delimiter + str[1]
    })
    .toLowerCase()
}

if (IN_BROWSER === false) {
  fs = require("fs")
  path = require("path")
  mkdirp = require("mkdirp")

  function writeToFS(components, options) {
    options = options || {}

    var outPath = path.resolve(options.path || "components")
    var delimiter = options.moduleFileNameDelimiter || ""
    var ext = options.fileExtension || "js"

    mkdirp.sync(outPath)

    Object.keys(components).forEach(function(name) {
      fs.writeFileSync(
        path.join(outPath, toFileName(delimiter, name)) + "." + ext,
        components[name],
        "utf8",
      )
    })
  }

  module.exports = {
    toFileName: toFileName,
    writeToFS: writeToFS,
  }
} else {
  module.exports = {
    toFileName: toFileName,
  }
}
