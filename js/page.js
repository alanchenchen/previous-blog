window.onload=function(){
//header部分的时钟倒计时进度条
	var h_r_num=$("h_r_num");
	var h_r_slideline=$("h_r_slideline");
	var loading=$("loading");
	(function(){
		//设置全局变量，在函数里赋值，才能在全局作用域里才能使用interval
		var interval;
		var slideLine=function(){
			var nowTime=new Date().getTime();
			var nextDate=new Date().getDate()+1;
			var theMonth=new Date().getMonth()+1;
			//定义一个时间戳，自动获取当前时间的后一天的0点0分
			var tomorrow=new Date("2017/"+theMonth+"/"+nextDate);
			//自动计算后一天0点0分到此刻的时间差，作为定时器的间隔时间，优化网页性能。
			interval=(+tomorrow)-nowTime;
			console.log(new Date()+"===="+tomorrow);
			var thisYear=new Date("2017/1/1").getTime();
			var nextYear=new Date("2018/1/1").getTime();
			var lineNum=(((nowTime-thisYear)/(nextYear-thisYear))*100).toPrecision(2);
			h_r_num.innerHTML=lineNum+"%";
			h_r_slideline.style.width=lineNum+"%";
			//console.log(lineNum);
		}
		var slideword=function(){
			SpeedMove({
				obj:loading,
				attr:["width",146],
				add:false,
				speed:[0.8],
				fn:function(){
					SpeedMove({
						obj:loading,
						attr:["width",128],
						add:false,
						speed:[0.8]
					})
				}
			})		
		}
		slideLine();
		SpeedMove({
			obj:loading,
			attr:["width",350],
			add:false,
			speed:[5]
		});
		setInterval(slideLine,interval);
		setInterval(slideword,2000);
	})();
//侧边返回顶部+右侧内容悬浮
	var nav=$("nav");
	var fixed_nav=$("fixed_nav");
	var fixed=$("fixed");
	(function(){
		document.onscroll=function(){//当文档滚动条滚动时触发，获取当前dom元素top的scrollTop值，来决定是否显示返回顶部
			var top=document.documentElement.scrollTop || document.body.scrollTop;
			if(top>=351){
				TimeMove({
					obj:fixed_nav,
					attr:{"right":60,"opacity":1},
					time:150
				});
			}
			if(top<351){
				TimeMove({
					obj:fixed_nav,
					attr:{"right":-48,"opacity":0},
					time:150
				});
			}
			if(top>=1267){
				addClass(fixed,"fixed");
			}if(top<1267){
				removeClass(fixed,"fixed");
			}
		}
		fixed_nav.onclick=function(){
			goTop(12);
		}
	})();
//右侧的猜你喜欢banner
	var c_h_nav=$("c_h_nav").children,
		c_h_banner=$("c_h_banner");
	var c_h_li=getDomByClass("c_b_li",c_h_banner);
	var c_h_line=$("c_h_line");
	(function(){
		var offwidth=parseInt(getAttr(c_h_li[0],"width"));
		
		//因为IE不支持获取rem自动转换成px，判断是否是IE浏览器,如果是IE，就让offwidth变成px，不是就直接不变
		if(!!window.ActiveXObject || "ActiveXObject" in window){
			offwidth*=16
		}else{
			offwidth=offwidth;
		};
		
		//让轮播的父层盒子宽度一定，不然容易出现闪屏
		c_h_banner.style.width=offwidth*c_h_li.length+"px";
		for (var i=0;i<c_h_nav.length;i++){
			c_h_nav[i].index=i;
			c_h_nav[i].onclick=function(){
				for (var j=0;j<c_h_nav.length;j++) {
					removeClass(c_h_nav[j],"on")
				}
				var move=this.index*offwidth;
				SpeedMove({
					obj:c_h_banner,
					attr:["marginLeft",-move],
					add:true,
					speed:[0,50]
				});
				SpeedMove({
					obj:c_h_line,
					attr:["left",115*this.index],
					add:true,
					speed:[0,50]
				});
				//等到运动结束再添加样式，为了保证运动统一流畅
				addClass(this,"on");
			}
		}
	})();
//当响适应出现左侧菜单按钮时发生的侧滑
	var nav_bar=$("nav_bar"),
	    nav_replace=$("nav_replace");
	(function(){
		nav_bar.onclick=function(e){
			var e=e ||event;
			e.cancelBubble=true;
			this.style.display="none";
			SpeedMove({
				obj:nav_replace,
				attr:["left",0],
				speed:[15]
			})
		}
		document.body.onclick=function(){
			SpeedMove({
				obj:nav_replace,
				attr:["left",-800],
				speed:[15]
			});
			nav_bar.style.display="block";
		}
	})();
//音乐播放器
	var music_play=$("music_play"),
		music_mute=$("music_mute"),
		music_line=$("music_line"),
		music_title=$("music_title"),
		music_left=$("music_left"),
		music_mode=$("music_mode"),
		music_prev=$("music_prev"),
		music_next=$("music_next"),
		music_right=$("music_right"),
		musicDom=music_left.parentElement;
	var playi=music_play.children[0],
		mutei=music_mute.children[0],
		modei=music_mode.children[0],
		righti=music_right.children[0];
	var music_arr=["处处吻--杨千嬅","童话镇--陈一发儿","钟无艳--谢安琪","化身孤岛的鲸--不才","当你--回音哥","一生所爱--卢冠廷","恋爱循环--花澤香菜","Photograph--Ed Sheeran"];
	var music_msg=[["next","icon-ttpodicon1"],["loop","icon-ttpodicon"],["random","icon-suijibofangzhongzuo"]];
	//初始化播放器
	cc_music.init();
	//添加路径
	cc_music.add_src(
	"http://m2.music.126.net/3rZf3dmLBLj7UaCzwhV_Hw==/1042337023140344.mp3",
	"http://m2.music.126.net/IRNfMPZpAd_EL_oXIvtKnA==/1375489062254623.mp3",
	"http://m2.music.126.net/Ny3Pk0-_aIuTKZBbTzoETg==/1006053139423817.mp3",
	"http://m2.music.126.net/HL5n3J97-XKKxGnfOeclMQ==/18785156162198339.mp3",
	"http://m2.music.126.net/lDdHM8n_dkn-yLkisLZ0Aw==/1288627627790879.mp3",
	"http://m2.music.126.net/SJgY7p4baMA1Y9VnwD4Kbw==/2902710699681348.mp3",
	"http://m2.music.126.net/06B7rx05Y03nLNCx054kEw==/3393092910319004.mp3",
	"http://m2.music.126.net/OXeQr5tXSjc_CUxBD4Zqgg==/7742760884055835.mp3"
	);
	//自动播放
	cc_music.auto(true);
	//播放和暂停
	music_play.onclick=function(){
		if(cc_music.music_data.paused){
			cc_music.plays();
			playi.className="iconfont icon-pause fs28" ;
			removeClass(righti,"stop");
			timer();
		}
		else{
			cc_music.pauses();
			playi.className="iconfont icon-iconfontplay2 fs28" ;
			addClass(righti,"stop");
			clearInterval(time);
//			righti.style.color="#fff";
		}
	}
	//right里的图标转动
	var ideg=0;
	var time=null;
	//图标转动，同时颜色随机改变
	function spin(){
		ideg>=360?ideg=0:ideg+=10;
//		righti.style.color=getRandomColor();
		righti.style.transform="rotate("+ideg+"deg)";
	}
	var timer=function(){
		time=setInterval(spin,50)
	}
	timer();
	//上一首
	music_prev.onclick=function(){
		cc_music.prev();
		playi.className="iconfont icon-pause  fs28" ;
		//每次切歌，先要清除定时器，再开一个新的定时器，不然定时器会累加
		clearInterval(time);
		timer();
	}
	//下一首
	music_next.onclick=function(){
		cc_music.next();
		playi.className="iconfont icon-pause  fs28" ;
		//每次切歌，先要清除定时器，再开一个新的定时器，不然定时器会累加
		clearInterval(time);
		timer();
	}
	//音乐进度条和歌曲名称
	cc_music.restTime(function(t){
		music_line.style.width=t.prop+"%";
		music_title.innerHTML=music_arr[t.index];
	});
	//静音
	music_mute.onclick=function(){
		if(cc_music.flag()){
			mutei.className="iconfont icon-vol_open";
		}
		else{
			mutei.className="iconfont icon-vol_close";
		}
		cc_music.mute();
	}
	//切换播放模式
	var music_num=0;
	cc_music.playMode();
	music_mode.onclick=function(){
		++music_num;
		if(music_num>=music_msg.length)music_num=0;
		modei.className="iconfont "+music_msg[music_num][1];
		cc_music.playMode(music_msg[music_num][0]);
	}
	//折叠播放器菜单
	//加载页面先弹出播放器，然后播放音乐
	//先让整个播放器left为负，接着运动到0
	musicDom.style.left=-parseInt(getAttr(musicDom,"width"))+"px";
	SpeedMove({
		obj:musicDom,
		attr:["left",0],
		add:true,
		speed:[0,50]
	});
	//延迟2秒后收起播放器
	var music_hide=setTimeout(
		function(){
			SpeedMove({
			obj:music_left,
			attr:["width",0],
			add:true,
			speed:[0,25]
		})},2000);
	//先获取当前music_left的宽度，然后每次点击再获取一次进行比较，这样可以让宽度自动为wid
	var wid=parseInt(getAttr(music_left,"width"));
	var flag=true;
	music_right.onclick=function(){
		clearTimeout(music_hide);
		if(flag){
			SpeedMove({
				obj:music_left,
				attr:["width",wid],
				add:true,
				speed:[0,25],
				fn:function(){music_line.style.display="block";}
			});
			flag=false;
		}
		else{
			SpeedMove({
				obj:music_left,
				attr:["width",0],
				add:true,
				speed:[0,25]
			});
			music_line.style.display="none";
			flag=true;
		}
	}
}
