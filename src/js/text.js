const FontSize = 18
const Red = 0
const Green = 230
const Blue = 230
const Coef = 0.7
// canvas width 90 height 25
function drawText (ctx, text) {
  ctx.clearRect(0, 0, 90, 25)
  ctx.font = `300 ${FontSize}px SimHei`
  ctx.textBaseline = 'top'
  ctx.fillStyle = `rgba(${Red}, ${Green}, ${Blue}, 255)`
  ctx.fillText(text, 0, 0)
}

function getMapArr (ctx, length) {
  let imageData = ctx.getImageData(0, 0, length * FontSize, parseInt(FontSize * 1.4))
  let rgbaArr = []
  let mapArr = []
  let [r, g, b, l] = [Red * Coef, Green * Coef, Blue * Coef, length * FontSize]
  imageData.data.forEach((item, ind) => {
    if (ind % 4 === 0) {
      rgbaArr[rgbaArr.length] = [item]
    } else {
      rgbaArr[rgbaArr.length - 1].push(item)
    }
  })
  rgbaArr.map((item, ind) => {
    if (item[0] >= r && item[1] >= g && item[2] >= b && item[3] > 180) {
      return 1
    } else {
      return 0
    }
  }).forEach((item, ind) => {
    if (ind % l === 0) {
      mapArr[ind / l] = [item]
    } else {
      mapArr[mapArr.length - 1].push(item)
    }
  })
  mapArr.forEach(item => {
    console.log(item.join('').replace(/0/g, ' ').replace(/1/g, '*'))
  })
  return mapArr
}

export {drawText, getMapArr}
