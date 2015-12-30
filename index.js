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

  api.walk.bind(component)(function(node) {

    if (isComponent(node)) {

      return {
        tag: getComponentName(node)
      };
    }

    return toJsxAttrs(node);
  });

  return component;
}

function assignByName(component) {

  return [getComponentName(component), component];
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

function toJsxAST(components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      cs[name] = parseJSX(components[name], { plugins: ['jsx'] });

      return cs;
    }, {});
}

function toReactComponents(components) {

  return Object.keys(components)
    .reduce(function(cs, name) {

      cs[name] = generate(t.variableDeclaration(
        'const',
        [t.variableDeclarator(
          t.identifier(name),
          t.arrowFunctionExpression(
            [],
            components[name].program.body[0].expression))])).code;

      return cs;
    }, {});
}

function htmlToReactComponentsLib(tree) {

  var components = [];

  api.walk.bind(tree)(collectComponents(components));

  return (

    toReactComponents(
      toJsxAST(
        mergeByName(
          components
            .map(childrenToComponent)
            .map(assignByName)
            .map(clearAndRenderComponents)))));
}

module.exports = function extractReactComponents(html) {

  return htmlToReactComponentsLib(parse(html));
};
