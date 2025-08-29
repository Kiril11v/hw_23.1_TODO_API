const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle[fullhash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,"css-loader"]
      }
    ]
  },
  devServer: {
  static: {
    directory: path.resolve(__dirname, "dist"),
  },
  port: 3000,
  open: true,
  hot: true,
 proxy: [
    {
      context: ['/api'],           // пути, которые нужно проксировать
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    }
  ]
}
};
