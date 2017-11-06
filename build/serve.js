let express = require('express')
let fs = require('fs')
let config = require('./config.js')
let path = require('path')

let app = express()

function transHtml (htmlPath, entry, socket) {
  let template = null
  return new Promise((resolve, reject) => {
    if (!template) {
      fs.readFile(htmlPath, (err, content) => {
        let script = `<script src="${entry}"></script>`
        socket && (script += `<script>console.log('test')</script>`)
        template = content.toString().replace('</body>', script + '</body>')
        resolve(template)
      })
    } else {
      resolve(template)
    }
  })
}

app.get('/', (req, res) => {
  let htmlPath = path.resolve(__dirname, '../src/index.html')
  let entry = path.resolve(__dirname, '../', config.buildPath + '/' + config.bundleName)
  transHtml(htmlPath, entry, config.autoReload)
    .then(tem => {
      res.render(tem)
    })
})

app.listen(config.port, (err) => {
  console.log('serve run in port' + config.port)
})
