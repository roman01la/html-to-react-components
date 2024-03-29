var fs = require("fs");
var path = require("path");
var getComponentsLib = require("../lib");
var html = readFile("basic.html");

function readFile(file) {
  return fs.readFileSync(path.join(__dirname, file), "utf8");
}

describe("HTML to React components", function () {
  it("should generate ES5 React components", function () {
    expect(
      getComponentsLib(html, {
        componentType: "es5",
      })
    ).toMatchSnapshot();
  });

  it("should generate ES6 React components", function () {
    expect(
      getComponentsLib(html, {
        componentType: "class",
      })
    ).toMatchSnapshot();
  });

  it("should generate functional React components", function () {
    expect(
      getComponentsLib(html, {
        componentType: "functional",
      })
    ).toMatchSnapshot();
  });

  it("should generate ES5 React components as ES6 modules", function () {
    expect(
      getComponentsLib(html, {
        componentType: "es5",
        moduleType: "es",
      })
    ).toMatchSnapshot();
  });

  it("should generate ES5 React components as CommonJS modules", function () {
    expect(
      getComponentsLib(html, {
        componentType: "es5",
        moduleType: "cjs",
      })
    ).toMatchSnapshot();
  });

  it("should generate file names in lowercase with the specified delimiter", function () {
    expect(
      getComponentsLib(html, {
        componentType: "es5",
        moduleType: "es",
        moduleFileNameDelimiter: "-",
      })
    ).toMatchSnapshot();
  });

  it("should throw an error if there's data-component attribute without a value in HTML", function () {
    expect(() => getComponentsLib(readFile("fail.html"))).toThrow();
  });

  it("should transform inline CSS properly", function () {
    expect(
      getComponentsLib(
        '<div data-component="Box" style="margin:0;padding:10px;border:1px solid black;">Box</div>'
      )
    ).toMatchSnapshot();
  });

  it("should transform public HTML attrbiutes into React props", function () {
    expect(
      getComponentsLib(
        '<button data-component="Button" public:onclick="hello();">press</button>'
      )
    ).toMatchSnapshot();
  });
});
