var parseJSX = require("babylon").parse;
var traverse = require("babel-traverse").default;
var HTMLtoJSX = require("./html2jsx");

var html2jsx = new HTMLtoJSX({
  createClass: false
});

function childrenToComponents(ast) {
  var children = [];
  var childPublicAttrs = [];

  traverse(ast, {
    JSXElement: function(p) {
      if (p.node.openingElement.attributes.length > 0) {
        var name;

        var attrs = p.node.openingElement.attributes.filter(function(attr) {
          return attr.name.name === "data-component";
        });

        if (attrs.length > 0) {
          name = attrs[0].value.value;
        }

        if (name) {
          p.node.openingElement.name.name = name;

          if (p.node.closingElement) {
            p.node.closingElement.name.name = name;
          }

          p.node.openingElement.attributes = [];
          p.node.children = [];

          children.push(name);
        }

        childPublicAttrs = p.node.openingElement.attributes
          .filter(function(attr) {
            return (
              attr.name.hasOwnProperty("namespace") &&
              attr.name.namespace.name === "public"
            );
          })
          .map(attr => [attr.name.name.name, attr.value]);
      }
    }
  });

  return {
    ast: ast,
    children: children.filter(function(child, i) {
      return children.indexOf(child) === i;
    }),
    childPublicAttrs
  };
}

function toJsxAST(components) {
  return Object.keys(components).reduce(function(cs, name) {
    var outs = components[name]
      .map(s => html2jsx.convert(s))
      .map(jsx => parseJSX(jsx, { plugins: ["jsx"] }))
      .map(ast => childrenToComponents(ast));

    cs[name] = outs.map(out => ({
      body: out.ast,
      publics: out.childPublicAttrs,
      children: out.children
    }));

    return cs;
  }, {});
}

module.exports = toJsxAST;
