const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "./src/template/index.html"),
    favicon: path.resolve(__dirname, "./src/assets/favicon.ico"),
    filename: "index.html",
    chunks: ["background", "content", "inner"],
    filename: "simulator.html",
    chunks: ["simulator"],
  }),
];

if (isProd) {
  plugins.push(
    new CompressionWebpackPlugin({
      test: /\.js$|\.html$|\.css$/u,
      // compress if file is larger than 4kb
      threshold: 4096,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "./src/manifest.json"), to: path.resolve(__dirname, "./dist/manifest.json") },
        { from: path.resolve(__dirname, "./src/assets/"), to: path.resolve(__dirname, "./dist") },
      ],
    }),
    new CssMinimizerWebpackPlugin({
      test: /\.css$/g,
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  );
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    background: path.resolve(__dirname, "./src/background.ts"),
    content: path.resolve(__dirname, "./src/content.tsx"),
    inner: path.resolve(__dirname, "./src/inner.ts"),
    simulator: path.resolve(__dirname, "./src/pages/simulator/index.tsx"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "less-loader", options: { lessOptions: { strictMath: true } } },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext]",
        },
      },
    ],
  },
  plugins,
};
