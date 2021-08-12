/* eslint-disable */
const path = require("path");
const webpack = require("webpack"); // to access built-in plugins

const outputDir = "./checkout-ui-custom";
const __DEV__ = process.env.NODE_ENV === "development";
const src = "./src";

module.exports = (env) => {
  return [
    {
      entry: {
        "checkout6-custom.js": {
          import: src + "/checkout6-custom.js",
          filename: "checkout6-custom.js",
        },
        "checkout-confirmation-custom.js": {
          import: src + "/checkout-confirmation-custom.js",
          filename: "checkout-confirmation-custom.js",
        },
        "checkout-instore-custom.js": {
          import: src + "/checkout-instore-custom.js",
          filename: "checkout-instore-custom.js",
        },
        "checkout6-custom.scss": {
          import: src + "/checkout6-custom.scss",
        },
        "checkout-confirmation-custom.scss": {
          import: src + "/checkout-confirmation-custom.scss",
        },
        "checkout-instore-custom.scss": {
          import: src + "/checkout-instore-custom.scss",
        },
      },
      output: {
        filename: "[name].js",
        //exclude: "*scss*",
        clean: true,
        path: path.resolve(__dirname, outputDir),
      },
      plugins: [new webpack.ProgressPlugin()],
      module: {
        rules: [
          {
            test: /\.js$|jsx/,
            use: "babel-loader",
            exclude: /node_modules/,
          },
          {
            test: /(checkout).*\.(css|sass|scss)$/,
            use: [
              {
                loader: "file-loader",
                options: { name: "[name].css" },
              },
              "sass-loader",
            ],
          },
          {
            test: /\.svg$/,
            use: ["@svgr/webpack"],
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: "file-loader",
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
    },
  ];
};
