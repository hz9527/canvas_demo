(function () {
'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

__$styleInject("body,html{padding:0;margin:0}body{font-size:15px;font-family:PingFangSC-Regular,Helvetica Neue,Helvetica,Roboto,Droid Sans Fallback,Microsoft YaHei,sans-serif}.btn{display:inline-block;padding:10px 20px;border-radius:3px;background:#f55;color:#fff;cursor:pointer}.btn:hover{opacity:.8}#textCanvas{display:none}#canvas{display:block;margin:10px auto;border:2px solid #999}.input-con{width:300px;margin:20px auto}.input-con input{height:30px;width:150px;padding:5px 10px;margin:0}.content{font-size:20px}.content,.ctrl{text-align:center}.ctrl{display:block;width:100px;margin:10px auto}", undefined);

var Radius = 3;
var CellWidth = 8;
var G = 5; // px/frame
var CWidth = CellWidth * 90;
var CHeight = CellWidth * 25;
var ColorList = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000'];
var DefaultColor = '#f55';
var Elas = 0.7; // 弹性系数

function getV() {
  var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var result = parseInt(Math.random() * (2 * range + 1)) + v - range;
  return Math.random() < 0.5 ? -result : result;
}

function getColor() {
  return ColorList[parseInt(Math.random() * ColorList.length)];
}

function checkDraw(x, y) {
  // move -1 didnot need draw 0 normal 1
  if (x < -Radius || x > CWidth + Radius) {
    return -1;
  } else if (y < -Radius) {
    return 0;
  }
  return 1;
}

var Manager = {
  list: {},
  drawList: [],
  emit: function emit(event, data) {
    // draw remove add
    this['_' + event](data);
  },
  _add: function _add(ball) {
    var key = this._getKey();
    ball.key = key;
    this.list[key] = ball;
  },
  _draw: function _draw(key) {
    this.drawList.push(key);
  },
  _remove: function _remove(key) {
    delete this.list[key];
  },
  _getKey: function _getKey() {
    var key = Math.random();
    while (key in this.list) {
      key = Math.random() + '-' + Math.random();
    }
    return key;
  },
  drawAll: function drawAll(ctx) {
    var _this = this;

    this.drawList.forEach(function (ind) {
      var ball = _this.list[ind];
      if (!ball) return;
      ctx.fillStyle = ball.color;
      drawBall(ctx, ball.x, ball.y);
    });
    this.drawList = [];
    Object.keys(this.list).forEach(function (key) {
      if (_this.list[key]) {
        _this.list[key].change();
      }
    });
  }
};

function Ball(x, y, manager) {
  this.vx = getV(5, 2);
  this.vy = getV();
  this.color = getColor();
  this.x = x;
  this.y = y;
  this.key = -1;
  this.manager = manager;
}

Ball.prototype.change = function () {
  this.x += this.vx;
  this.y += this.vy;
  var direction = 1; // 1 bottom -1 top
  if (this.y > CHeight - Radius) {
    direction = -1;
    this.y = CHeight - Radius;
  }
  var status = checkDraw(this.x, this.y);
  if (status === -1) {
    // emit remove
    this.manager.emit('remove', this.key);
  } else {
    if (direction === 1) {
      this.vy += G;
    } else {
      this.vy = -this.vy * Elas;
    }
    // emit draw
    this.manager.emit('draw', this.key);
  }
};

function drawBall(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, Radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function drawAllBall(ctx, mapArr) {
  var addBall = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  ctx.clearRect(0, 0, CWidth, CHeight);
  if (mapArr) {
    ctx.fillStyle = DefaultColor;
    mapArr.forEach(function (arr, indY) {
      arr.forEach(function (item, indX) {
        if (item === 1) {
          var x = indX * CellWidth + CellWidth / 2;
          var y = indY * CellWidth + CellWidth / 2;
          addBall && Manager.emit('add', new Ball(x, y, Manager));
          drawBall(ctx, x, y);
        }
      });
    });
  }
  Manager.drawAll(ctx);
}

var FontSize = 18;
var Red = 0;
var Green = 230;
var Blue = 230;
var Coef = 0.75;
// canvas width 90 height 25
function drawText(ctx, text) {
  ctx.clearRect(0, 0, 90, 25);
  ctx.font = '300 ' + FontSize + 'px SimHei';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(' + Red + ', ' + Green + ', ' + Blue + ', 255)';
  ctx.fillText(text, 0, 0);
}

function getMapArr(ctx, length) {
  var imageData = ctx.getImageData(0, 0, length * FontSize, parseInt(FontSize * 1.4));
  var rgbaArr = [];
  var mapArr = [];
  var r = Red * Coef,
      g = Green * Coef,
      b = Blue * Coef,
      l = length * FontSize;

  imageData.data.forEach(function (item, ind) {
    if (ind % 4 === 0) {
      rgbaArr[rgbaArr.length] = [item];
    } else {
      rgbaArr[rgbaArr.length - 1].push(item);
    }
  });
  rgbaArr.map(function (item, ind) {
    if (item[0] >= r && item[1] >= g && item[2] >= b && item[3] > 179) {
      return 1;
    } else {
      return 0;
    }
  }).forEach(function (item, ind) {
    if (ind % l === 0) {
      mapArr[ind / l] = [item];
    } else {
      mapArr[mapArr.length - 1].push(item);
    }
  });
  mapArr.forEach(function (item) {
    console.log(item.join('').replace(/0/g, ' ').replace(/1/g, '*'));
  });
  return mapArr;
}

var ctx = document.getElementById('canvas').getContext('2d');
var textCtx = document.getElementById('textCanvas').getContext('2d');
var input = document.getElementById('input');
var btn = document.getElementById('btn');
var con = document.getElementById('con');
var control = document.getElementById('control');
var mapArrList = [];
var timer = null;
var count = 0;

btn.addEventListener('click', function () {
  if (input.value.length === 0) {
    alert('请输入文字');
  } else {
    var text = input.value;
    mapArrList.push(getMapItem(text));
    con.innerHTML += text + '<br/>';
    input.value = '';
  }
});

control.addEventListener('click', function (e) {
  if (e.target.innerHTML === '开始') {
    if (mapArrList.length === 0) {
      alert('请输入文字');
      return;
    }
    e.target.innerHTML = '暂停';
    start();
  } else {
    e.target.innerHTML = '开始';
    stop();
  }
});

function start() {
  var cache = void 0;
  timer = setInterval(function () {
    var arr = [];
    var addBall = true;
    var c = count % 50;
    if (c === 0) {
      var i = count / 50;
      if (i >= mapArrList.length) {
        i = i % mapArrList.length;
      }
      arr = mapArrList[i];
      cache = arr;
    } else if (c < 5) {
      arr = cache;
      addBall = false;
    }
    count++;
    drawAllBall(ctx, arr, addBall);
  }, 50);
}

function stop() {
  clearInterval(timer);
}

function getMapItem(text) {
  drawText(textCtx, text);
  return getMapArr(textCtx, text.length);
}

}());
