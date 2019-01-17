var t = require("babel-types");
var toFileName = require("./writer").toFileName;
var walk = require("babylon-walk");

function getCJSImportDeclaration(variable, moduleName) {
  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(variable),
      t.callExpression(t.identifier("require"), [t.stringLiteral(moduleName)])
    )
  ]);
}

function toCJSModule(name, component, children, delimiter) {
  var modules = [getCJSImportDeclaration("React", "react")].concat(
    children.map(function(child) {
      return getCJSImportDeclaration(
        child,
        "./" + toFileName(delimiter, child)
      );
    })
  );

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
  );
}

function getES6ImportDeclaration(variable, moduleName) {
  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(variable))],
    t.stringLiteral(moduleName)
  );
}

function toES6Module(name, component, children, delimiter) {
  var modules = [getES6ImportDeclaration("React", "react")].concat(
    children.map(function(child) {
      return getES6ImportDeclaration(
        child,
        "./" + toFileName(delimiter, child)
      );
    })
  );

  return t.program(
    modules.concat([component, t.exportDefaultDeclaration(t.identifier(name))])
  );
}

function getAST(moduleType, name, expr, children, delimiter) {
  if (moduleType === "es6") {
    return toES6Module(name, expr, children, delimiter);
  }

  if (moduleType === "cjs") {
    return toCJSModule(name, expr, children, delimiter);
  }
}

function replaceChildInstances(body, childInstances, children) {
  childInstances = children.reduce((ret, name, idx) => {
    ret[name] = childInstances[idx];
    return ret;
  }, {});

  var idxs = children.reduce((ret, name) => {
    ret[name] = 0;
    return ret;
  }, {});

  walk.simple(body, {
    JSXOpeningElement(p) {
      var name = p.name.name;
      if (childInstances.hasOwnProperty(name)) {
        var publics = childInstances[name][idxs[name]].publics;

        publics.forEach(([attr, value]) => {
          p.attributes.push(t.jSXAttribute(t.jSXIdentifier(attr), value));
        });

        idxs[name]++;
      }
    }
  });

  return body;
}

function toModules(moduleType, delimiter, components) {
  return Object.keys(components).reduce(function(cs, name) {
    var component = components[name][0];
    var childInstances = component.children.map(child => components[child]);

    cs[name] = {
      body: getAST(
        moduleType,
        name,
        replaceChildInstances(
          component.body,
          childInstances,
          component.children
        ),
        component.children,
        delimiter
      )
    };

    return cs;
  }, {});
}

module.exports = toModules;
