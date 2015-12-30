var t = require('babel-types');
var toFileName = require('./writer').toFileName;

function getCJSImportDeclaration(variable, moduleName) {

  return t.variableDeclaration(
    'const',
    [t.variableDeclarator(
      t.identifier(variable),
      t.callExpression(
        t.identifier('require'),
        [t.stringLiteral(moduleName)]
      )
    )]
  );
}

function toCJSModule(name, component, children, delimiter) {

  var modules = [getCJSImportDeclaration('React', 'react')].concat(
    children.map(function(child) {
      return getCJSImportDeclaration(child, './' + toFileName(delimiter, child));
    }));

  return t.program(
    modules.concat([
      component,
      t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.memberExpression(
            t.identifier('module'),
            t.identifier('exports')
          ),
          t.identifier(name)
        )
      )
    ])
  );
}

function getES6ImportDeclaration(variable, moduleName) {

  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(variable))],
    t.stringLiteral(moduleName));
}

function toES6Module(name, component, children, delimiter) {

  var modules = [getES6ImportDeclaration('React', 'react')].concat(
    children.map(function(child) {
      return getES6ImportDeclaration(child, './' + toFileName(delimiter, child));
    }));

  return t.program(
    modules.concat([
      component,
      t.exportDefaultDeclaration(t.identifier(name))
    ]));
}

function toModules(moduleType, delimiter, components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      var ast;

      var expr = components[name].body;
      var children = components[name].children;

      switch (moduleType) {

      case 'es6':
        ast = toES6Module(name, expr, children, delimiter);
        break;

      case 'cjs':
        ast = toCJSModule(name, expr, children, delimiter);
        break;

      default:
        ast = toES6Module(name, expr, children, delimiter);
      }

      cs[name] = { body: ast };

      return cs;
    }, {});
}

module.exports = toModules;
