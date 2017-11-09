let express = require('express')
let fs = require('fs')
let config = require('./config.js')
let path = require('path')
let {watch} = require('rollup')
let {inputOptions, outputOptions} = require('./buildConf.js')
let opn = require('opn')
let os = require('os')

let app = express()
let localhost = os.networkInterfaces()
Object.keys(localhost).forEach(key => {
  let item
  typeof localhost !== 'string' && (item = localhost[key].find(item => item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal))
  if (item) {
    localhost = item.address
  }
})

let expressWs = require('express-ws')(app)

let buildFinish = false
let connectWs = null

function transHtml (htmlPath, entry, socket) {
  let template = null
  return new Promise((resolve, reject) => {
    if (!template) {
      fs.readFile(htmlPath, (err, content) => {
        let script = buildFinish ? `<script src="${entry}"></script>` : ''
        socket && (script += `<script>
            var socket = new WebSocket('ws://${localhost}:${config.port}/socket')
            socket.addEventListener('open', function (event) {
                socket.send('loading finish')
                console.log('connect successful' + Math.random())
            })
            socket.addEventListener('message', function (event) {
              if (event.data === 'reload') {
                console.log('reload')
                location.reload()
              }
            })
          </script>`)
        template = content.toString().replace('</head>', script + '</head>')
        resolve(template)
      })
    } else {
      resolve(template)
    }
  })
}

app.use(express.static('./' + config.buildPath))

app.ws('/socket', (ws, req) => {
  ws.on('message', (msg) => {
    !connectWs && (connectWs = ws)
    console.log('connect successful')
    ws.send(msg)
  })
})

app.get('/', (req, res) => {
  let htmlPath = path.join(__dirname, '../src/index.html')
  let entry = '//' + localhost + ':' + config.port + '/' + config.bundleName + '.js'
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

let watcher = watch(Object.assign(
  {},
  inputOptions,
  {output: [outputOptions]},
  {
    watch: {
      chokidar: true,
      include: path.resolve(__dirname, '../src/**')
    }
  }))

watcher.on('event', event => {
  let msg = buildFinish ? 'rebuild' : 'build'
  if (event.code === 'START') {
    console.log(msg + ' start')
  } else if (event.code === 'END') {
    console.log(msg + ' end')
    if (config.autoOpen && !buildFinish) {
      opn('http://' + localhost + ':' + config.port)
    }
    !buildFinish && (buildFinish = true)
    // socket
    if (config.autoReload && connectWs) {
      console.log('reload')
      connectWs.emit('message', 'reload')
      connectWs = null
    }
  } else if (event.code === 'ERROR') {
    console.warn(msg + ' error')
  } else {
    console.log(event.code)
  }
})

app.listen(config.port, (err) => {
  console.log('serve run ' + localhost + ':' + config.port)
})
