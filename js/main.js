var normal={
	r:8,
	s_width:window.innerWidth,
	s_height:window.innerHeight,
	margin_left:30,
	margin_top:30,
}
var ballColor=["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];
var balls=[];
//渲染canvas
function draw(ctx){
	ctx.clearRect(0,0,normal.s_width,normal.s_height);
	var t=new Date();
	var h1=parseInt(t.getHours()/10);
	var h2=parseInt(t.getHours()%10);
	var m1=parseInt(t.getMinutes()/10);
	var m2=parseInt(t.getMinutes()%10);
	var s1=parseInt(t.getSeconds()/10);
	var s2=parseInt(t.getSeconds()%10);
	timechange(t,h1,h2,m1,m2,s1,s2);
	drawnum(normal.margin_left,normal.margin_top,h1,ctx);//hours
	drawnum(normal.margin_left+15*(normal.r+1),normal.margin_top,h2,ctx);//hours
	drawnum(normal.margin_left+30*(normal.r+1),normal.margin_top,10,ctx);//:
	drawnum(normal.margin_left+45*(normal.r+1),normal.margin_top,m1,ctx);//minute
	drawnum(normal.margin_left+60*(normal.r+1),normal.margin_top,m2,ctx);//minute
	drawnum(normal.margin_left+75*(normal.r+1),normal.margin_top,10,ctx);//:
	drawnum(normal.margin_left+90*(normal.r+1),normal.margin_top,s1,ctx);//minute
	drawnum(normal.margin_left+105*(normal.r+1),normal.margin_top,s2,ctx);//minute
	drawballs(ctx);
}
//判断是否生成弹球
function timechange(t,h1,h2,m1,m2,s1,s2){
	console.log(t);
	var t2=new Date(t.getTime()+90);
	var h11=parseInt(t2.getHours()/10);
	var h21=parseInt(t2.getHours()%10);
	var m11=parseInt(t2.getMinutes()/10);
	var m21=parseInt(t2.getMinutes()%10);
	var s11=parseInt(t2.getSeconds()/10);
	var s21=parseInt(t2.getSeconds()%10);
	if(h11!=h1){ball(normal.margin_left,normal.margin_top,h1);}
	if(h21!=h2){ball(normal.margin_left+15*(normal.r+1),normal.margin_top,h21);}
	if(m11!=m1){ball(normal.margin_left+45*(normal.r+1),normal.margin_top,m11);}
	if(m21!=m2){ball(normal.margin_left+60*(normal.r+1),normal.margin_top,m21);}
	if(s11!=s1){ball(normal.margin_left+90*(normal.r+1),normal.margin_top,s11);}
	if(s21!=s2){ball(normal.margin_left+105*(normal.r+1),normal.margin_top,s21);}
}
//随机生成一个小球对象
function ball(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][0].length;j++){
			if(digit[num][i][j]==1){
				var aball={
					x:x+2*j*(normal.r+1)+normal.r+1,
					y:y+2*i*(normal.r+1)+normal.r+1,
					g:1.5+Math.random(),
					vx:20*(Math.random()-0.5),
					vy:5*(Math.random()-0.5)-5,
					color : ballColor[Math.floor(Math.random()*ballColor.length)]
				}
				balls.push(aball);
			}
		}
	}
}
//绘制所有弹球
function drawballs(ctx){
	for(var i=0;i<balls.length;i++){
		if(balls[i].y>=window.innerHeight-normal.r){
			balls[i].vy=-1*balls[i].vy*0.75;
		}
		if(balls[i].x>normal.r&&balls[i].x<window.innerWidth-normal.r){
			ctx.fillStyle=balls[i].color;
			ctx.beginPath();
			ctx.arc(balls[i].x,balls[i].y,normal.r,0,Math.PI*2);
			ctx.closePath();
			ctx.fill();
		}
		balls[i].x+=balls[i].vx;
		balls[i].vy+=balls[i].g
		balls[i].y+=balls[i].vy;
	}
}
//绘制一个数字
function drawnum(x,y,num,ctx){
	ctx.fillStyle='rgb(0,104,153)';
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][0].length;j++){
			if(digit[num][i][j]==1){
				ctx.beginPath();
				ctx.arc(x+2*j*(normal.r+1)+normal.r+1,y+2*i*(normal.r+1)+normal.r+1,normal.r,0,Math.PI*2);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}
//更新画布
function updata(ctx){
	draw(ctx);
	setTimeout(function(){updata(ctx)},50);
}
window.onload=function(){
	var canvas=document.getElementById('canvas');
	canvas.width=normal.s_width;
	canvas.height=normal.s_height;
	var ctx=canvas.getContext('2d');
	updata(ctx);
}
