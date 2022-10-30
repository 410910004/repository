//获取选项卡的li
var liNode = document.querySelectorAll("#ul1 li")
//获取选项卡li对应的div
var liDiv = document.querySelectorAll("#tab-list div")

//为每个选项卡定义点击事件
for(let i =0;i<liNode.length;i++){
    liNode[i].onclick = function(){
        for(let j =0;j<liNode.length;j++){
            liNode[j].className='';
            liDiv[j].className='hide';
        }
        liNode[i].className='active';
        liDiv[i].className='';
    }
}
