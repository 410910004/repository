//获取ul
var ulList = document.getElementById('ulList');
//获取图片
var imgArr =document.getElementsByTagName('img');
//设置ulList的宽度
ulList.style.width = imgArr.length * 520 +'px';

//设置导航居中
var aList = document.getElementById('aNav');
var wrap =document.getElementById('wrap');
aList.style.left = (wrap.offsetWidth-aList.offsetWidth)/2+'px';
//获取a导航
var aNode = document.getElementsByTagName('a');

for(let i = 0;i<aNode.length;i++){
    aNode[i].onclick = function(){
        for(let j = 0;j<aNode.length;j++){
            aNode[j].style.backgroundColor = 'black';
        }
        //修改图片偏移量
        ulList.style.left = -520 * i +'px' ;
        aNode[i].style.backgroundColor='red';
    }
}

//定义定时器
var timer;
var index =0;//轮播图图片下标
timer = clearInterval();//清除之前的定时器
timer = setInterval(() => {
    index++;
    if(index >imgArr.length-1){
        index = 0;
    }
    for(let i =0;i<aNode.length;i++){
        aNode[i].style.backgroundColor='black';
    }
    aNode[index].style.backgroundColor='red';
    ulList.style.left = -520 * index+'px';
}, 1500);