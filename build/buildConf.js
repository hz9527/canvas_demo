let config = require('./config.js')
let path = require('path')
let resolve = require('rollup-plugin-node-resolve')
let babel = require('rollup-plugin-babel')

let inputOptions = {
  input: path.join(__dirname, '../src/js/index.js'),
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

let outputOptions = {
  file: path.join(__dirname, `../${config.buildPath}/${config.bundleName}.js`),
  format: config.buildType
}

module.exports = {
  inputOptions,
  outputOptions
}
