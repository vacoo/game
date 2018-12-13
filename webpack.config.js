const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const common = {
  entry: {
    index: "./src/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].bundle.js"
  },
  module: {
    rules: [{
        test: /\.txt$/,
        use: "raw-loader"
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: "style-loader",
            options: {}
          },
          use: [{
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.tsx$/,
        use: "ts-loader",
        exclude: "/node_modules/"
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "fonts/"
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@root": path.resolve(__dirname, "./"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@containers": path.resolve(__dirname, "src/containers/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
      "@resources": path.resolve(__dirname, "src/resources/")
    }
  }
};

var dev = {
  ...common,
  devtool: "inline-source-map",
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: "192.168.43.7",
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true
  }
};

var prod = {
  ...common,
  entry: {
    index: "./src/index.tsx"
  },
  cache: false,
  devtool: false,
  optimization: {
    // minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new UglifyJsPlugin({
      sourceMap: false,
      extractComments: false,
      uglifyOptions: {
        ie8: false,
        compress: {
          unsafe: true,
          inline: true,
          passes: 2,
          keep_fargs: false,
        },
        output: {
          beautify: false,
        },
        mangle: true
      }
    }),
    new ExtractTextPlugin({
      filename: "[name].[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};

module.exports = process.env.NODE_ENV === "dev" ? dev : prod;