var level = 10;             //难度
var mineNum = 10;
var mineX = new Array();
var mine = newArray(mine);  //雷分布，1有，0无
var state = newArray(state);  //数字
var flag = newArray(flag);    //旗子，-1已开，0未开，1flag，2question
var remain = level*level;     //未开格子数
var firstTime = 1;
var timer = null;
var rightFlag = 0;

var oLevel = document.getElementsByClassName("level")[0];

window.onload = function(){
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
        e.preventDefault();
    };
}

for(var i = 0;i <3;i++){
    oLevel.children[i].addEventListener("click",function(e){
        for(var i = 0;i < 3;i++){
            if(oLevel.children[i].className == "active"){
                oLevel.children[i].classList.remove("active");
            }
        }
        e.target.classList.add("active");
        if(e.target.innerHTML == "简单"){
            level = 10;
            mineNum = 10;
        }else if(e.target.innerHTML == "中等"){
            level = 15;
            mineNum = 40;
        }else{
            level = 20;
            mineNum = 100;
        }
        initNewGame();
    },true);
}
document.getElementsByClassName("face")[0].onclick = function(){
    initNewGame();
}

newGame();

function initNewGame(){
    mineX = new Array();
    mine = newArray(mine);
    state = newArray(state);
    flag = newArray(flag);
    remain = level*level;
    firstTime = 1;
    rightFlag = 0;
    if(timer){
        clearInterval(timer);
        document.getElementsByClassName("time")[0].children[1].innerHTML = 0;
    }
    document.getElementsByClassName("mine-allnum")[0].children[1].innerHTML = mineNum;
    document.getElementsByClassName("mine-remainnum")[0].children[1].innerHTML = mineNum;
    newGame();
}

function newGame(){
    document.getElementsByClassName("face")[0].children[0].src = "./img/face-normal.png";
    init();
    var oTbody = document.getElementsByTagName("tbody")[0];
    oTbody.onmousedown = function(e){
        if(e.button ==2){                //右键事件
            switch(flag[e.target.parentNode.rowIndex][e.target.cellIndex]){
                case -1: break;
                case 0: 
                    e.target.classList.add("flag");
                    flag[e.target.parentNode.rowIndex][e.target.cellIndex]+=1;
                    document.getElementsByClassName("mine-remainnum")[0].children[1].innerHTML -= 1;
                    mineX.forEach(function(value,index,array){
                        if ((e.target.parentNode.rowIndex*level+e.target.cellIndex) == value){
                            rightFlag +=1;
                        }
                    })
                    break;
                case 1: 
                    e.target.classList.remove("flag");
                    e.target.classList.add("question");
                    flag[e.target.parentNode.rowIndex][e.target.cellIndex]+=1;
                    document.getElementsByClassName("mine-remainnum")[0].children[1].innerHTML -= -1;
                    mineX.forEach(function(value,index,array){
                        if ((e.target.parentNode.rowIndex*level+e.target.cellIndex) == value){
                            rightFlag -=1;
                        }
                    })
                    break;
                case 2: 
                    e.target.classList.remove("question");
                    flag[e.target.parentNode.rowIndex][e.target.cellIndex] = 0;
                    break;
            }
            if(rightFlag == mineNum){
                result.win();
            }
        }else if(e.button ==0){          //左键事件
            if(firstTime){                //第一次进，布雷,开始计时
                createMine(e);
                firstTime = 0;
                var i = 1;
                var oTime = document.getElementsByClassName("time")[0].children[1];
                timer = setInterval(function(){
                    oTime.innerHTML = i++;
                },1000)
            }
            if(flag[e.target.parentNode.rowIndex][e.target.cellIndex] == 0){
                if(mine[e.target.parentNode.rowIndex][e.target.cellIndex] == 1){
                    e.target.classList.add("boom");
                    result.lose();
                    return;
                }
                if(state[e.target.parentNode.rowIndex][e.target.cellIndex] !=0){
                    e.target.classList.add("show");
                    e.target.innerHTML = state[e.target.parentNode.rowIndex][e.target.cellIndex];
                    flag[e.target.parentNode.rowIndex][e.target.cellIndex] = -1;
                    remain--;
                }else{
                    e.target.classList.add("show");
                    flag[e.target.parentNode.rowIndex][e.target.cellIndex] = -1;
                    remain--;
                    lookFor(e.target.parentNode.rowIndex,e.target.cellIndex,findNum);
                }
                if(remain == mineNum){
                    result.win();
                }
            }
        }
    }
}



//建棋盘
function init(){
    var str = "";
    for(var i = 0;i < level;i++){
        str += "<tr calss='a'>";
        for(var j = 0;j < level;j++){
            str += "<td></td>";
        }
        str +="</tr>";
    }
    var oTable = document.getElementsByTagName("table")[0];
    oTable.innerHTML = str;
}

//建立二维数组
function newArray(a){
    var a = new Array();
    for(var i = 0; i < level;i++){
        a[i] = new Array();
        for(var j = 0;j < level;j++){
            a[i][j] = 0;
        }
    }
    return a;
}
//布雷，并计算数字，state数组
function createMine(e){
    randomMine(e.target.parentNode.rowIndex,e.target.cellIndex);
    for(var i = 0;i<level;i++){              //计算格子数字
        for(var j =0;j<level;j++){
            if(mine[i][j] == 1){
                state[i][j] = -1;
            }else{
                lookFor(i,j,function(a,b){
                    if(mine[a][b] == 1){
                        state[i][j] +=1;
                    }            
                });
            }
        }
    }
}

//随机生成雷,记录在二维数组mine上
function randomMine(a,b){
    //随机mineNum个雷
    var firstOne = a*level+b;
    var check = true;
    for(var i = 0;i < mineNum;i++){
        var a = Math.round(Math.random()*(level*level-1));
        check = true;
        if(a == firstOne){
            check = false;
        }else{
            mineX.forEach(function(value,index,array){
                if(a == value){
                    check = false;
                }
            });
        }
        if(check){
            mineX.push(a);
        }else{
            i--;
        }
    }
    //转换成数组
   mineX.forEach(function(value,index,array){
       var i = Math.floor(value/level);
       var j = value%level;
       mine[i][j] = 1;
   });
}

//遍历周围八个小方块
function lookFor(i,j,func){
    if((i-1)>=0){
        func(i-1,j);
        if((j-1)>=0){
            func(i-1,j-1);
        }
        if((j+1)<level){
            func(i-1,j+1);
        }
    };
    if((i+1)<level){
        func(i+1,j);
        if((j-1)>=0){
            func(i+1,j-1);    
        }
        if((j+1)<level){
            func(i+1,j+1);
        }
    };
    if((j-1)>=0){
        func(i,j-1);
    }
    if((j+1)<level){
        func(i,j+1);
    }
}
//找到非空格子并显示，空格子扩散
function findNum(a,b){
    if(flag[a][b] == 0){
        if(state[a][b] == 0){
            var index = a*level + b;
            var oTd = document.getElementsByTagName("td")[index];
            oTd.classList.add("show");
            flag[a][b] = -1;
            remain--;
            lookFor(a,b,findNum);
        }else{
            var index = a*level + b;
            var oTd = document.getElementsByTagName("td")[index];
            oTd.classList.add("show");
            oTd.innerHTML = state[a][b];
            flag[a][b] = -1;
            remain--;
        }
    }
}


//结果
var result={
    lose:function(){
        this.showAll();
        document.getElementsByClassName("face")[0].children[0].src = "./img/face-cry.png";
        alert("你输了");
    },
    win:function(){
        this.showAll();
        document.getElementsByClassName("face")[0].children[0].src = "./img/face-smile.png";
        alert("你赢了");
    },
    showAll:function(){
        clearInterval(timer);
        for(var i = 0;i < level;i++){
            for(var j = 0;j < level;j++){
                if(flag[i][j] != -1){
                    var index = i*level + j;
                    var oTd = document.getElementsByTagName("td")[index];
                    if(mine[i][j] == 1){
                        oTd.classList.add("mine");
                        flag[i][j] = -1;
                    }else if(state[i][j] != 0){
                        oTd.classList.add("show");
                        oTd.innerHTML = state[i][j];
                        if(flag[i][j] == 1){
                            oTd.classList.add("wrong");
                        }
                        flag[i][j] = -1;
                    }else{
                        oTd.classList.add("show");
                        if(flag[i][j] == 1){
                            oTd.classList.add("wrong");
                        }
                        flag[i][j] = -1;                       
                    }
                }
            }
        }
    }
}






