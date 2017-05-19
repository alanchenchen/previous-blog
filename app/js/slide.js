(function(){
	function mbanner(json){
		this.dom=json.dom;
		this.outer=this.dom.children[0];
		this.callback=json.callback;
		this.init();
		this.renderDom();
		this.bindDom();
	}
	//初始化
	mbanner.prototype.init=function(){
		var html=document.documentElement || document.body; 
		this.scale=html.getBoundingClientRect().width;
		this.index=0;
		//所有li的集合
		this.list=this.outer.children;
		this.len=this.list.length;
		this.numItem=[];
	}
	//初始化li的布局
	mbanner.prototype.renderDom=function(){
		var htmlW=this.scale;
		for(var i=0;i<this.len;i++){
			if(i!=0){
				this.list[i].style.transform="translate("+htmlW+"px,0)";
			}
		}
	}
	//给图片外层绑定运动函数和事件
	mbanner.prototype.bindDom=function(){
		//如果函数被绑定后，this指向了被绑定的ul元素，而并非是当前实例对象,所以需要用个变量接收
		var $this=this;
		//给外层ul绑定事件
		this.outer.addEventListener("touchstart",start);
		this.outer.addEventListener("touchmove",move);
		this.outer.addEventListener("touchend",end);
		var len=$this.len,
			li=$this.list,
			index=$this.index,
			htmlW=$this.scale;
		//初始化Y轴位移量为0
		$this.positionY=0;
		function getStyle(obj,attr){
			return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
		}
		//图片跳转主要运动函数
		function goX(n){
			if($this.moveX>n)index<=0?index=0:index-=1;
			else if($this.moveX<-n)index>=len-1?index=len-1:index+=1;
			else index=index;
			//当没跳转时，保留当前页面的Y轴位移
			if($this.moveX<n&&$this.moveX>-n){
				li[index].style.transform="translate(0,"+($this.positionY+$this.moveY)+"px)";
			}else{
				li[index]&&(li[index].style.transform="translate(0,0)");
				$this.positionY=0;
			}
			li[index-1]&&(li[index-1].style.transform="translate("+-htmlW+"px,0)");
			li[index+1]&&(li[index+1].style.transform="translate("+htmlW+"px,0)");
		}
		//手指刚触摸函数
		function start(e){
			e.preventDefault();
			$this.startX=e.touches[0].pageX;
			$this.startY=e.touches[0].pageY;
			//必须每次手指触摸时初始化位移量，否则运动会乱!
			$this.moveX=0;
			$this.moveY=0;
			//记录触摸开始时间戳
			$this.startTime=new Date().getTime()*1;
//			console.log("开始时位移量："+$this.positionY);
		}
		var boundY=parseInt(getStyle(li[index],"height"));
		//手指移动函数
		function move(e){
			$this.endX=e.targetTouches[0].pageX;
			$this.moveX=$this.endX-$this.startX;
			$this.endY=e.targetTouches[0].pageY;
			$this.moveY=$this.endY-$this.startY;
			//是否垂直位移的条件
			$this.flag=Math.abs($this.moveY)>=Math.abs($this.moveX);
			//如果往下拉，就改变当前窗口页面的translateY,否则跳转，并讲垂直位移归零
			li[index].style.transform="translate("+$this.moveX+"px,"+($this.positionY+$this.moveY)+"px)";
			li[index-1]&&(li[index-1].style.transform="translate("+($this.moveX-htmlW)+"px,0)");
			li[index+1]&&(li[index+1].style.transform="translate("+($this.moveX+htmlW)+"px,0)");
			for(var i=0;i<=len-1;i++){
				li[i].style.transition="all 0s ease-out";
			}
		}
		//手指抬起函数
		function end(e){
			e.preventDefault();
			//记录触摸结束时间戳
			$this.endTime=new Date().getTime()*1;
			//声明运动位移的边界值和时间差值
			var boundT=$this.endTime-$this.startTime;
			var boundX=htmlW/2;
			//当垂直位移大于水平位移的绝对值，只进行垂直位移，不跳转
			if($this.flag){
				//当位移超出顶部或整个wrap高度，位移量归零
				if($this.moveY>=50 || ($this.positionY+$this.moveY)<=-boundY/1.5){
					li[index].style.transform="translate(0,0)";
					$this.positionY=0;
				}
				else{
					li[index].style.transform="translate(0,"+($this.positionY+$this.moveY)+"px)";
					//记录上一次Y轴位移的距离
					$this.positionY+=$this.moveY;
				}
				li[index-1]&&(li[index-1].style.transform="translate("+-htmlW+"px,0)");
				li[index+1]&&(li[index+1].style.transform="translate("+htmlW+"px,0)");
//				console.log("移动结束时位移量："+$this.positionY);
			}
			//当触摸时间不足时，不进行切换图片
			else if(boundT<=300){
				goX(0);
//				console.log("移动结束时位移量："+$this.positionY);
			}
			else if(boundT>300){
				goX(boundX);
//				console.log("移动结束时位移量："+$this.positionY);
			}
			for(var i=0;i<=len-1;i++){
				li[i].style.transition="all .2s ease-out";
			}
			//讲此时的index值回掉出去
			$this.callback&&$this.callback(index);
		}
	}
	window.mbanner=mbanner
})(window)