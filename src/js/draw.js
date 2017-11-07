import {getV, checkDraw, getColor} from './tools.js'
import {Radius, CellWidth, G, CHeight, CWidth, DefaultColor, Elas} from './const.js'
// canvas width 8 * 90 height 8 * 25

let Manager = {
  list: [],
  drawList: [],
  emit (event, data) { // draw remove add
    this['_' + event](data)
  },
  _add (ball) {
    ball.index = this.list.length
    this.list.push(ball)
  },
  _draw (i) {
    this.drawList.push(i)
  },
  _remove (i) {
    this.list[i] = null
  },
  drawAll (ctx) {
    this.drawList.forEach(ind => {
      let ball = this.list[ind]
      if (!ball) return
      ctx.fillStyle = ball.color
      drawBall(ctx, ball.x, ball.y)
    })
    this.drawList = []
    this.list.forEach(ball => {
      if (ball) {
        ball.change()
      }
    })
  }
}

function Ball (x, y, manager) {
  this.vx = getV()
  this.vy = getV()
  this.color = getColor()
  this.x = x
  this.y = y
  this.index = -1
  this.manager = manager
}

Ball.prototype.change = function () {
  this.x += this.vx
  this.y += this.vy
  let direction = 1 // 1 bottom -1 top
  if (this.y > CHeight - Radius) {
    direction = -1
    this.y = CHeight - Radius
  }
  let status = checkDraw(this.x, this.y)
  if (status === -1) {
    // emit remove
    this.manager.emit('remove', this.index)
  } else {
    if (direction === 1) {
      this.vy += G
    } else {
      this.vy = -this.vy * Elas
    }
    // emit draw
    this.manager.emit('draw', this.index)
  }
}


function drawBall (ctx, x, y) {
  ctx.beginPath()
  ctx.arc(x, y, Radius, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()
}

function drawAllBall (ctx, mapArr) {
  ctx.clearRect(0, 0, CWidth, CHeight)
  if (mapArr) {
    ctx.fillStyle = DefaultColor
    mapArr.forEach((arr, indY) => {
      arr.forEach((item, indX) => {
        if (item === 1) {
          let x = indX * CellWidth + CellWidth / 2
          let y = indY * CellWidth + CellWidth / 2
          Manager.emit('add', new Ball(x, y, Manager))
          drawBall(ctx, x, y)
        }
      })
    })
  }
  Manager.drawAll(ctx)
}

export default drawAllBall
