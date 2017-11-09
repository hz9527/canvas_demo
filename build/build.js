let {inputOptions, outputOptions} = require('./buildConf.js')
let config = require('./config.js')
let {rollup} = require('rollup')
let path = require('path')
let fs = require('fs')

function buildHtml (htmlPath, entry) {
  return new Promise((resolve, reject) => {
    fs.readFile(htmlPath, (err, fd) => {
      if (err) {
        console.warn('html template fail: ', err)
        reject(err)
      } else {
        let tem = fd.toString().replace('</body>', `<script src="${entry}"></script>`)
        resolve(tem)
      }
    })
  })
}

function build () {
  rollup(inputOptions)
    .then(bundle => {
      console.log(1)
      return bundle.write(outputOptions)
    })
    .then(() => {
      console.log(2)
      return buildHtml(path.join(__dirname, '../src/index.html'), './' + config.bundleName + '.js')
    })
    .then(tem => {
      console.log(3)
      fs.writeFile(path.join(__dirname, '../dest/index.html'), tem, (err) => {
        if (err) {
          console.log('build fail')
        } else {
          console.log('build success')
        }
      })
    })
}

build()
