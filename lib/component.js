var t = require("babel-types")

function toES5Component(name, jsxElement) {
  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(name),
      t.callExpression(
        t.memberExpression(t.identifier("React"), t.identifier("createClass")),
        [
          t.objectExpression([
            t.objectMethod(
              "method",
              t.identifier("render"),
              [],
              t.blockStatement([t.returnStatement(jsxElement)])
            )
          ])
        ]
      )
    )
  ])
}

function toES6Component(name, jsxElement) {
  return t.classDeclaration(
    t.identifier(name),
    t.memberExpression(t.identifier("React"), t.identifier("Component")),
    t.classBody([
      t.classMethod(
        "method",
        t.identifier("render"),
        [],
        t.blockStatement([t.returnStatement(jsxElement)])
      )
    ]),
    []
  )
}

function toStatelessComponent(name, jsxElement) {
  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(name),
      t.arrowFunctionExpression([], jsxElement)
    )
  ])
}

function getAST(name, expr, componentType) {
  if (componentType === "es5") {
    return toES5Component(name, expr)
  }

  if (componentType === "es6") {
    return toES6Component(name, expr)
  }

  if (componentType === "stateless") {
    return toStatelessComponent(name, expr)
  }
}

function toReactComponents(componentType, components) {
  return Object.keys(components).reduce(function(cs, name) {
    cs[name] = {
      body: getAST(
        name,
        components[name].body.program.body[0].expression,
        componentType
      ),
      children: components[name].children
    }

    return cs
  }, {})
}

module.exports = toReactComponents
