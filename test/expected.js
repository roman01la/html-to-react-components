module.exports = [
  {
    Header: "\nconst Header = React.createClass({\n  render() {\n    return (\n      <header className=\"header\">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>\n      );\n  }\n});",
    Heading: "\nconst Heading = React.createClass({\n  render() {\n    return <h1 className=\"heading\">Hello, world!</h1>;\n  }\n});",
    Nav: "\nconst Nav = React.createClass({\n  render() {\n    return (\n      <nav className=\"nav\">\n        <ul className=\"list\">\n          <ListItem />\n          <ListItem />\n        </ul>\n      </nav>\n      );\n  }\n});",
    ListItem: "\nconst ListItem = React.createClass({\n  render() {\n    return <li className=\"list-item\" />;\n  }\n});",
    Main: "\nconst Main = React.createClass({\n  render() {\n    return (\n      <main className=\"main\">\n        <Form></Form>\n      </main>\n      );\n  }\n});",
    Form: "\nconst Form = React.createClass({\n  render() {\n    return (\n      <form action>\n        <Field></Field>\n      </form>\n      );\n  }\n});",
    Field: "\nconst Field = React.createClass({\n  render() {\n    return (\n      <div className=\"field\">\n        <Label></Label>\n        <Input />\n      </div>\n      );\n  }\n});",
    Label: "\nconst Label = React.createClass({\n  render() {\n    return (\n      <label htmlFor=\"input\">\n        Input<span>label</span>\n      </label>\n      );\n  }\n});",
    Input: "\nconst Input = React.createClass({\n  render() {\n    return <input type=\"text\" id=\"input\" />;\n  }\n});"
  },
  {
    Header: "class Header extends React.Component {\n  render() {\n    return (\n      <header className=\"header\">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>\n      );\n  }\n}",
    Heading: "class Heading extends React.Component {\n  render() {\n    return <h1 className=\"heading\">Hello, world!</h1>;\n  }\n}",
    Nav: "class Nav extends React.Component {\n  render() {\n    return (\n      <nav className=\"nav\">\n        <ul className=\"list\">\n          <ListItem />\n          <ListItem />\n        </ul>\n      </nav>\n      );\n  }\n}",
    ListItem: "class ListItem extends React.Component {\n  render() {\n    return <li className=\"list-item\" />;\n  }\n}",
    Main: "class Main extends React.Component {\n  render() {\n    return (\n      <main className=\"main\">\n        <Form></Form>\n      </main>\n      );\n  }\n}",
    Form: "class Form extends React.Component {\n  render() {\n    return (\n      <form action>\n        <Field></Field>\n      </form>\n      );\n  }\n}",
    Field: "class Field extends React.Component {\n  render() {\n    return (\n      <div className=\"field\">\n        <Label></Label>\n        <Input />\n      </div>\n      );\n  }\n}",
    Label: "class Label extends React.Component {\n  render() {\n    return (\n      <label htmlFor=\"input\">\n        Input<span>label</span>\n      </label>\n      );\n  }\n}",
    Input: "class Input extends React.Component {\n  render() {\n    return <input type=\"text\" id=\"input\" />;\n  }\n}"
  },
  {
    Header: "\nconst Header = () => (\n  <header className=\"header\">\n    <Heading></Heading>\n    <Nav></Nav>\n  </header>\n);",
    Heading: "\nconst Heading = () => (\n  <h1 className=\"heading\">Hello, world!</h1>\n);",
    Nav: "\nconst Nav = () => (\n  <nav className=\"nav\">\n    <ul className=\"list\">\n      <ListItem />\n      <ListItem />\n    </ul>\n  </nav>\n);",
    ListItem: "\nconst ListItem = () => (\n  <li className=\"list-item\" />\n);",
    Main: "\nconst Main = () => (\n  <main className=\"main\">\n    <Form></Form>\n  </main>\n);",
    Form: "\nconst Form = () => (\n  <form action>\n    <Field></Field>\n  </form>\n);",
    Field: "\nconst Field = () => (\n  <div className=\"field\">\n    <Label></Label>\n    <Input />\n  </div>\n);",
    Label: "\nconst Label = () => (\n  <label htmlFor=\"input\">Input<span>label</span></label>\n);",
    Input: "\nconst Input = () => (\n  <input type=\"text\" id=\"input\" />\n);"
  },
  {
    Header: "import React from 'react';\nimport Heading from './Heading';\nimport Nav from './Nav';\n\nconst Header = React.createClass({\n  render() {\n    return (\n      <header className=\"header\">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>\n      );\n  }\n});\n\nexport default Header;",
    Heading: "import React from 'react';\n\nconst Heading = React.createClass({\n  render() {\n    return <h1 className=\"heading\">Hello, world!</h1>;\n  }\n});\n\nexport default Heading;",
    Nav: "import React from 'react';\nimport ListItem from './ListItem';\n\nconst Nav = React.createClass({\n  render() {\n    return (\n      <nav className=\"nav\">\n        <ul className=\"list\">\n          <ListItem />\n          <ListItem />\n        </ul>\n      </nav>\n      );\n  }\n});\n\nexport default Nav;",
    ListItem: "import React from 'react';\n\nconst ListItem = React.createClass({\n  render() {\n    return <li className=\"list-item\" />;\n  }\n});\n\nexport default ListItem;",
    Main: "import React from 'react';\nimport Form from './Form';\n\nconst Main = React.createClass({\n  render() {\n    return (\n      <main className=\"main\">\n        <Form></Form>\n      </main>\n      );\n  }\n});\n\nexport default Main;",
    Form: "import React from 'react';\nimport Field from './Field';\n\nconst Form = React.createClass({\n  render() {\n    return (\n      <form action>\n        <Field></Field>\n      </form>\n      );\n  }\n});\n\nexport default Form;",
    Field: "import React from 'react';\nimport Label from './Label';\nimport Input from './Input';\n\nconst Field = React.createClass({\n  render() {\n    return (\n      <div className=\"field\">\n        <Label></Label>\n        <Input />\n      </div>\n      );\n  }\n});\n\nexport default Field;",
    Label: "import React from 'react';\n\nconst Label = React.createClass({\n  render() {\n    return (\n      <label htmlFor=\"input\">\n        Input<span>label</span>\n      </label>\n      );\n  }\n});\n\nexport default Label;",
    Input: "import React from 'react';\n\nconst Input = React.createClass({\n  render() {\n    return <input type=\"text\" id=\"input\" />;\n  }\n});\n\nexport default Input;"
  },
  {
    Header: "const React = require('react');\nconst Heading = require('./Heading');\nconst Nav = require('./Nav');\n\nconst Header = React.createClass({\n  render() {\n    return (\n      <header className=\"header\">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>\n      );\n  }\n});\n\nmodule.exports = Header;",
    Heading: "const React = require('react');\n\nconst Heading = React.createClass({\n  render() {\n    return <h1 className=\"heading\">Hello, world!</h1>;\n  }\n});\n\nmodule.exports = Heading;",
    Nav: "const React = require('react');\nconst ListItem = require('./ListItem');\n\nconst Nav = React.createClass({\n  render() {\n    return (\n      <nav className=\"nav\">\n        <ul className=\"list\">\n          <ListItem />\n          <ListItem />\n        </ul>\n      </nav>\n      );\n  }\n});\n\nmodule.exports = Nav;",
    ListItem: "const React = require('react');\n\nconst ListItem = React.createClass({\n  render() {\n    return <li className=\"list-item\" />;\n  }\n});\n\nmodule.exports = ListItem;",
    Main: "const React = require('react');\nconst Form = require('./Form');\n\nconst Main = React.createClass({\n  render() {\n    return (\n      <main className=\"main\">\n        <Form></Form>\n      </main>\n      );\n  }\n});\n\nmodule.exports = Main;",
    Form: "const React = require('react');\nconst Field = require('./Field');\n\nconst Form = React.createClass({\n  render() {\n    return (\n      <form action>\n        <Field></Field>\n      </form>\n      );\n  }\n});\n\nmodule.exports = Form;",
    Field: "const React = require('react');\nconst Label = require('./Label');\nconst Input = require('./Input');\n\nconst Field = React.createClass({\n  render() {\n    return (\n      <div className=\"field\">\n        <Label></Label>\n        <Input />\n      </div>\n      );\n  }\n});\n\nmodule.exports = Field;",
    Label: "const React = require('react');\n\nconst Label = React.createClass({\n  render() {\n    return (\n      <label htmlFor=\"input\">\n        Input<span>label</span>\n      </label>\n      );\n  }\n});\n\nmodule.exports = Label;",
    Input: "const React = require('react');\n\nconst Input = React.createClass({\n  render() {\n    return <input type=\"text\" id=\"input\" />;\n  }\n});\n\nmodule.exports = Input;"
  }
];
