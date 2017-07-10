var esformatter = require('esformatter');
var esformatterQuotes = require('esformatter-quotes');
var esformatterJsx = require('esformatter-jsx');
var tk = require('rocambole-token');

var defaultOpts = {
  plugins: ['esformatter-quotes'],
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

var plugins = {
  'esformatter-quotes': esformatterQuotes,
  'esformatter-jsx': esformatterJsx
};

function getES6Config(opts) {
  opts.plugins = ['esformatter-quotes'];
  opts.lineBreak.before = {
    VariableDeclaration: 2,
    ClassDeclaration: 2,
    ExportDefaultDeclaration: 2
  };

  return opts;
}

function getES6ComponentConfig(opts) {
  opts.plugins = ['esformatter-quotes'];
  opts.lineBreak.before = {
    ClassDeclaration: 2
  };

  return opts;
}

function getStatelessComponentConfig(opts) {
  opts.plugins.push('esformatter-jsx');
  return opts;
}

function formatCode(components, componentType, moduleType) {
  esformatter.unregisterAll();

  // Brute-force a deep copy
  var config = JSON.parse(JSON.stringify(defaultOpts));

  setJSXFormatter();

  if (moduleType === 'es6') {
    config = getES6Config(config);
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
    config = getES6ComponentConfig(config);
    setES6ComponentFormatter();
  }

  if (componentType === 'stateless') {
    config = getStatelessComponentConfig(config);
    setStatelessComponentFormatter();
  }

  // skip the auto-load mechanism to support Browserify
  config.plugins.forEach(function(plugin) {
    esformatter.register(plugins[plugin]);
  });

  // disable the auto-load mechanism
  delete config.plugins;

  return Object.keys(components).reduce(
    function(cs, name) {
      cs[name] = esformatter.format(components[name], config);

      return cs;
    },
    {}
  );
}

function setStatelessComponentFormatter() {
  esformatter.register({
    nodeBefore: function(node) {
      if (
        node.type === 'ArrowFunctionExpression' &&
        node.parent.parent.type === 'VariableDeclaration'
      ) {
        tk.before(node.parent.parent.startToken, {
          type: 'LineBreak',
          value: '\n'
        });
      }

      if (node.type === 'JSXElement') {
        tk.before(node.startToken, { type: 'Punctuator', value: '(' });
        tk.before(node.startToken, { type: 'LineBreak', value: '\n' });

        tk.after(node.endToken, { type: 'Punctuator', value: ')' });
        tk.after(node.endToken, { type: 'LineBreak', value: '\n' });

        tk.before(node.startToken, { type: 'indent', value: '  ' });
      }
    }
  });
}

function setES5ComponentFormatter() {
  esformatter.register({
    nodeBefore: function(node) {
      if (
        node.type === 'MemberExpression' &&
        node.startToken.value === 'React' &&
        node.endToken.value === 'createClass'
      ) {
        tk.before(node.parent.parent.parent.startToken, {
          type: 'LineBreak',
          value: '\n'
        });
      }

      if (
        node.parent &&
        node.parent.type !== 'JSXExpressionContainer' &&
        node.type === 'ObjectExpression'
      ) {
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
      if (
        node.type === 'MemberExpression' && node.startToken.value === 'module'
      ) {
        tk.before(node.startToken, { type: 'LineBreak', value: '\n' });
      }
    }
  });
}

function setCJSRequireModuleFormatter() {
  esformatter.register({
    nodeBefore: function(node) {
      if (
        node.type === 'VariableDeclaration' &&
        node.declarations[0].init.type === 'CallExpression' &&
        node.declarations[0].init.callee.name === 'require'
      ) {
        tk.remove(node.endToken.next.next);
      }
    }
  });
}

function setJSXFormatter() {
  esformatter.register({
    nodeBefore: function(node) {
      if (
        node.type === 'JSXElement' &&
        node.parent.type === 'ReturnStatement' &&
        ((node.children.length === 1 &&
          node.children[0].type === 'JSXElement') ||
          node.children.length > 1)
      ) {
        var fchild = node.children[0];
        var lchild = node.children[node.children.length - 1];

        if (
          fchild.type !== 'Literal' ||
          (fchild.type === 'Literal' && fchild.value[0] !== '\n')
        ) {
          tk.before(fchild.startToken, { type: 'LineBreak', value: '\n' });
          tk.before(fchild.startToken, { type: 'Indent', value: '  ' });
        }

        if (
          lchild.type !== 'Literal' ||
          (lchild.type === 'Literal' && lchild.value[0] !== '\n')
        ) {
          tk.after(lchild.endToken, { type: 'LineBreak', value: '\n' });
        }

        tk.before(node.startToken, { type: 'Punctuator', value: '(' });
        tk.before(node.startToken, { type: 'LineBreak', value: '\n' });

        tk.after(node.endToken, { type: 'Punctuator', value: ')' });
        tk.after(node.endToken, { type: 'LineBreak', value: '\n' });
      }
    }
  });
}

module.exports = formatCode;
