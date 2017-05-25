require(['page'],function(page){
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

