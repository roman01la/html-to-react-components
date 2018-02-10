var t = require("babel-types")
var toFileName = require("./writer").toFileName

function getCJSImportDeclaration(variable, moduleName) {
  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(variable),
      t.callExpression(t.identifier("require"), [t.stringLiteral(moduleName)])
    )
  ])
}

function toCJSModule(name, component, children, delimiter) {
  var modules = [getCJSImportDeclaration("React", "react")].concat(
    children.map(function(child) {
      return getCJSImportDeclaration(child, "./" + toFileName(delimiter, child))
    })
  )

  return t.program(
    modules.concat([
      component,
      t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.memberExpression(t.identifier("module"), t.identifier("exports")),
          t.identifier(name)
        )
      )
    ])
  )
}

function getES6ImportDeclaration(variable, moduleName) {
  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(variable))],
    t.stringLiteral(moduleName)
  )
}

function toES6Module(name, component, children, delimiter) {
  var modules = [getES6ImportDeclaration("React", "react")].concat(
    children.map(function(child) {
      return getES6ImportDeclaration(child, "./" + toFileName(delimiter, child))
    })
  )

  return t.program(
    modules.concat([component, t.exportDefaultDeclaration(t.identifier(name))])
  )
}

function getAST(moduleType, name, expr, children, delimiter) {
  if (moduleType === "es6") {
    return toES6Module(name, expr, children, delimiter)
  }

  if (moduleType === "cjs") {
    return toCJSModule(name, expr, children, delimiter)
  }
}

function toModules(moduleType, delimiter, components) {
  return Object.keys(components).reduce(function(cs, name) {
    cs[name] = {
      body: getAST(
        moduleType,
        name,
        components[name].body,
        components[name].children,
        delimiter
      )
    }

    return cs
  }, {})
}

module.exports = toModules
