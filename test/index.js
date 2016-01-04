var extractReactComponents = require('html-to-react-components');

console.log(
extractReactComponents(
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

  <header class="header" data-component="Header">

    <h1 class="heading" data-component="Heading">Hello, world!</h1>

    <nav class="nav" data-component="Nav">
      <ul class="list">
        <li class="list-item" data-component="ListItem">#1</li>
        <li class="list-item" data-component="ListItem">#2</li>
      </ul>
    </nav>

  </header>

</body>
</html>
`, {
  componentType: 'es5',
  moduleType: 'es6',
  moduleFileNameDelimiter: '-',
  output: {
    path: './components',
    fileExtension: 'js'
  }
}))
