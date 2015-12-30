var fs = require('fs');
var path = require('path');
var api = require('posthtml/lib/api');
var parse = require('posthtml-parser');
var render = require('posthtml-render');
var generate = require('babel-generator').default;
var parseJSX = require('babylon').parse;
var t = require('babel-types');

var jsxAttrs = {
  'class': 'className',
  'for': 'htmlFor'
};

function getComponentName(node) {

  return node.attrs['data-component'];
}

function isComponent(node) {

  var annotated = node.attrs && getComponentName(node);

  if (annotated) {
    if (getComponentName(node).length > 0) {
      return true;
    } else {
      throw Error('There\'s annotated component without a name!');
    }
  }

  return false;
}

function collectComponents(components) {

  return function(node) {

    if (isComponent(node)) {

      components.push(toJsxAttrs(node));
    }

    return node;
  };
}

function toJsxAttrs(node) {

  if (!node.attrs) {
    return node;
  }

  node.attrs = Object.keys(node.attrs)
    .reduce(function(attrs, attr) {

      attrs[jsxAttrs[attr] || attr] = node.attrs[attr];

      return attrs;
    }, {});

  return node;
}

function childrenToComponent(component) {

  var children = [];

  api.walk.bind(component)(function(node) {

    if (isComponent(node)) {

      var name = getComponentName(node);

      children.push(name);

      return {
        tag: name
      };
    }

    return toJsxAttrs(node);
  });

  return {
    component: component,
    children: children.filter(function(child, i) {
      return children.indexOf(child) === i;
    })
  };
}

function assignByName(component) {

  return [
    getComponentName(component.component),
    component.component,
    component.children
  ];
}

function removeComponentName(node) {

  delete node.attrs['data-component'];

  return node;
}

function clearAndRenderComponents(component) {

  component[1] = render(removeComponentName(component[1]));

  return component;
}

function mergeByName(components) {

  return components
    .reduce(function(cs, component) {

      cs[component[0]] = {
        body: component[1],
        children: component[2]
      };
      return cs;
    }, {});
}

function toJsxAST(components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      cs[name] = {
        body: parseJSX(components[name].body, { plugins: ['jsx'] }),
        children: components[name].children
      };

      return cs;
    }, {});
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

function toCode(components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      cs[name] = generate(components[name].body).code;

      return cs;
    }, {});
}

function htmlToReactComponentsLib(tree, options) {

  var componentType = options.componentType; // es5, es6, stateless
  var moduleType = options.moduleType || false; // false, es6, cjs
  var delimiter = options.moduleFileNameDelimiter || '-';

  var components = [];

  api.walk.bind(tree)(collectComponents(components));

  var reactComponents = toReactComponents(
      componentType,
      toJsxAST(
        mergeByName(
          components
            .map(childrenToComponent)
            .map(assignByName)
            .map(clearAndRenderComponents))));

  if (moduleType) {
    return toCode(toModules(moduleType, delimiter, reactComponents));
  }

  return toCode(reactComponents);
}

function toFileName(delimiter, name) {

  return name.replace(/[a-z][A-Z]/g, function(str) {
    return str[0] + delimiter + str[1];
  }).toLowerCase();
}

function writeToFS(components, options) {

  var outPath = options.path;
  var delimiter = options.moduleFileNameDelimiter || '-';
  var ext = options.fileExtension || 'js';

  if (!outPath) {
    throw Error('Output path is not specified');
  }

  Object.keys(components)
    .forEach(function(name) {

      fs.writeFileSync(
        path.join(outPath, toFileName(delimiter, name)) + '.' + ext,
        components[name],
        'utf8');
    });
}

module.exports = function extractReactComponents(html, options) {

  var components = htmlToReactComponentsLib(parse(html), options);

  if (options.output) {
    writeToFS(components, options.output);
  }

  return components;
};
