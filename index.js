function $ (id){//封装获取id函数
    return document.getElementById(id);
}
//声明变量
var maxScope = 40; //活动区域的长宽各40个小盒子

var cellWidth = 10; //每个小盒子的宽高

var speed = 1000;   //移动的速度

var nowDirection = "left"; //开始的默认方向

var snakeBody=null;//声明全局变量蛇的身体。

var interval;

//绘制活动区域
function init (){

    snakeBody= new Array(); //修改数组赋值

    //遍历创建表格
    for(var i = 0; i < maxScope; i++){
        var row= document.createElement("tr")//创建行
        //给每一行都设置一个id
        row.id= i;
        for(var j = 0; j < maxScope; j++){

            var cell =document.createElement("td");
            cell.id= i +"-"+ j;//i-j 格式id便于区分具体的位置，方便后面操作

            cell.width =cellWidth;
            cell.height =cellWidth;

            //将创建的小td添加到tr中
            row.appendChild(cell);
        }
         $("table").appendChild(row);//将每一行都加入到table里  
    }
    initSnake();//初始化蛇

    initFood(); //初始化食物

    snakeInterval ();//蛇动起来        
}

/*以下是个部分的功能模块*/ 

//随机产生蛇头的坐标
function initSnake(){
    var x= parseInt(Math.random()*maxScope-1);
    var y= parseInt(Math.random()*maxScope-1);
    //声明变量存储蛇的位置
    var nowHeadStation = x +"-"+ y;//匹配id格式便于操作
    // console.log(nowHeadStation);//测试坐标

    snakeBody.push(nowHeadStation);//蛇头存入数组中，
        // console.log(snakeBody)
    tdState(nowHeadStation);  //更改颜色显示蛇头
}
function tdState(tdId) {//背景色
    $(tdId).style.background = "#1f52af"; //将指定id的<td>标记画出颜色
}

//食物的随机位置
function initFood (){
    var allCells = new Array();//存放所有的位置，食物在数组中随机取出并生成

    for(var i =0 ; i < maxScope; i++){
        for(var j =0 ; j < maxScope; j++){
            allCells.push(i +"-"+ j);//数组里添加坐标，并匹配id的格式
        }
    }
    var addCellString = allCells.join(',') + ','; //获得所有表格单元格的坐标字符串。0-1，0-2，0-4，。。。。。
    // console.log(addCellString)//测试字符串坐标
    for(  var k=0; k < snakeBody.length; k++){

        var snakeBodyTemp = snakeBody[k]+"";//强制转换成字符串格式
        // console.log(snakeBodyTemp);

         addCellString = addCellString.replace(snakeBodyTemp,"");//去掉已生成蛇占用的坐标
         // console.log(addCellString);
    }
    var _addCellsArray = addCellString.split(',');//还原成数组
    // console.log(_addCellsArray);

    foodPos = _addCellsArray[parseInt(Math.random() * (_addCellsArray.length - 1))];
    //随机生成数组数作为食物的坐标

    foodState(foodPos); //调用画食物颜色的方法

}


function foodState(tdId) {

    $(tdId).style.background = "#c60c0e";//食物颜色

}
//移动函数
function snakeInterval() { //每隔一段时间让蛇动一次的方法

    interval = window.setInterval("snakeMove()", speed);
}


/*移动函数需要的一些小函数*/ 

//获取坐标
function getPos(p) {

    switch (p) {
    case 'x':
    // console.log(snakeBody);
    // console.log(snakeBody[0]);
        return $(snakeBody[0]).id.split("-")[0];
    case 'y':
        return $(snakeBody[0]).id.split("-")[1];
    }
}


//按键的值匹配方向字符串
document.onkeydown = function() {

    switch (event.keyCode) {

    case 37:

        if (nowDirection != 'right') nowDirection = 'left';

        break;

    case 38:

        if (nowDirection != 'down') nowDirection = 'up';

        break;

    case 39:

        if (nowDirection != 'left') nowDirection = 'right';

        break;

    case 40:

        if (nowDirection != 'up') nowDirection = 'down';

        break;
    }
}

function tdStateBack(tdId) {

    $(tdId).style.background = ""; //将指定id的<td>标记还原为原来的颜色

}

//判断坐标是否在蛇的身体上（自己撞到自己）
function rearEnd(x, y) {

    var temp = x + "-" + y;

    for (var i = 0; i < snakeBody.length; i++) {

        if (temp == snakeBody[i]) {

            return true;
        }
    }
    return false;
}



function gameOver() {//游戏结束提示函数

    window.clearInterval(interval); //蛇停止运动

    alert("Game Over!");

}
/*移动函数需要的小函数结束*/ 


//蛇移动的函数
function snakeMove() {
    //将数组中的元素以-分割第一位为x轴坐标，第二位为y轴坐标
    foodx = foodPos.split('-')[0];

    foody = foodPos.split('-')[1];
        //按键的方向，计算移动。
    switch (nowDirection) {

    case 'left':
        _x = getPos('x');
        _y = parseInt(getPos('y')) - 1;
        break;

    case 'right':
        _x = getPos('x');
        _y = parseInt(getPos('y')) + 1;
        break;

    case 'up':
        _x = parseInt(getPos('x')) - 1;
        _y = getPos('y');
        break;

    case 'down':
        _y = getPos('y');
        _x = parseInt(getPos('x')) + 1;
        break;

    }
        //判断超出有效范围游戏结束
    if (_x < 0 || _y < 0 || _x > maxScope - 1 || _y > maxScope - 1) {

        gameOver();//游戏结束提示函数

    } else if (rearEnd(_x, _y)) {//是否撞到自己。撞到自己游戏结束

        gameOver();

    } else if (_x == foodx && _y == foody) {

        snakeBody.unshift(_x + "-" + _y);//吃掉食物

        tdState(snakeBody[0]);//更改颜色

        initFood(); //产生新的食物

    } else {

        snakeBody.unshift(_x + "-" + _y);

        tdState(snakeBody[0]); //取出首位置的新坐标更改颜色
        
       //每次向前走的时候将原来的位置的颜色删除（就是还原成原来的颜色）
        tdStateBack(snakeBody.pop()); ////取出末尾的旧坐标并且删除
        
    }

}

// function showScore() {//更新分数的函数

//     var grade = "<center>" + snakeBody.length + "<center>";

// }