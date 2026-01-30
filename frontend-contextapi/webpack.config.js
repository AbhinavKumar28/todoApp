// const path = require('path');
import path from "path";
import { fileURLToPath } from "url";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { dirname } from "path";
// const HtmlWebpackPlugin = require('html-webpack-plugin');
import HtmlWebpackPlugin from "html-webpack-plugin";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    assetModuleFilename: "assets/[name][ext][query]",
    chunkFilename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".png", ".svg"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],

  mode: "production",
};
