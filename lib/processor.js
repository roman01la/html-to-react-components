var api = require('posthtml/lib/api');
var render = require('posthtml-render');
var toJsxAST = require('./jsx');
var toReactComponents = require('./component');
var toModules = require('./module');
var toCode = require('./code');

function getComponentName(node) {

  return node.attrs['data-component'];
}

function removeComponentName(node) {

  delete node.attrs['data-component'];

  return node;
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

function clearAndRenderComponents(component) {

  component[1] = render(removeComponentName(component[1]));

  return component;
}

function assignByName(component) {

  return [
    getComponentName(component),
    component
  ];
}

function mergeByName(components) {

  return components
    .reduce(function(cs, component) {

      cs[component[0]] = component[1];
      return cs;
    }, {});
}

function htmlToReactComponentsLib(tree, options) {

  var componentType = options.componentType || 'es5';
  var moduleType = options.moduleType || 'es6';
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

module.exports = htmlToReactComponentsLib;
