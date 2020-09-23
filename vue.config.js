const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

function resolve(dir) {
  'use strict';
  return path.resolve(__dirname, dir);
}

// Generate pages object
const pagesObj = {};


const chromeName = ["popup", "options"];

chromeName.forEach(name => {
  'use strict';
  pagesObj[name] = {
    entry: `src/${name}/index.ts`,
    template: "public/index.html",
    filename: `${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production" ? [{
    from: path.resolve("src/manifest.production.json"),
    to: `${path.resolve("dist")}/manifest.json`
  }, {
    from: path.resolve("src/modelConfig.json"),
    to: `${path.resolve("dist")}/modelConfig.json`
  }] : [{
    from: path.resolve("src/manifest.development.json"),
    to: `${path.resolve("dist")}/manifest.json`
  }, {
    from: path.resolve("src/modelConfig.json"),
    to: `${path.resolve("dist")}/modelConfig.json`
  }];

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", "json", ".css", ".less"],
      alias: {
        '@': resolve('src'),
        '@CLib': resolve('src/utils/chrome')
      }
    },
    module: {
      rules: [ // 可在package.json 配置顶层 sideEffects: false
        {
          test: /\.(ts|tsx)?$/,
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
            appendTsSuffixTo: [/\.vue$/]
          },
        }
      ]
    },
    entry: {
      content: './src/content/index.ts',
      background: './src/background/index.ts',
      initLive2D: './src/initLive2D.ts'
    },
    output: {
      filename: '[name].js' //可依据自己需求修改
    },
    plugins: [CopyWebpackPlugin(plugins)],
  }
};