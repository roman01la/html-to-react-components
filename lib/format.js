var esformatter = require('esformatter');
var tk = require('rocambole-token');

var opts = {
  plugins: [
    'esformatter-quotes',
    'esformatter-jsx'
  ],
  indent: {
    value: '  '
  },
  lineBreak: {
    value: '\n',
    before: {}
  },
  quotes: {
    type: 'single',
    avoidEscape: false
  }
};

function getES6Config() {

  opts.lineBreak.before = {
    VariableDeclaration: 2,
    ClassDeclaration: 2,
    ExportDefaultDeclaration: 2
  };

  return opts;
}

function getES6ComponentConfig() {

  opts.lineBreak.before = {
    ClassDeclaration: 2
  };

  return opts;
}

function formatCode(components, componentType, moduleType) {

  var config = opts;

  setJSXFormatter();

  if (moduleType === 'es6') {
    config = getES6Config();
  }

  if (moduleType === 'cjs') {
    setCJSRequireModuleFormatter();
  }

  if (moduleType === 'cjs' && componentType === 'es5') {
    setCJSExportsModuleFormatter();
  }

  if (componentType === 'es5') {
    setES5ComponentFormatter();
  }

  if (componentType === 'es6') {
    config = getES6ComponentConfig();
    setES6ComponentFormatter();
  }

  if (componentType === 'stateless') {
    setStatelessComponentFormatter();
  }

  return Object.keys(components)
    .reduce(function(cs, name) {

      cs[name] = esformatter.format(components[name], config);

      return cs;
    }, {});
}

function setStatelessComponentFormatter() {

  esformatter.register({

    nodeBefore: function(node) {

      if (node.type === 'ArrowFunctionExpression' &&
          node.parent.parent.type === 'VariableDeclaration') {

        tk.before(node.parent.parent.startToken, { type: 'LineBreak', value: '\n' });
      }

      if (node.type === 'JSXElement') {

        tk.before(node.startToken, { type: 'indent', value: '  ' });
      }
    }
  });
}

function setES5ComponentFormatter() {

  esformatter.register({

    nodeBefore: function(node) {

      if (node.type === 'MemberExpression' &&
          node.startToken.value === 'React' && node.endToken.value === 'createClass') {

        tk.before(node.parent.parent.parent.startToken, { type: 'LineBreak', value: '\n' });
      }

      if (node.type === 'ObjectExpression') {

        tk.remove(node.properties[0].endToken.next);
      }
    }
  });
}

function setES6ComponentFormatter() {

  esformatter.register({

    nodeBefore: function(node) {

      if (node.type === 'MethodDefinition') {

        tk.remove(node.endToken.next);
      }
    }
  });
}

function setCJSExportsModuleFormatter() {

  esformatter.register({

    nodeBefore: function(node) {

      if (node.type === 'MemberExpression' && node.startToken.value === 'module') {

        tk.before(node.startToken, { type: 'LineBreak', value: '\n' });
      }
    }
  });
}

function setCJSRequireModuleFormatter() {

  esformatter.register({

    nodeBefore: function(node) {

      if (node.type === 'VariableDeclaration' &&
          node.declarations[0].init.type === 'CallExpression' &&
          node.declarations[0].init.callee.name === 'require') {

        tk.remove(node.endToken.next.next);
      }
    }
  });
}

function setJSXFormatter() {

  esformatter.register({

    nodeBefore: function(node) {

      if (node.type === 'JSXElement') {

        tk.before(node.startToken, { type: 'Punctuator', value: '(' });
        tk.before(node.startToken, { type: 'LineBreak', value: '\n' });

        tk.after(node.endToken, { type: 'Punctuator', value: ')' });
        tk.after(node.endToken, { type: 'LineBreak', value: '\n' });
      }
    }
  });
}

module.exports = formatCode;
