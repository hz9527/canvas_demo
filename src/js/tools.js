import {Radius, CWidth, ColorList} from './const.js'
function getV (v = 3, range = 2) {
  let result = parseInt(Math.random() * (2 * range + 1)) + v - range
  return Math.random() < 0.5 ? -result : result
}

function getColor () {
  return ColorList[parseInt(Math.random() * ColorList.length)]
}

function checkDraw (x, y) { // move -1 didnot need draw 0 normal 1
  if (x < -Radius || x > CWidth + Radius) {
    return -1
  } else if (y < -Radius) {
    return 0
  }
  return 1
}

export {getV, checkDraw, getColor}
