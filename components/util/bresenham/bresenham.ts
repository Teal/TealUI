// var createPoint = function(x,y,c){
    // if(isNaN(x)||isNaN(y)){return;}
    // c = c||'#000000';
    // var dp = document.createElement('div');
    // dp.style.cssText = 'position:absolute;left:'+x+'px;top:'+y+'px;background:'+c+';width:1px;height:1px;overflow:hidden;';
    // document.body.appendChild(dp);
// }
// var draw = function(list){
    // if(!list||!list.length){return;}
	// while(list.length){createPoint.apply(null,list.shift());}
// };
// /*Bresenham图形算法JavaScript版本By dh20156*/
// /*画圆*/
// var arc = function(x0,y0,r){/*起点坐标x0,y0,半径*/
	// var p,x,y,i,ret = [];
	// p = 3-2*r,x = 0,y = r,i = r;
	// for(;x<=y;){
		// ret.push([x+i+x0,y+i+y0]);
		// ret.push([-x+i+x0,-y+i+y0]);
		// ret.push([-x+i+x0,y+i+y0]);
		// ret.push([x+i+x0,-y+i+y0]);
		// ret.push([y+i+x0,x+i+y0]);
		// ret.push([-y+i+x0,x+i+y0]);
		// ret.push([-y+i+x0,-x+i+y0]);
		// ret.push([y+i+x0,-x+i+y0]);
		// if(p<0){
			// p = p+4*x+6;
		// }else{
			// y--,p = p+4*(x-y)+10;
		// }
		// x++;
	// }
	// return ret.slice(0);
// };
// /*画椭圆*/
// var ellipse = function(px,JPlus,rx,ry){/*起点坐标px,JPlus,x轴半径rx,y轴半径ry*/
	// px = px+rx,JPlus = JPlus+ry;
	// var x = 0,y = ry,rx2 = rx*rx,ry2 = ry*ry,ret = [];
	// var dx = ry2/Math.sqrt(ry2+rx2),p = ry2-rx2*ry;
	// while(dx<=y){
		// ret.push([px+x,JPlus+y]);
		// ret.push([px+x,JPlus-y]);
		// ret.push([px-x,JPlus+y]);
		// ret.push([px-x,JPlus-y]);
		// if(p<=0){
			// ++x;
		// }else{
			// ++x,--y;
		// }
		// p = ry2*(x+1)*(x+1)+rx2*(y*y-y)-rx2*ry2;
	// }
	// p = ry2*(x*x+x)+rx2*(y*y-y)-rx2*ry2;
	// while(y>0){
		// ret.push([px+x,JPlus+y]);
		// ret.push([px+x,JPlus-y]);
		// ret.push([px-x,JPlus+y]);
		// ret.push([px-x,JPlus-y]);
		// if(p>=0){
			// --y,p = p-2*rx2*y-rx2;
		// }else{
			// --y,++x,p = p-2*rx2*y-rx2+2*ry2*x+2*ry2;
		// }
	// }
	// ret.push([px+x,JPlus]);
	// ret.push([px-x,JPlus]);
	// return ret.slice(0);
// };
// /*画直线*/
// var line = function(x1,y1,x2,y2){/*起点坐标x1,y1,终点坐标x2,y2*/
	// var dx,dy,h,x,y,t,ret = [];
	// if(x1>x2){x1 = [x2,x2=x1][0],y1 = [y2,y2=y1][0];}
	// dx = x2-x1,dy = y2-y1,x = x1,y = y1;
	// if(!dx){
		// t = (y1>y2)?-1:1;
		// while(y!=y2){ret.push([x,y]);y += t;}
		// return ret.slice(0);
	// }
	// if(!dy){
		// while(x!=x2){ret.push([x,y]);x++;}
		// return ret.slice(0);
	// }
	// if(dy>0){
		// if(dy<=dx){
			// h = 2*dy-dx,ret.push([x,y]);
			// while(x!=x2){
				// if(h<0){
					// h += 2*dy;
				// }else{
					// y++,h += 2*(dy-dx);
				// }
				// x++,ret.push([x,y]);
			// }
		// }else{
			// h = 2*dx-dy,ret.push([x,y]);
			// while(y!=y2){
				// if(h<0){
					// h += 2*dx;
				// }else{
					// ++x,h += 2*(dx-dy);
				// }
				// y++,ret.push([x,y]);
			// }
		// }
	// }else{
		// t = -dy;
		// if(t<=dx){
			// h = 2*dy+dx,ret.push([x,y]);
			// while(x!=x2){
				// if(h<0){
					// h += 2*(dy+dx),y--;
				// }else{
					// h += 2*dy;
				// }
				// x++,ret.push([x,y]);
			// }
		// }else{
			// dy = -dy,dx = -dx,y = y2,x = x2,ret.push([x,y]),h = 2*dx+dy;
			// while(y!=y1){
				// if(h<0){
					// h += 2*(dx+dy),x--;
				// }else{
					// h += 2*dx;
				// }
				// y++,ret.push([x,y]);
			// }
		// }
	// }
	// return ret.slice(0);
// };
// /*鼠标在窗体中单击后拖动测试结果*/
// /*起点*/
// var op = [0,0];
// document.onmousedown = function(e){
	// e=e||window.event;
	// var x1 = e.clientX,y1 = e.clientY;
	// op = [x1,y1];
// }
// document.onmouseup = function(e){
	// e=e||window.event;
	// var x0 = op[0],y0 = op[1];
	// var x1 = e.clientX,y1 = e.clientY;
	// /*画矩形和对角线*/
	// var rect = [];
	// Array.prototype.push.apply(rect,line(x0,y0,x1,y0));
	// Array.prototype.push.apply(rect,line(x0,y0,x0,y1));
	// Array.prototype.push.apply(rect,line(x0,y1,x1,y1));
	// Array.prototype.push.apply(rect,line(x1,y0,x1,y1));
	// Array.prototype.push.apply(rect,line(x0,y0,x1,y1));
	// draw(rect);
	// /*半径*/
	// var r = parseInt(line(x0,y0,x1,y1).length/2);
	// /*椭圆X轴半径，Y轴半径*/
	// var rx = Math.ceil(Math.abs(x0-x1)/2),ry = Math.ceil(Math.abs(y0-y1)/2);
	// /*修正另外3个象限的坐标*/
	// if(x1>x0&&y1<=y0){y0 = y1;}
	// if(x1<x0&&y1>=y0){x0 = x1;}
	// if(x1<x0&&y1<y0){x0 = x1,y0 = y1;}
	// /*画圆*/
	// var aarc = arc(x0,y0,r);
	// draw(aarc);
	// /*画椭圆*/
	// var aellipse = ellipse(x0,y0,rx,ry);
	// draw(aellipse);
// };
