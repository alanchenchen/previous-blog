//通过id获取DOM
function $(id){
	return document.getElementById(id)
}
//获取DOM节点css的兼容封装
function getAttr(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}
//解决通过className获取DOM的IE9以下的兼容封装
function getDomByClass(cName,parent){
		var parent=parent || document;
		if(parent.getElementsByClassName){
			return parent.getElementsByClassName(cName)//只有IE9+才支持
		}
		else{
			var dom=[];
			var allele=parent.getElementsByTagName("*");//获取到所有的元素节点
			for(var i=0;i<allele.length;i++){
				var arr=allele[i].className.split(" ");//将所有的元素节点的className切割成一个个数组
				for(var j=0;j<arr.length;j++){
					if(arr[j]==cName){
						dom.push(allele[i])
					}
					break;//一旦找到一个类型跟cName相同，就可以确认该元素符合，不需要继续循环
				}
			}
			return dom;
		}
	}
//封装jq的addClass和removeClass
function addClass(obj,cName){
		if(obj.className==""){
			obj.className=cName;
		}
		else{
			obj.className+=" "+cName;
		}
}
function removeClass(obj,cName){
	var arr=obj.className.split(" ");//因为字符串无法直接删除指定的字节，所以先转换成数组操作
	for(var i=0;i<arr.length;i++){
		if(arr[i]==cName){
			arr.splice(i,1);//删除等于cName的那个值
			i--;//删除重复的cName
		}
	}
	 obj.className=arr.join(" ");//再将删除后的数组变会字符串赋值给当前obj的类名
}
//速度调控的单一属性运动插件(可匀速可匀变速),因为限制了运动叠加，所有同元素多个函数调用会覆盖上个函数
//	调用的方式：
//	SpeedMove({  
//		obj:目标,
//		attr:[属性，运动终点值],
//		add:true(变速)/(匀速),       若匀速，可不传值
//		speed:[匀速度，加速度]		若匀速，加速度可以不传入
//		fn:传入的回掉函数
//	})
function SpeedMove(json){
	var obj=json.obj,
	 	attr=json.attr[0],
		target=json.attr[1],
		increase=json.add,
		speed=json.speed[0],
		addSpeed=json.speed[1],
		fn=json.fn,//传入的回掉函数
		start=Math.round(parseFloat(getAttr(obj,attr))),//不能用parseInt是因为如果给出的是小数，则直接取整会出现偏差！
		flag=start>target;//用flag变量来存储运动的方向
	clearInterval(obj.timer)//一进入函数就将当前元素的所有运动全部清除！避免多个运动的重叠
	if(increase){
		speed=flag?Math.floor((target-start)/addSpeed):Math.ceil((target-start)/addSpeed);
	}
	else{
		speed=flag?-speed:speed;
	}
	obj.timer=setInterval(function(){
		start+=speed;
		var nFlag=flag?start<=target:start>target//if语句嵌套，先判断flag成立与否。
		if(nFlag){//nFlag的值是flag判断的值，然后再判断
			start=target;
			clearInterval(obj.timer);
			if(fn)fn.call(obj);//若存在回掉函数则执行回掉函数
		}
		if(attr=='opacity'){
			obj.style[attr]=start;
		}
		else{
			obj.style[attr]=start+"px";
		}
	},1000/60)
}
//时间调控多属性同时进行的匀速运动插件
//	调用的方式：
//	TimeMove({  
//		obj:目标,
//		attr:{属性:运动终点值,属性:运动终点值,...},
//		time:时间，以毫秒为单位
//	})
function TimeMove(json){
	var obj=json.obj,
		attr=json.attr,
		time=json.time,
		fn=json.fn;//传入的回掉函数
	clearInterval(obj.timer)//一进入函数就将当前元素的所有运动全部清除！避免多个运动的重叠
	var attrArr=[];//存储目标值的数组
	for(var key in attr){
		attrArr[key]=Math.round(parseFloat(getAttr(obj,key)));//不能用parseInt是因为如果给出的是小数，则直接取整会出现偏差！
	}
	var startTime=new Date();
	obj.timer=setInterval(function(){
		var endTime=new Date();
		//s1-s0是每隔1ms移动距start的距离。s1-s0=v*(et-st),s1-s0=(target-start)/time*(endTime-startTime)
		var flag=(endTime-startTime)/time;//startTime和time是定值，endTime会不断变大，当flag=1时，s2=target
		if(flag>=1){
			flag=1;
			clearInterval(timer);
			if(fn)fn.call(obj);//若存在回掉函数则执行回掉函数
		}
		for(var key in attr){
			var s2=(attr[key]-attrArr[key])*flag+attrArr[key]
			if(key=='opacity'){
				obj.style[key]=s2;
			}
			else{
				obj.style[key]=s2+'px';
			}
		}
	},1000/60)
}
//无缝焦点轮播banner封装
//	调用的方式：
//		banner({
//			obj:{dom:最外层盒子,picDom:直接位移的ul,numChildren:小圆点的所有子元素集合,nextBtn:下一个按钮,preBtn:上一个按钮},
//			e:事件名称,
//			Attr:[属性,属性值],
//			cName:选中的样式名,
//			normalS:速度,
//			addS:加速度，值越大，速度越来越慢
//			loop:true(轮播)/false(不轮播),
//			interval:轮播的间隔时间，以毫秒为单位
//		})
function banner(json){
	var dom=json.obj.dom,
		picDom=json.obj.picDom,
		numChildren=json.obj.numChildren,
		nextBtn=json.obj.nextBtn,
		preBtn=json.obj.preBtn,
		event=json.e,
		Attr=json.Attr[0],
		attrValue=json.Attr[1],
		onCss=json.cName,
		normalS=json.speed[0],
		addS=json.speed[1],
		loop=json.loop,
		interval=json.interval;
	var index=1;//自定义一个索引值，必须设置初始值，否则点击箭头index为undefined！！
	//添加dom元素，属性，目标值，速度 
	var go=function(){
			SpeedMove({
				obj:picDom,
				attr:[Attr,attrValue*index],
				add:true,
				speed:[normalS,addS]
			})
		}

	//显示选中数字的样式
	function showBtn(){
		for (var i=0;i<numChildren.length;i++ ){
			numChildren[i].className=''
		}
		if(index>numChildren.length){
			index=1;
			picDom.style[Attr]=0+"px";
		}
		if(index<1){
			index=numChildren.length;
			picDom.style[Attr]=attrValue*(picDom.children.length-1)+"px";
		}
		numChildren[index-1].className+=onCss;
	}

	//点击箭头轮播 
	nextBtn.onclick=function(){
		index++;
		showBtn();
//			console.log('箭头轮播的index值是'+index);
		go();
	}
	preBtn.onclick=function(){
		index--;
		showBtn();
		//console.log('箭头轮播的index值是'+index);
		go();
	}
	//点击数字轮播
	for (var i=0;i<numChildren.length;i++ ){
		numChildren[i][event]=function(){
			if(this.className==onCss){
				return//此处是为了避免当myindex==index时重复调用函数，所以做此优化！
			}
			var myindex=parseInt(this.getAttribute("index"));
			index=myindex;//一定要将选中的index值更新为index，否则，下次的index是箭头点击时的原始值！
			go();
			showBtn();
			//console.log('数字轮播的index值是'+index);
		}
	}
	var flag=loop;//设置一个开关来开关自动轮播
	//定时器轮播
	var time=null;//必须定义一个全局变量！
	var timer=function (){
		time=setInterval(function(){nextBtn.onclick();},interval)
	};
	if(flag)timer();
	//鼠标移入停止轮播
	dom.onmouseover=function(){
		clearInterval(time);
	}
	//鼠标移除继续轮播
	dom.onmouseout=function(){
		if(flag)timer();
	}
}
