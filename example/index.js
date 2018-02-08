const hmtl2react = require("../lib/index")

const out = hmtl2react(
  `<h1 class="heading" data-component="Heading">Hello, world!</h1>`,
)

console.log(out)
