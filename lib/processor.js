var api = require('posthtml/lib/api');
var render = require('posthtml-render');
var toJsxAST = require('./jsx');
var toReactComponents = require('./component');
var toModules = require('./module');
var toCode = require('./code');
var formatCode = require('./format');

function getComponentName(node) {

  return node.attrs['data-component'];
}

function removeComponentName(node) {

  delete node.attrs['data-component'];

  return node;
}

function isComponent(node) {

  var annotated = node.attrs && getComponentName(node);

  if (annotated !== undefined) {
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

  var componentType = options.componentType;
  var moduleType = options.moduleType;

  if (componentType !== 'stateless' &&
      componentType !== 'es5' &&
      componentType !== 'es6') {

    componentType = 'es5';
  }

  if (moduleType !== 'es6' &&
      moduleType !== 'cjs' &&
      moduleType !== false) {

    moduleType = 'es6';
  }

  var components = [];
  var delimiter = options.moduleFileNameDelimiter || '';

  api.walk.bind(tree)(collectComponents(components));

  var unmergedComponents = components
    .map(assignByName)
    .map(clearAndRenderComponents);

  var jsxASTs = toJsxAST(mergeByName(unmergedComponents));
  var reactComponents = toReactComponents(componentType, jsxASTs);
  if (options.afterASTHook) {
    reactComponents = options.afterASTHook(reactComponents);
  }

  if (moduleType) {
    return formatCode(toCode(toModules(moduleType, delimiter, reactComponents)), componentType, moduleType);
  }

  return formatCode(toCode(reactComponents), componentType);
}

module.exports = htmlToReactComponentsLib;
