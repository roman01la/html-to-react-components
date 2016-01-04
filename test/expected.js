module.exports = [
  {
    Header: 'const Header = React.createClass({\n  render() {\n    return <header className="header">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>;\n  }\n\n});',
    Heading: 'const Heading = React.createClass({\n  render() {\n    return <h1 className="heading">Hello, world!</h1>;\n  }\n\n});',
    Nav: 'const Nav = React.createClass({\n  render() {\n    return <nav className="nav">\n        <ul className="list">\n          <ListItem></ListItem>\n          <ListItem></ListItem>\n        </ul>\n      </nav>;\n  }\n\n});',
    ListItem: 'const ListItem = React.createClass({\n  render() {\n    return <li className="list-item">#2</li>;\n  }\n\n});',
    Main: 'const Main = React.createClass({\n  render() {\n    return <main className="main">\n        <form action>\n          <label htmlFor="input" />\n          <input type="text" id="input" />\n        </form>\n      </main>;\n  }\n\n});'
  },
  {
    Header: 'class Header extends React.Component {\n  render() {\n    return <header className="header">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>;\n  }\n\n}',
    Heading: 'class Heading extends React.Component {\n  render() {\n    return <h1 className="heading">Hello, world!</h1>;\n  }\n\n}',
    Nav: 'class Nav extends React.Component {\n  render() {\n    return <nav className="nav">\n        <ul className="list">\n          <ListItem></ListItem>\n          <ListItem></ListItem>\n        </ul>\n      </nav>;\n  }\n\n}',
    ListItem: 'class ListItem extends React.Component {\n  render() {\n    return <li className="list-item">#2</li>;\n  }\n\n}',
    Main: 'class Main extends React.Component {\n  render() {\n    return <main className="main">\n        <form action>\n          <label htmlFor="input" />\n          <input type="text" id="input" />\n        </form>\n      </main>;\n  }\n\n}'
  },
  {
    Header: 'const Header = () => <header className="header">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>;',
    Heading: 'const Heading = () => <h1 className="heading">Hello, world!</h1>;',
    Nav: 'const Nav = () => <nav className="nav">\n        <ul className="list">\n          <ListItem></ListItem>\n          <ListItem></ListItem>\n        </ul>\n      </nav>;',
    ListItem: 'const ListItem = () => <li className="list-item">#2</li>;',
    Main: 'const Main = () => <main className="main">\n        <form action>\n          <label htmlFor="input" />\n          <input type="text" id="input" />\n        </form>\n      </main>;'
  },
  {
    Header: 'import React from "react";\nimport Heading from "./heading";\nimport Nav from "./nav";\nconst Header = React.createClass({\n  render() {\n    return <header className="header">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>;\n  }\n\n});\nexport default Header;',
    Heading: 'import React from "react";\nconst Heading = React.createClass({\n  render() {\n    return <h1 className="heading">Hello, world!</h1>;\n  }\n\n});\nexport default Heading;',
    Nav: 'import React from "react";\nimport ListItem from "./list-item";\nconst Nav = React.createClass({\n  render() {\n    return <nav className="nav">\n        <ul className="list">\n          <ListItem></ListItem>\n          <ListItem></ListItem>\n        </ul>\n      </nav>;\n  }\n\n});\nexport default Nav;',
    ListItem: 'import React from "react";\nconst ListItem = React.createClass({\n  render() {\n    return <li className="list-item">#2</li>;\n  }\n\n});\nexport default ListItem;',
    Main: 'import React from "react";\nconst Main = React.createClass({\n  render() {\n    return <main className="main">\n        <form action>\n          <label htmlFor="input" />\n          <input type="text" id="input" />\n        </form>\n      </main>;\n  }\n\n});\nexport default Main;'
  },
  {
    Header: 'const React = require("react");\n\nconst Heading = require("./heading");\n\nconst Nav = require("./nav");\n\nconst Header = React.createClass({\n  render() {\n    return <header className="header">\n        <Heading></Heading>\n        <Nav></Nav>\n      </header>;\n  }\n\n});\nmodule.exports = Header;',
    Heading: 'const React = require("react");\n\nconst Heading = React.createClass({\n  render() {\n    return <h1 className="heading">Hello, world!</h1>;\n  }\n\n});\nmodule.exports = Heading;',
    Nav: 'const React = require("react");\n\nconst ListItem = require("./list-item");\n\nconst Nav = React.createClass({\n  render() {\n    return <nav className="nav">\n        <ul className="list">\n          <ListItem></ListItem>\n          <ListItem></ListItem>\n        </ul>\n      </nav>;\n  }\n\n});\nmodule.exports = Nav;',
    ListItem: 'const React = require("react");\n\nconst ListItem = React.createClass({\n  render() {\n    return <li className="list-item">#2</li>;\n  }\n\n});\nmodule.exports = ListItem;',
    Main: 'const React = require("react");\n\nconst Main = React.createClass({\n  render() {\n    return <main className="main">\n        <form action>\n          <label htmlFor="input" />\n          <input type="text" id="input" />\n        </form>\n      </main>;\n  }\n\n});\nmodule.exports = Main;'
  }
];
