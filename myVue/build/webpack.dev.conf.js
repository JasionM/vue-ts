'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const { VueLoaderPlugin } = require('vue-loader')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const moduleList = require("./module-conf").moduleList || []

const htmlWebpackPlugin = []

for (const module of moduleList) {
  htmlWebpackPlugin.push(new HtmlWebpackPlugin({
    filename: `${module}/index.html`,
    template: `./src/modules/${module}/index.html`,
    inject: true,
    chunks: [module]
  }))
}

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    setup(app) {
      let html = `<html><head><title>调试页面</title>`
      html += `<style>body{margin: 0}.modudle-menu{float: left;width: 200px; height: 100%;padding: 0 8px;border-right: 1px solid #00ffff;box-sizing: border-box}.module-container{float: left;width: calc(100% - 200px);height: 100%}.module-container iframe{width: 100%;height: 100%}</style>`
      html += `</head><body><div class="module-menu">`
      for (const module of moduleList) {
        html += `<a href="/${module}/index.html" target="container">${module.toString()}</a><br>`
      }
      html += `</div>`
      html += `<div class="module-container"><iframe src="/${moduleList[0]}/index.html" name="container" frameborder="0"></iframe></div>`
      html += `</body></html>`

      app.get("/moduleList", (req, res, next) => {
        res.send(html)
      })

      //访问根目录时重定向到moduleList
      // app.get("/", (req, res, next) => {
      //   res.redirect("./moduleList")
      // })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
