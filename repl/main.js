const { h, render, Component } = preact
const css = emotion.css

const html_ = `<!DOCTYPE html>
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
        <li class="list-item" data-component="ListItem"></li>
        <li class="list-item" data-component="ListItem"></li>
      </ul>
    </nav>

  </header>

  <main class="main" data-component="Main">
    <form action="" data-component="Form">
      <div class="field" data-component="Field">
        <label for="input" data-component="Label">Input<span>label</span></label>
        <input type="text" id="input" data-component="Input">
      </div>
    </form>
  </main>

</body>
</html>`

emotion.injectGlobal`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font: normal 16px sans-serif;
    background: #00D8FF;
  }
  .CodeMirror {
    height: 100%;
  }
`

const cm = css`
  flex: 1;
`

class CM extends Component {
  componentDidMount() {
    const cm = new CodeMirror(this.el)
    if (this.props.value) {
      cm.setValue(this.props.value)
    }
    cm.on(
      "change",
      () => this.props.onChange && this.props.onChange(cm.getValue()),
    )
    this.cm = cm
  }
  componentWillReceiveProps(props) {
    if (props.value !== this.props.value) {
      this.cm.setValue(props.value)
    }
  }
  render() {
    return h("div", { class: cm, ref: el => (this.el = el) })
  }
}

const Divider = () =>
  h("div", {
    class: css`
      width: 4px;
    `,
  })

const Output = ({ output }) =>
  h(
    "div",
    {
      class: css`
        display: flex;
        flex: 1;
        flex-direction: column;
        max-width: calc(50vw - 16px);
        overflow-y: scroll;
      `,
    },
    h(CM, {
      value: Object.values(output).reduce((out, s) => out + "\n" + s, ""),
    }),
  )

const Input = props =>
  h(
    "div",
    {
      class: css`
        display: flex;
        flex: 1;
        max-width: calc(50vw - 16px);
      `,
    },
    h(CM, props),
  )

const main = css`
  display: flex;
  padding: 16px;
  height: 100vh;
`

class REPL extends Component {
  constructor() {
    super()
    this.state = {
      input: html_,
      output: html2react(html_),
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(value) {
    this.setState({ input: value, output: html2react(value) })
  }
  render(props, state) {
    const { input, output } = state
    return h(
      "div",
      { class: main },
      h(Input, { value: input, onChange: this.handleChange }),
      h(Divider),
      h(Output, { output }),
    )
  }
}

render(h(REPL), window.app)
