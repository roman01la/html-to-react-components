var fs = require('fs');
var path = require('path');
var api = require('posthtml/lib/api');
var parse = require('posthtml-parser');
var render = require('posthtml-render');
var generate = require('babel-generator').default;
var parseJSX = require('babylon').parse;
var traverse = require('babel-traverse').default;
var t = require('babel-types');
var HTMLtoJSX = require('htmltojsx');

var html2jsx = new HTMLtoJSX({
  createClass: false
});

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

      components.push(node);
    }

    return node;
  };
}

function assignByName(component) {

  return [
    getComponentName(component),
    component
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

      cs[component[0]] = component[1];
      return cs;
    }, {});
}

function childrenToComponents(ast) {

  var children = [];

  traverse(ast, {
    JSXElement: function(p) {

      if (p.node.openingElement.attributes.length > 0) {

        var name;

        var attrs = p.node.openingElement.attributes.filter(function(attr) {
          return attr.name.name === 'data-component';
        });

        if (attrs.length > 0) {
          name = attrs[0].value.value;
        }

        if (name) {
          p.node.openingElement.name.name = name;
          p.node.closingElement.name.name = name;

          p.node.openingElement.attributes = [];
          p.node.children = [];

          children.push(name);
        }
      }
    }
  });

  return {
    ast: ast,
    children: children.filter(function(child, i) {
      return children.indexOf(child) === i;
    })
  };
}

function toJsxAST(components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      var out = childrenToComponents(parseJSX(html2jsx.convert(components[name]), { plugins: ['jsx'] }));

      cs[name] = {
        body: out.ast,
        children: out.children
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
