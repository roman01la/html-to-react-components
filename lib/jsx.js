var parseJSX = require("babylon").parse
var traverse = require("babel-traverse").default
var HTMLtoJSX = require("./html2jsx")

var html2jsx = new HTMLtoJSX({
  createClass: false
})

function childrenToComponents(ast) {
  var children = []

  traverse(ast, {
    JSXElement: function (p) {
      if (p.node.openingElement.attributes.length > 0) {
        var name

        var attrs = p.node.openingElement.attributes.filter(function (attr) {
          return attr.name.name === "data-component"
        })

        if (attrs.length > 0) {
          name = attrs[0].value.value
        }

        if (name) {
          p.node.openingElement.name.name = name

          if (p.node.closingElement) {
            p.node.closingElement.name.name = name
          }

          p.node.openingElement.attributes = []
          p.node.children = []

          children.push(name)
        }
      }
    }
  })

  return {
    ast: ast,
    children: children.filter(function (child, i) {
      return children.indexOf(child) === i
    })
  }
}

function toJsxAST(components) {
  return Object.keys(components).reduce(function (cs, name) {
    var out = childrenToComponents(
      parseJSX(html2jsx.convert(components[name]), { plugins: ["jsx"] })
    )

    cs[name] = {
      body: out.ast,
      children: out.children
    }

    return cs
  }, {})
}

module.exports = toJsxAST
