import '../styles/common.scss'
import draw from './draw.js'
import {drawText, getMapArr} from './text.js'


let ctx = document.getElementById('canvas').getContext('2d')
let textCtx = document.getElementById('textCanvas').getContext('2d')
let input = document.getElementById('input')
let btn = document.getElementById('btn')
let con = document.getElementById('con')
let control = document.getElementById('control')
let mapArrList = []
let timer = null
let count = 0

btn.addEventListener('click', () => {
  console.log(input.value)
  if (input.value.length === 0) {
    alert('请输入文字')
  } else {
    let text = input.value
    mapArrList.push(getMapItem(text))
    con.innerHTML += text + '<br/>'
    input.value = ''
  }
})

control.addEventListener('click', e => {
  if (e.target.innerHTML === '开始') {
    if (mapArrList.length === 0) {
      alert('请输入文字')
      return
    }
    e.target.innerHTML = '暂停'
    start()
  } else {
    e.target.innerHTML = '开始'
    stop()
  }
})

function start () {
  timer = setInterval(() => {
    let arr = []
    if (count % 50 === 0) {
      let i = count / 50
      if (i >= mapArrList.length) {
        i = i % mapArrList.length
      }
      arr = mapArrList[i]
    }
    count++
    draw(ctx, arr)
  }, 50)
}

function stop () {
  clearInterval(timer)
}

function getMapItem (text) {
  drawText(textCtx, text)
  return getMapArr(textCtx, text.length)
}
