let express = require('express')
let fs = require('fs')
let config = require('./config.js')
let path = require('path')
let {watch} = require('rollup')
let {inputOptions, outputOptions} = require('./buildConf.js')

let app = express()

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
          const socket = new WebSocket('ws://localhost:18000/socket');

            // Connection opened
            socket.addEventListener('open', function (event) {
                socket.send('loading finish');
            });

            // Listen for messages
            socket.addEventListener('message', function (event) {
                if (event.data === 'reload') {
                  location.reload()
                }
            });
          </script>`)
        template = content.toString().replace('</body>', script + '</body>')
        console.log(template)
        resolve(template)
      })
    } else {
      resolve(template)
    }
  })
}

let watcher = watch(Object.assign(
  {},
  inputOptions,
  {output: [outputOptions]},
  {
    watch: {
      include: path.resolve(__dirname, '../src/js/**')
    }
  }))

watcher.on('event', event => {
  let msg = buildFinish ? 'rebuild' : 'build'
  if (event.code === 'START') {
    console.log(msg + 'start')
  } else if (event.code === 'END') {
    console.log(msg + 'end')
    !buildFinish && (buildFinish = true)
    // socket
    if (config.autoReload && connectWs) {
      connectWs.emit('message', 'reload')
    }
  } else if (event.code === 'ERROR') {
    console.warn(msg + 'error')
  }
})
app.use(express.static('./' + config.buildPath))

app.ws('/socket', (ws, req) => {
  ws.on('message', (msg) => {
    !connectWs && (connectWs = ws)
    ws.send(msg)
  })
})

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
