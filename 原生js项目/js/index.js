window.onload = function(){
    // 创建缩略图坐标
    var index = 0;
    // 获取缩略图片数据
    var imgArr = goodData.imagessrc;
    // 动态导航
    navPathData();
    function navPathData(){
         // 获取页面元素
        var navPath = document.querySelector(".wrapper .content .contentMain .navPath");
        // 获取data数据
        var data = goodData.path;
        
        for(let i = 0;i<data.length;i++){
            // 在数据最后只需要添加一个没有url的a标签且没有 /
            if(i == data.length-1){
                // 根据data数据的多少创建a标签与i标签
                var aNode = document.createElement("a");
                aNode.innerText = data[i].title;
                navPath.appendChild(aNode);
            }else{
                // 根据data数据的多少创建a标签与i标签
                var aNode = document.createElement("a");
                
                aNode.innerText = data[i].title;
                aNode.href=data[i].url;
                // 创建i标签
                var iNode = document.createElement("i");
                iNode.innerText="/";

                // 追加在页面元素
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    // 放大镜
    /**
     *  获取小图框元素设置移入事件
     *  动态创建蒙版及大图框
     *  移出时移除蒙版与大图框
     */
    bigClassBind();
    function bigClassBind(){
        // 获取小图框
        var smallPane = document.querySelector(".wrapper .content .contentMain .center .left .leftTop .smallPane")
       
        var leftTop = document.querySelector(".wrapper .content .contentMain .center .left .leftTop");
        var maskDiv = document.createElement("div");
       
   
        smallPane.onmouseenter = function(){
            // 创建蒙版
           
            maskDiv.className="mask";

            // 创建大图框
            var bigPane = document.createElement("div");
            bigPane.className="bigPane";
            // 创建图片 为大图框添加图片
            var img = document.createElement("img");
            // 点击缩略图时更换大小图片
            img.src=imgArr[index].b;

            bigPane.appendChild(img);
            // 小图框追加蒙版 大图框
            smallPane.appendChild(maskDiv);
            leftTop.appendChild(bigPane);
              // 实现蒙版拖拽功能
              smallPane.onmousemove = function(event){
                // var left = event.offsetX - maskDiv.offsetWidth/2;
                // var top = event.offsetY - maskDiv.offsetHeight/2;
                // console.log(left,top)
   
                var left = event.clientX -smallPane.getBoundingClientRect().left- maskDiv.offsetWidth/2;
                var top = event.clientY -smallPane.getBoundingClientRect().top- maskDiv.offsetHeight/2;
                if(left<0){
                    left= 0
                }else if(left> maskDiv.offsetWidth){
                    left = maskDiv.offsetWidth
                }

                if(top<0){
                    top= 0
                }else if(top> maskDiv.offsetHeight){
                    top= maskDiv.offsetHeight
                }
                
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";  
                // 小图片能移动的距离：(小图框的宽度（小图片的宽度）-蒙版的宽度)
                // 大图片能移动的距离：(大图片的宽度-大图框的宽度) 
                // 移动比例  ： (小图框的宽度-蒙版的宽度)/(大图片的宽度-大图框的宽度) 
                // 大图片的移动距离 等于小图片移动的距离/移动比例
                var scale = (smallPane.clientWidth-maskDiv.offsetWidth)/(img.offsetWidth-bigPane.clientWidth)
                img.style.left = -left/scale +"px"
                img.style.top = -top/scale+"px"
            }
            // 鼠标移出小图框时去除蒙版与大图框
            smallPane.onmouseleave = function(){
                smallPane.removeChild(maskDiv)
                leftTop.removeChild(bigPane)
            }
        }
    }

    // 缩略图
    thumbnaiData();
    function thumbnaiData(){
        // 获取页面元素
        var ulNode = document.querySelector(".wrapper .content .contentMain .center .left .leftBottom .imgList ul");

        // 根据数据长度创建li
        for(let i =0; i<imgArr.length;i++){
            // 创建li和img元素
            var linode = document.createElement("li");
            var images = document.createElement("img");
            // 获取图片数据
            images.src = imgArr[i].s;
            // 将图片添加到li上
            linode.appendChild(images);
            // 将li添加到ul
            ulNode.appendChild(linode);
        }
        
    }

    // 点击缩略图实现小图大图
    thumbnaiClick();
    function thumbnaiClick(){
        var lis = document.querySelectorAll(".wrapper .content .contentMain .center .left .leftBottom .imgList ul li")
        var smallImg = document.querySelector(".wrapper .content .contentMain .center .left .leftTop .smallPane img")
        
        // 为每个li设置点击事件
        for(let i = 0;i<lis.length;i++){
            lis[i].onclick = function(){
                index=i;
                smallImg.src = imgArr[index].s;
            }
        }
        
    }

    // 点击左右箭头实现图片切换
    thumbnaiLeftAndRightClick();
    function thumbnaiLeftAndRightClick(){
      
        // 获取div ul li
        var uls = document.querySelector(".wrapper .content .contentMain .center .left .leftBottom .imgList ul")
        var lies = document.querySelectorAll(".wrapper .content .contentMain .center .left .leftBottom .imgList ul li")
        var timer;
        var start =0;
        var end =(lies.length-5) * (lies[0].offsetWidth +19);
      
        clearInterval(timer)
        timer = setInterval(() => {
            start +=  lies[0].offsetWidth +19;
            if( start > end){
                start = 0
            }
            uls.style.left = -start+"px";
            
        }, 1000);
    }

    // 动态渲染商品
    thumbnaiRightTop();
    function thumbnaiRightTop(){
        // 获取数据 获取页面元素 使用模板字符串进行交互数据
        var rightTop = document.querySelector(".wrapper .content .contentMain .center .right .rightTop");
        // 获取交互数据
        var goodsDetail = goodData.goodsDetail;
      
        // 使用模板字符串
        var str = `<h3>${goodsDetail.title}</h3>
                <p class="description">${goodsDetail.recommend}</p>
                <div class="rightMiddle clearfix">
                    <div class="priceDes clearfix">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>                                      
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="sales clearfix">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>` ;
        rightTop.innerHTML=str;
    }

    // 动态渲染商品详情数据
    thumbnaiShopDetail();
    function thumbnaiShopDetail(){
        // 获取chooseWrap元素
        var chooseWrap = document.querySelector(".wrapper .content .contentMain .center .right .rightBottom .chooseWrap");
        // 获取数据
        var crumbData = goodData.goodsDetail.crumbData;
       
        for(let i =0;i<crumbData.length;i++){
            // 创建dl dt dd三个元素
            var dl = document.createElement("dl")
            // 添加元素
            chooseWrap.appendChild(dl);

            var dt = document.createElement("dt");
            dt.innerHTML = crumbData[i].title;
            dl.appendChild(dt);
            for(let j = 0;j<crumbData[i].data.length;j++){
                var dd = document.createElement("dd");
                dd.innerHTML = crumbData[i].data[j].type;
                dd.price = crumbData[i].data[j].changePrice;
                // dd.setAttribute("price",crumbData[i].data[j].changePrice);
                dl.appendChild(dd);
            }

        }
        
    }


    // 实现商品详情数据的数据排他
    thumbnaiShopDetailClick();
    function thumbnaiShopDetailClick(){
        /**
         *  获取dl 从dl中获取dd 为每个dd设置点击事件 从中遍历排他
        */
       var dl = document.querySelectorAll(".wrapper .content .contentMain .center .right .rightBottom .chooseWrap dl");
       var choose = document.querySelector(".wrapper .content .contentMain .center .right .rightBottom .chooseWrap .choose")
       var arr = new Array(dl.length);
       
       arr.fill(0);
       for(let i = 0;i<dl.length;i++){
        // 使用闭包可以将最外层的i值存储起来进行使用
        // 使用一般写法在该函数方法中无法定位到具体第几行dl,
        // i的值至始至终都是最后一行的值  4
        // i表示点的第几行 0
        // j表示第几行中的第几个 0 2
       
            (function(){
                var dd = dl[i].querySelectorAll("dd") 
                    for(let j =0;j<dd.length;j++){
                        dd[j].onclick = function(){
                            for(let k=0;k<dd.length;k++){
                                dd[k].style.color ="#666";
                            }
                           
                            dd[j].style.color ="red";
                            arr[i] =dd[j];
                            thumbnaiPriceChange(arr)
                            // 遍历数组当数组的值不为零时，创建元素并添加到页面中，
                            // 在遍历的过程中会从第一个值开始遍历 所以会有重复值 需要清空
                            choose.innerHTML="";
                            // index 为数组的下标 将数组的下标作为删除按钮的序号
                            arr.forEach(function(value,index){
                                if(value){
                                    var markDiv = document.createElement("div");
                                    markDiv.className="mark";
                                    var a = document.createElement("a");
                                    a.innerHTML="X";
                                    a.setAttribute('index',index);
                                    markDiv.innerHTML= value.innerHTML;
                                    markDiv.appendChild(a);
                                    choose.appendChild(markDiv);
                                }
                            }) 

                           //获取a标签
                        //  删除a标签 主要：根据数组的下标跟dl的行数对应上
                            var aNOdes = document.querySelectorAll(".wrapper .content .contentMain .center .right .rightBottom .chooseWrap .choose .mark a")
                        
                            for(let u =0;u<aNOdes.length;u++){
                                aNOdes[u].onclick =function(){
                                    // 获取删除标签的下标
                                    var idx = aNOdes[u].getAttribute("index");
                                    console.log(idx)
                                    // 将点击的设置为0方便上面判断时不在创建新元素
                                    arr[idx]=0;
                                  
                                    var d = dl[idx].querySelectorAll("dd");
                                    for(let a = 0;a<d.length;a++){
                                        d[a].style.color="#666";
                                    }
                                    thumbnaiPriceChange(arr)
                                    choose.removeChild(aNOdes[u].parentElement)
                                }
                            }   
                        }
                    }                   
            })(i);
        }
    }

    // 实现选择商品属性时商品价格变更功能
    function thumbnaiPriceChange(arr){
        /**
         *  1.获取商品原始价格
         *  2.获取更换商品属性后的价格
         *  3.原始价格+更换后的价格
         */
        // oldPrice <p>5299</p>
        var oldPrice = document.querySelector(".wrapper .content .contentMain .center .right .rightTop .rightMiddle .priceDes .price p");
        var leftPrice = document.querySelector(".wrapper .bottom .bottomRight .bottomRightTop .listWrap .left span")
        var iptPrice = document.querySelector(".wrapper .bottom .bottomRight .bottomRightTop .listWrap .right > div div span");
        var price = goodData.goodsDetail.price;
        for(let i = 0;i<arr.length;i++){
            if(arr[i]){
                console.log(arr[i].price)
                price +=Number(arr[i].price);
            }
        }
        oldPrice.innerHTML = price;
        leftPrice.innerHTML ='￥'+ price;
        iptPrice.innerHTML='￥'+price;
    }
    
    // 实现点击单选框更新商品价格
    thumbnaiClickCheckPrice();
    function thumbnaiClickCheckPrice(){
        var ipts = document.querySelectorAll(".wrapper .bottom .bottomRight .bottomRightTop .listWrap .middle div input");
        var leftPrice = document.querySelector(".wrapper .bottom .bottomRight .bottomRightTop .listWrap .left span")
        var iptPrice = document.querySelector(".wrapper .bottom .bottomRight .bottomRightTop .listWrap .right > div div span");
        var oldPrice = document.querySelector(".wrapper .content .contentMain .center .right .rightTop .rightMiddle .priceDes .price p");

        for(let i = 0;i<ipts.length;i++){
            ipts[i].onclick = function(){
                var oldIptPrice = Number(leftPrice.innerHTML.slice(1));
              
                for(let j =0;j<ipts.length;j++){
                    if(ipts[j].checked){
                
                        oldIptPrice =   oldIptPrice + Number(ipts[i].value);
                        
                    }
                    
                }
                iptPrice.innerHTML = '￥'+ oldIptPrice;
                oldPrice.innerHTML ='￥'+ oldIptPrice;
            }

        }
       
    }


    // 实现选项卡功能
    swapClick();
    function swapClick(){
        // 获取选项卡及内容
        var tab = document.querySelectorAll(".wrapper .bottom .bottomLeft .bottomLeftTop h4");
        var tabContent = document.querySelectorAll(".wrapper .bottom .bottomLeft .bottomContent >div")
      
        for(let i = 0;i<tab.length;i++){
            tab[i].onclick = function(){
                for(let j =0;j<tab.length;j++){
                    tab[j].className="";
                    tabContent[j].className="hide"
                }
                tab[i].className="active";
                tabContent[i].className=""
            }
        }
    }

    swapClickTab()
    function swapClickTab(){
        var aTab = document.querySelectorAll(".wrapper .bottom .bottomRight .bottomDtail .tabBtn ul li");
        var tabContents = document.querySelectorAll(".wrapper .bottom .bottomRight .bottomDtail .tabContens div");
    
        for(let i = 0; i<aTab.length;i++){
            aTab[i].onclick = function(){
                for(let j = 0;j<aTab.length;j++){
                    aTab[j].className="";
                    tabContents[j].className="hide";
                }
                aTab[i].className="active";
                tabContents[i].className="";
            }   
        }
    }
}