define(function(){
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
	//获取一个随机数
	function getRandom(min,max){
		return Math.floor(Math.random()*(max-min)+min+1);
	}
	//获取一个随机的颜色
	function getRandomColor(a){
		var r=getRandom(0,255),
			g=getRandom(0,255),
			b=getRandom(0,255);
			//a因为js解析器问题会出现偏差
		//注意字符串拼接
		return a?"rgba("+r+","+g+","+b+","+a+")":"rgb("+r+","+g+","+b+")";
	}
	//封装jq的addClass和removeClass
	function addClass(obj,cName){
		if(obj.className.indexOf(cName)==-1){
			if(obj.className==""){
				obj.className=cName;
			}
			else{
				obj.className+=" "+cName;
			}
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
	//将新节点放在目标节点后面
	function insertAfter(newC,target){
		var parent=target.parentNode,
			len=parent.children.length,
			next=target.nextSibling;
		//需要判断父元素里面是否只有target一个元素节点
		len>1?parent.insertBefore(newC,next):parent.appendChild(newC);
		
	}
	//对象的混入或者合并
	function jsonMix(start,target){
		//先判断传入的所有实参的数量
		var len=arguments.lenth;
		if(len==1){
			return start;
		}
		else{
			var i=1;
			//不停的将每个实参赋值给target，就可以实现所有对象混入
			while(target=arguments[i++]){
				for(var key in target){
					start[key]=target[key];
				}
			}
			return start;
		}
	}
	//重复绑定事件和移除事件
	function addEvent(obj,eName,fn){
		//兼容IE9+
		if(obj.addEventListener){
			obj.addEventListener(eName,fn,false)
		}
		//兼容IE5~IE10
		else{
			obj.attachEvent("on"+eName,fn)
		}
	}
	//注意：如果想移除事件，fn必须是有名函数，官方规定匿名函数无效!
	function removeEvent(obj,eName,fn){
		//兼容IE9+
		if(obj.addEventListener){
			obj.removeEventListener(eName,fn,false)
		}
		//兼容IE5~IE10
		else{
			obj.detachEvent("on"+eName,fn)
		}
	}
	//阻止浏览器默认行为，需要绑定事件才能执行!
	function stopDefault(e){
		e=e || event;
		//兼容IE9+
		if(e.preventDefault){
			e.preventDefault()
		}
		//兼容IE678，
		else{
			e.returnValue=false;
		}
	}
	//H5storage的设值，取值和删除
	function setStorage(key,value,flag){
		flag?sessionStorage.setItem("cc_"+key,value):localStorage.setItem("cc_"+key,value)
	}
	function getStorage(key,flag){
		return flag?sessionStorage.getItem("cc_"+key):localStorage.getItem("cc_"+key)
	}
	function removeStorage(key,flag){
		flag?sessionStorage.removeItem("cc_"+key):localStorage.removeItem("cc_"+key)
	}
	//速度调控的单一属性运动插件(可匀速可匀变速)
	//	调用的方式：
	//	SpeedMove({  
	//		obj:目标,
	//		attr:[属性，运动终点值],
	//		add:true(变速)/(匀速),		若匀速，可以不传入
	//		speed:[匀速度，加速度]		若匀速，加速度可以不传入
	//		fn:传入的回掉函数
	//	})
	var SpeedFlag=true;//自定义一个开关来监测轮播图的运动信息,必须是全局变量，才能在下面的banner函数里拿到
	function SpeedMove(json){
		var obj=json.obj;
		clearInterval(obj.timer);
		var attr=json.attr[0];
		var target=json.attr[1];
		var increase=json.add;
		var speed=json.speed[0];
		var addSpeed=json.speed[1];
		var fn=json.fn;//传入的回掉函数
		var start=Math.round(parseFloat(getAttr(obj,attr)));//不能用parseInt是因为如果给出的是小数，则直接取整会出现偏差！
		var flag=start>target;//用flag变量来存储运动的方向
		if(increase){
			speed=flag?Math.floor((target-start)/addSpeed):Math.ceil((target-start)/addSpeed);
		}
		else{
			speed=flag?-speed:speed;
		}
		SpeedFlag=false;//当运动过程中，开关关闭
		obj.timer=setInterval(function(){
			start+=speed;
			var nFlag=flag?start<=target:start>target//if语句嵌套，先判断flag成立与否。
			if(nFlag){//nFlag的值是flag判断的值，然后再判断
				start=target;
				clearInterval(obj.timer);
				if(fn)fn.call(obj);//若存在回掉函数则执行回掉函数
				SpeedFlag=true;//只有当运动完成，开关打开
			}
			if(attr=='opacity'){
				obj.style[attr]=start;
			}
			else{
				obj.style[attr]=start+"px";
			}
		},1000/60)
	}
	//时间调控多属性同时进行的运动插件
	//	调用的方式：
	//	TimeMove({  
	//		obj:目标,
	//		attr:{属性:运动终点值,属性:运动终点值,...},
	//		time:时间，以毫秒为单位
	//		fn:传入的回掉函数
	//	})
	function TimeMove(json){
		var obj=json.obj,
			attr=json.attr,
			time=json.time;
		clearInterval(obj.timer);
		var fn=json.fn;//传入的回掉函数
		var attrArr=[];
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
				clearInterval(obj.timer);
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
	//			attr:[属性,属性值],
	//			cName:选中的样式名,
	//			normalS:速度,
	//			addS:加速度，值越大，速度越来越慢
	//			loop:true(轮播)/false(不轮播),
	//			interval:轮播的间隔时间，以毫秒为单位
	//		})
	function banner(json){
		var dom=json.obj.dom;
		var picDom=json.obj.picDom;
		var numChildren=json.obj.numChildren;
		var nextBtn=json.obj.nextBtn;
		var preBtn=json.obj.preBtn;
		var event=json.e;
		var Attr=json.Attr[0];
		var attrValue=json.Attr[1];
		var onCss=json.cName;
		var normalS=json.speed[0];
		var addS=json.speed[1];
		var loop=json.loop;
		var interval=json.interval;
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
			if(SpeedFlag){
				index++;
				showBtn();
		//			console.log('箭头轮播的index值是'+index);
				go();
			}
		}
		if(preBtn){
			preBtn.onclick=function(){
				if(SpeedFlag){
					index--;
					showBtn();
					//console.log('箭头轮播的index值是'+index);
					go();
				}
			}
		}
		//点击数字轮播
		for (var i=0;i<numChildren.length;i++ ){
			numChildren[i][event]=function(){
				if(SpeedFlag){
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
		}
		//定时器轮播
		var time=null;//必须定义一个全局变量！
		var timer=function (){
			time=setInterval(function(){nextBtn.onclick();},interval)
		};
		if(loop)timer();
		//鼠标移入停止轮播
		dom.onmouseover=function(){
			clearInterval(time);
		}
		//鼠标移除继续轮播
		dom.onmouseout=function(){
			if(loop)timer();
		}
	}
	//监测设备是否为移动手持设备，若是则跳转到指定url
	function isMobile(url){
		var browser={  
				versions:function(){   
					var u = navigator.userAgent, app = navigator.appVersion;   
					return {//移动终端浏览器版本信息   
						trident: u.indexOf('Trident') > -1, //IE内核  
						presto: u.indexOf('Presto') > -1, //opera内核  
						webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
						gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
						mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
						ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
						android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
						iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器  
						iPad: u.indexOf('iPad') > -1, //是否iPad    
						webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部  
					};  
				}(),  
				language:(navigator.browserLanguage || navigator.language).toLowerCase()  
			}   
			
			//如果你是通过手机访问pc地址，那么就会跳转到你指定的地址
			if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||   
					browser.versions.iPhone || browser.versions.iPad){  
				window.location.href = url;
			}
	}
	//滚动条返回顶部
	//第一种用window.scrollTo方法
	//function goTop(speed){
	//	var speed=speed || 5;
	//	var top=document.documentElement.scrollTop || document.body.scrollTop;
	//	var timer=setInterval(function(){
	//		speed+=3;
	//		top-=speed
	//		if(top<=0){
	//			clearInterval(timer);
	//			window.scrollTo(0,0)
	//		}else{
	//			window.scrollTo(0,top)
	//		}
	//	},1000/60)
	//}
	//第二种直接让scrollTop逐渐改变到0;scrollTop属性可读可写！
	function goTop(speed){
		var timer=setInterval(function(){
			var top=document.documentElement.scrollTop || document.body.scrollTop;
			speed=Math.floor(top/speed);
			document.documentElement.scrollTop=document.body.scrollTop=top-speed;
			if(top<=0){
				clearInterval(timer);
				document.documentElement.scrollTop=document.body.scrollTop=0;
			}
		},1000/60)
	}
	//获取当前元素在其父元素类数组中的index下标值
	function getIndex(obj){
		var index=-1;
		var parent=obj.parentElement.children;
		var len=parent.length;
		for(var i=0;i<len;i++){
			if(parent[i]==obj){
				index=i;
				break;
			}
		}
		return index;
	}
	//音乐播放器组件(包括播放，暂停，，显示时长，播放模式可选，调音量，调进度等功能)
	/*使用说明：
	 * 1.使用前必须先初始化音乐组件，创建audio标签，然后加入曲目，add_src()
	 * 2.播放模式传参，播放时长回掉出去，播放状态可以直接获取来执行静音方法mute()
	 * 3.restTime()回掉出去的是一个json，可获取当前播放时长和剩余时长还有百分比来制作进度条
	 * 4.拖动播放进度条必须先暂停播放，然后根据百分比计算出music_data.currentTime并赋值，拖动结束后再次播放音乐
	 * 5.拖动声音进度条用百分比计算出music_data.volme并赋值，注意取值只能在0~1之间，包括0和1
	 * 6.totalTime()和restTime()回掉出去的所有时长均做过处理，展现形式为05：03形式
	 */
	var cc_music={
		music_data:null,
		//必须先初始播放器组件
		init:function(){
			this.music_data=document.createElement("audio")
		},
		//储存的歌曲路径
		music_src:[],
		//给src路径赋值，并返回当前路径数组的长度
		len:function(){
			this.music_data.src=this.music_src[this.index];
			return this.music_src.length
		},
		//初始从第一首歌开始播放
		index:0,
		//添加歌曲路径
		add_src:function(obj){
			var len=arguments.length;
			for(var i=0;i<len;i++){
				this.music_src.push(arguments[i])
			}
			this.len();
		},
		//播放
		plays:function(){
			this.music_data.play();
		},
		//暂停
		pauses:function(){
			this.music_data.pause();
		},
		//下一首
		next:function(){
			this.index++;
			if(this.index>this.len()-1)this.index=0;
			//每次切歌前都要先把src路径赋值
			this.len();
			this.plays();
		},
		//上一首
		prev:function(){
			this.index--;
			if(this.index<0)this.index=this.len()-1;
			//每次切歌前都要先把src路径赋值
			this.len();
			this.plays();
		},
		//随机播放
		random:function(){
			var num=Math.floor(Math.random()*this.len());
			//判断当前num随机数是否等于当前播放index
			if(this.index!=num){
				this.index=num
			}
			else{
			//判断是否会超出曲目数量
				this.index=this.index>=this.len()-1?0:this.index+1;
			}
			//每次切歌前都要先把src路径赋值
			this.len();
			this.plays();
		},
		//单曲的总时长
		totalTime:function(fn){
			//事件里的this指向不是json对象，所以用个变量接收this指向json对象
			var $this=this;
			//oncanplaythrough是加载的audio音频可以播放事件
			this.music_data.oncanplaythrough=function(){
				//durantion为audio自带属性(歌曲总时长)，用一个回掉函数返回出去
				fn&&fn($this.fixTime(this.duration))
			}
		},
		//单曲的当前时长和剩余时长
		restTime:function(fn){
			var $this=this;
			//当音乐当前播放时长发生更新时触发
			this.music_data.ontimeupdate=function(){
				//currentTime是audio自带属性(歌曲当前播放时长)
				var nowTime=$this.fixTime(this.currentTime);
				var restTime=$this.fixTime(this.duration-this.currentTime);
				var prop=Math.floor((this.currentTime/this.duration)*100);
				//用一个回掉函数将json返回出去是为了无顺序调用json
				var json={
					nowT:nowTime,
					restT:restTime,
					prop:prop,
					//返回当前曲目的index用于控制歌曲封面
					index:$this.index
				};
				fn&&fn(json);
			}
		},
		//将时长格式化
		fixTime:function(obj){
			var m=Math.floor(obj/60)//返回的分
			var s=Math.floor(obj%60)//返回的剩余秒
			return ((m<10?"0"+m:m)+":"+(s<10?"0"+s:s));//对小于10的数值做拼接处理
		},
		//判断当前是否为播放状态
		flag:function(){
			 return this.music_data.muted
		},
		//是否静音
		mute:function(){
			this.flag()?this.music_data.muted=false:this.music_data.muted=true;
		},
		//播放模式
		playMode:function(mode){
			var $this=this;
			var len=arguments.length;
			this.music_data.onended=function(){
				if(mode=="next" || len==0)$this.next();
				if(mode=="loop")$this.music_data.loop=true;$this.plays();
				if(mode=="prev")$this.prev();
				if(mode=="random")$this.random();
			}
		},
		//是否自动播放
		auto:function(flag){
			flag?this.music_data.autoplay=true:this.music_data.autoplay=false;
		}
	}
	//返回一个模块输出对象
	return {
		$:$,
		getAttr:getAttr,
		getDomByClass:getDomByClass,
		addClass:addClass,
		removeClass:removeClass,
		insertAfter:insertAfter,
		jsonMix:jsonMix,
		addEvent:addEvent,
		removeEvent:removeEvent,
		stopDefault:stopDefault,
		setStorage:setStorage,
		getStorage:getStorage,
		removeStorage:removeStorage,
		SpeedMove:SpeedMove,
		TimeMove:TimeMove,
		banner:banner,
		isMobile:isMobile,
		goTop:goTop,
		getIndex:getIndex,
		cc_music:cc_music
	}
})