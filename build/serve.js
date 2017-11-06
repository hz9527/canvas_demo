let express = require('express')
let fs = require('fs')
let config = require('./config.js')
let path = require('path')
let {watch} = require('rollup')
let {inputOptions, outputOptions} = require('./buildConf.js')

let app = express()

let buildFinish = false

function transHtml (htmlPath, entry, socket) {
  let template = null
  return new Promise((resolve, reject) => {
    if (!template) {
      fs.readFile(htmlPath, (err, content) => {
        let script = buildFinish ? `<script src="${entry}"></script>` : ''
        socket && (script += `<script>console.log('test')</script>`)
        template = content.toString().replace('</body>', script + '</body>')
        console.log(template)
        resolve(template)
      })
    } else {
      resolve(template)
    }
  })
}

let watcher = watch(Object.assign({}, inputOptions, {output: [outputOptions]}))

watcher.on('event', event => {
  let msg = buildFinish ? 'rebuild' : 'build'
  if (event.code === 'START') {
    console.log(msg + 'start')
  } else if (event.code === 'END') {
    console.log(msg + 'end')
    !buildFinish && (buildFinish = true)
    // socket
  } else if (event.code === 'ERROR') {
    console.warn(msg + 'error')
  }
})
app.use(express.static('./' + config.buildPath))

app.get('/', (req, res) => {
  let htmlPath = path.join(__dirname, '../src/index.html')
  let entry = '//localhost:' + config.port + '/' + config.bundleName + '.js'
  transHtml(htmlPath, entry, config.autoReload)
    .then(tem => {
      res.send(tem)
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.end()
    })
})

app.listen(config.port, (err) => {
  console.log('serve run in port' + config.port)
})
