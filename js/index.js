require(['common','page'],function(common,page){
	//头部banner
	var c_banner=common.$("c_picNum"),
		c_ulDom=common.$("c_ulDom"),
		c_picNum=common.$("c_picNum").getElementsByTagName("li"),
		c_next=common.$("c_next");
	common.banner({
		obj:{dom:c_banner,picDom:c_ulDom,numChildren:c_picNum,nextBtn:c_next},
		e:"onclick",
		Attr:["marginTop",-464],
		cName:"on",
		speed:[4,50],
		loop:true,
		interval:2700
	});
	//header部分的时钟倒计时进度条
	page.dateLine();
	//侧边返回顶部+右侧内容悬浮
	page.slideTop();
	//右侧的猜你喜欢banner
	page.slideBox()
	//当响适应出现左侧菜单按钮时发生的侧滑
	page.showMenu();
	//音乐播放器
	page.miniMusic()
})

