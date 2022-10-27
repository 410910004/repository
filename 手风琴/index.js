//获取按钮
var btn = document.getElementsByClassName('btn');
//获取文本
var text = document.getElementsByClassName('text');
//给每个按钮一个点击
for(let i =0;i<btn.length;i++){
    btn[i].onclick = function(){
        if(text[i].style.display == 'block'){
            text[i].style.display = 'none'
        }else{
            for(let j = 0;j<text.length;j++){
                text[j].style.display = 'none'
            }
            
            if(text[i].style.display == 'none'){
                text[i].style.display = 'block';
 
            }    
        }
    }
}