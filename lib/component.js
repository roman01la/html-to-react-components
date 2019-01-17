var t = require("babel-types");
var walk = require("babylon-walk");

function props(publics, propsType) {
  if (propsType === "es6") {
    return t.variableDeclaration("const", [
      t.variableDeclarator(
        t.objectPattern(
          publics.map(prop =>
            t.objectProperty(
              t.identifier(prop[0]),
              t.identifier(prop[0]),
              false,
              true
            )
          )
        ),
        t.memberExpression(t.thisExpression(), t.identifier("props"))
      )
    ]);
  }
  if (propsType === "stateless") {
    return [
      t.objectPattern(
        publics.map(prop =>
          t.objectProperty(
            t.identifier(prop[0]),
            t.identifier(prop[0]),
            false,
            true
          )
        )
      )
    ];
  }
}

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
  ]);
}

function toES6Component(name, jsxElement, publics) {
  var block = publics.length
    ? t.blockStatement([props(publics, "es6"), t.returnStatement(jsxElement)])
    : t.blockStatement([t.returnStatement(jsxElement)]);

  return t.classDeclaration(
    t.identifier(name),
    t.memberExpression(t.identifier("React"), t.identifier("Component")),
    t.classBody([t.classMethod("method", t.identifier("render"), [], block)]),
    []
  );
}

function toStatelessComponent(name, jsxElement, publics) {
  var params = publics.length ? props(publics, "stateless") : [];

  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(name),
      t.arrowFunctionExpression(params, jsxElement)
    )
  ]);
}

function getAST(name, expr, publics, componentType) {
  if (componentType === "es5") {
    return toES5Component(name, expr);
  }

  if (componentType === "es6") {
    return toES6Component(name, expr, publics);
  }

  if (componentType === "stateless") {
    return toStatelessComponent(name, expr, publics);
  }
}

function replacePublicAttrs(expr) {
  var publics = [];

  expr.openingElement.attributes.forEach(attr => {
    if (
      attr.name.hasOwnProperty("namespace") &&
      attr.name.namespace.name === "public"
    ) {
      var value = attr.value;
      attr.name = attr.name.name;
      attr.value = t.jSXExpressionContainer(t.identifier(attr.name.name));
      publics.push([attr.name.name, value]);
    }
  });

  return { expr, publics };
}

function enrichWithPublics(body, publics, child) {
  walk.simple(body, {
    JSXOpeningElement(p) {
      if (p.name.name === child) {
        publics.forEach(([attr, value]) => {
          p.attributes.push(
            t.jSXAttribute(
              t.jSXIdentifier(attr),
              t.jSXExpressionContainer(value)
            )
          );
        });
      }
    }
  });
  return body;
}

function toReactComponents(componentType, components) {
  var components = Object.keys(components).reduce(function(cs, name) {
    components[name].forEach(component => {
      var { expr, publics } = replacePublicAttrs(
        component.body.program.body[0].expression
      );
      cs[name] = cs[name] || [];
      cs[name].push({
        body: getAST(name, expr, publics, componentType),
        children: component.children,
        publics: component.publics
      });
    });
    return cs;
  }, {});

  Object.values(components).forEach(parents => {
    parents.forEach(parent => {
      Object.keys(components).forEach(child => {
        components[child].forEach(child => {
          var publics = child.publics;
          if (parent.children.includes(child) && publics.length) {
            enrichWithPublics(parent.body, publics, child);
          }
        });
      });
    });
  });

  return components;
}

module.exports = toReactComponents;
