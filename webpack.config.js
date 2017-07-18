var webpack = require("webpack");
var path    = require("path");
var _       = require("lodash");
var glob    = require("glob");

// /(\.\/src)(.*)(\.entry\.js)/.exec("./src/app/client/mall/js/index.entry.js")
// ["./src/app/client/mall/js/index.entry.js", "./src", "/app/client/mall/js/index", ".entry.js"]
var createEntryObj = function() {
  var entry = {};
  var entryKeys = function(path) {
    var matches = /(\.\/src)(.*)(\.entry\.js)/.exec(path);
    return matches[2] + ".bundle";
  };

  glob.sync("./src/**/*.entry.js").forEach(function(path) {
    entry[entryKeys(path)] = path;
  });
  
  _.extend(entry, {
    "vendor": ["jquery", "lodash", "backbone"]
  });

  return entry;
};

module.exports = {
  resolve: {
    extensions: [".js", ".tpl"],
    modules: [
      __dirname + "/src",
      "node_modules"
    ],
    alias: {
      "backbone": "com/lib/backbone/backbone.js"
      // "jsonrpc" : "com/mobile/lib/jsonrpc/jsonrpc.js"
    }
  },
  // entry: {
  //   "vendor": ["jquery", "lodash", "backbone"],
  //   "/app/client/test/common/native/native-b.bundle": "./src/app/client/test/common/native/native-b.entry.js",
  //   "/app/client/test/common/native/native-test.bundle": "./src/app/client/test/common/native/native-test.entry.js"
  // },
  entry: createEntryObj(),
  output: {
    path: path.join(__dirname, "dest"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: [/node_modules/, __dirname + "/src/com/lib"],
        use: [
          {
            loader: "eslint-loader",
            options: {
              configFile: ".eslintrc",
              formatter: require("eslint-friendly-formatter")
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, __dirname + "/src/com/lib"],
        use: [
          {
            loader: "babel-loader",
            query: {
              compact: false,
              presets: ["es2015"],
              plugins: ["es6-promise"]
            }
          }
        ],
      },
      {
        test: /\.tpl$/,
        use: [
          "tpl-loader"
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     "style-loader",
      //     "css-loader",
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         plugins: function () {
      //           return [autoprefixer, cssnano];
      //         }
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings 
          }, 
          {
            loader: "css-loader" // translates CSS into CommonJS 
          }, 
          {
            loader: "less-loader" // compiles Less to CSS 
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [autoprefixer, cssnano];
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // add it in build task
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   }
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      "name": "vendor",
      "filename": "vendor/vendor-mvc.bundle.js"
    })
  ],
  devtool: "source-map"
};
