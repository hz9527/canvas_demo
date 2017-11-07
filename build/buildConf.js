let config = require('./config.js')
let path = require('path')
let resolve = require('rollup-plugin-node-resolve')
let babel = require('rollup-plugin-babel')
let postcss = require('rollup-plugin-postcss')
let simplevars = require('postcss-simple-vars')
let nested = require('postcss-nested')
let cssnext = require('postcss-cssnext')
let cssnano = require('cssnano')
// postcss-simple-vars postcss-nested postcss-cssnext cssnano

let inputOptions = {
  input: path.join(__dirname, '../src/js/index.js'),
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
        cssnext({warnForDuplicates: false}),
        cssnano(),
      ],
      extensions: [ '.scss' ]
    }),
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
