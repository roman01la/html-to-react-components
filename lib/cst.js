var Parser = require('cst').Parser;
var Token = require('cst/lib/elements/Token');

var parser = new Parser();

function formatCode(components) {

  return Object.keys(components)
    .reduce(function(cs, name) {
console.log(components[name])
      var cst = parser.parse(components[name]);

      insertNewLineBeforeVariableDeclaration(cst);
      insertNewLineBeforeExportDefaultDeclaration(cst);

      cs[name] = cst.sourceCode;

      return cs;
    }, {});
}

function insertNewLineBefore(node) {
  node._parentElement.insertChildBefore(new Token('Whitespace', '\n'), node);
}

function insertNewLineBeforeVariableDeclaration(tree) {
  tree.selectNodesByType('VariableDeclaration')
    .forEach(function(node) {
      insertNewLineBefore(node);
    });
}

function insertNewLineBeforeExportDefaultDeclaration(tree) {
  tree.selectNodesByType('ExportDefaultDeclaration')
    .forEach(function(node) {
      insertNewLineBefore(node);
    });
}

module.exports = formatCode;
