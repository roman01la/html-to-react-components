const webpack = require("webpack")
const path = require("path")

module.exports = {
  entry: "./example/index.js",
  output: {
    path: path.resolve(__dirname, "example/dist"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      IN_BROWSER: JSON.stringify(true),
    }),
  ],
}
