var t = require('babel-types');

function toES5Component(name, jsxElement) {

  return t.variableDeclaration(
   'const',
   [t.variableDeclarator(
     t.identifier(name),
     t.callExpression(
       t.memberExpression(
         t.identifier('React'),
         t.identifier('createClass')),
       [t.objectExpression([
         t.objectMethod(
           'method',
           t.identifier('render'),
           [],
           t.blockStatement([t.returnStatement(jsxElement)])
         )
       ])]))]);
}

function toES6Component(name, jsxElement) {

  return t.classDeclaration(
    t.identifier(name),
    t.memberExpression(
      t.identifier('React'),
      t.identifier('Component')),
    t.classBody([
      t.classMethod(
        'method',
        t.identifier('render'),
        [],
        t.blockStatement([t.returnStatement(jsxElement)])
      )
    ]),
    []);
}

function toStatelessComponent(name, jsxElement) {

  return t.variableDeclaration(
   'const',
   [t.variableDeclarator(
     t.identifier(name),
     t.arrowFunctionExpression(
       [],
       jsxElement))]);
}

function toReactComponents(componentType, components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      var ast;

      var expr = components[name].body.program.body[0].expression;

      switch (componentType) {

      case 'es5':
        ast = toES5Component(name, expr);
        break;

      case 'es6':
        ast = toES6Component(name, expr);
        break;

      case 'stateless':
        ast = toStatelessComponent(name, expr);
        break;

      default:
        ast = toES5Component(name, expr);
      }

      cs[name] = {
        body: ast,
        children: components[name].children
      };

      return cs;
    }, {});
}

module.exports = toReactComponents;
