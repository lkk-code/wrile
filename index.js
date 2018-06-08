var canvasWidth = Math.min(800,$(window).width() - 20);
var canvasHeight = canvasWidth;
var strokeColor = 'black';

var isMouserDon= false;
var lastLoc = {x:0,y:0};
var lastimestamp = 0;
var lastLineWidth = -1;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$('#controller').css('width',canvasWidth+'px');

dramGrid();
//清除
$('#clear_btn').click(function (e) {
    context.clearRect(0,0,canvasWidth,canvasHeight);
    dramGrid();
})
//切换颜色
$('.color_btn').click(function (e) {
    $('.color_btn').removeClass('color_btn_selected');
    $(this).addClass('color_btn_selected');
    strokeColor = $(this).css('background-color');
})

function calcLineWidth(t,s) {
    var v = s/t;
    var resultLineWidth;
    console.log(v);
    if(v <= 0.1){
        resultLineWidth =30;
    }else if(v >=3){
        resultLineWidth = 5;
    }else{
        resultLineWidth = 30-(v-0.1)/(3-0.1)*(30-5);
    }
    if(lastLineWidth == -1){
        return resultLineWidth;
    }
    return lastLineWidth*2/3 + resultLineWidth*1/3;
}
function calcDistance(loc1,loc2) {
    return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y))
}
function windowToCanvas(x,y) {
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)}
}
function beginStroke(point) {
    isMouserDon = true;
    lastLoc = windowToCanvas(point.x,point.y);
    lastimestamp = new Date().getTime();
}
function endStroke() {
    isMouserDon = false;
}

// function distanceTo( v ) {
//     return Math.sqrt( distanceToSquared( v ) );
// }
//
// function distanceToSquared( a,v ) {
//     var dx = a.x - v.x, dy = a.y - v.y;
//     return dx * dx + dy * dy;
// }
// var histPoint={
//     x:0,
//     y:0
// }
// var minSize=.1;
// var maxSize=2;
// var histTime=0;

// function drawStroke(point){
//     return;
//     var curTime=new Date().getTime();
//
//     var stepX=(point.x-histPoint.x)/100;
//     var stepY=(point.y-histPoint.y)/100;
//     var startPoint={
//         x:histPoint.x,
//         y:histPoint.y
//     }
//     // var lineWidth=10;
//     // var delay=0;
//     // var distanceTime=curTime-histTime;
//
//     // delay=.995;
//
//     histPoint.x=point.x;
//     histPoint.y=point.y;
//     // for (var i = 0; i < 100; i++) {
//     //     context.beginPath();
//     //     context.moveTo(startPoint.x, startPoint.y);
//     //     context.lineTo(startPoint.x+stepX, startPoint.y+stepY);
//     //     context.strokeStyle = strokeColor;
//     //     lineWidth*=delay;
//     //     if(lineWidth<minSize)lineWidth==minSize;
//     //     if(lineWidth>maxSize)lineWidth==maxSize;
//     //     context.lineWidth = lineWidth;
//     //     context.lineCap = 'round';
//     //     context.lineJoin = 'round';
//     //     context.stroke();
//     //     startPoint.x+=stepX;
//     //     startPoint.y+=stepY;
//     // }
//     // histTime=curTime;
// }


function moveStroke(point) {
    //return;
    var curLoc = windowToCanvas(point.x , point.y);
    var curTimestamp = new Date().getTime();
    var s = calcDistance(curLoc,lastLoc);
    var t = curTimestamp - lastimestamp;
    var lineWidth = calcLineWidth(t,s);

    //draw
    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x,curLoc.y);
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
    lastLoc = curLoc;
    lastimestamp =  curTimestamp;
    lastLineWidth = lineWidth;
}

canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x:e.clientX, y:e.clientY})
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if(isMouserDon){
       moveStroke({x:e.clientX,y:e.clientY});
        // drawStroke({x:e.clientX,y:e.clientY});
    }
};

// // 触控相关的时间
canvas.addEventListener('touchstart',function (e) {
    e.preventDefault();
     touch = e.touches[0];
    beginStroke({x:touch.pageX, y:touch.pageY})

});
canvas.addEventListener('touchmove',function (e) {
    e.preventDefault();
    if(isMouserDon){
         touch = e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY})
        drawStroke({x:touch.pageX,y:touch.pageY})
    }
});
canvas.addEventListener('touchend',function (e) {
    e.preventDefault();
    endStroke();
})

function dramGrid() {
context.save();//保存
context.strokeStyle = 'rgb(230,11,9)';
context.beginPath();
context.moveTo(3,3);
context.lineTo(canvasWidth - 3, 3);
context.lineTo(canvasWidth-3, canvasHeight-3);
context.lineTo(3,canvasHeight-3);
context.closePath();

context.lineWidth = 6;
context.stroke();


context.beginPath();
context.moveTo(0,0);
context.lineTo(canvasWidth,canvasHeight);

context.moveTo(canvasWidth,0);
context.lineTo(0,canvasHeight);

context.moveTo(canvasWidth/2,0);
context.lineTo(canvasWidth/2,canvasHeight);

context.moveTo(0,canvasHeight/2);
context.lineTo(canvasWidth,canvasHeight/2);

context.lineWidth = 1;
context.stroke();

context.restore();
}