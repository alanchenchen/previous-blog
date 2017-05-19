window.onload=function (){
//nav input onfous和onblur事件下拉商品推广
	var nav_searchTxt=$("nav_searchtxt"),
		nav_searchIcon=$("nav_searchicon"),
		nav_productShow=$("nav_productShow");
	nav_searchTxt.onfocus=function(){
		addClass(this,"on");
		addClass(nav_searchIcon,"on");
		nav_productShow.style.display="block";
	}
	nav_searchTxt.onblur=function(){
		removeClass(this,"on");
		removeClass(nav_searchIcon,"on");
		nav_productShow.style.display="none";
	}
//nav_hide选项卡
	var nav_btn=$('nav_btn').children,
		nav_hide=$('nav_hide'),
		nav_hide_list=$('nav_hide_list').children;
	//将选项卡函数闭包，避免变量名冲突
	(function(){		
		var timer=null;
		function hide(){
			for(var j=0;j<nav_hide_list.length;j++){
				nav_hide_list[j].style.display= "none";
			}
		}
		function slideDown(){
			clearTimeout(timer);
			//调用速度运动插件
			SpeedMove({
				obj:nav_hide,
				attr:["height",230],
				add:true,
				speed:[0,15]});
			nav_hide.style.display="block";
		}
		function slideUp(){
			clearTimeout(timer);
			//调用速度运动插件
			SpeedMove({
				obj:nav_hide,
				attr:["height",0],
				add:true,
				speed:[0,15]});
			timer=setTimeout(function(){nav_hide.style.display="none"},300);
		}
		for(var i=0,len=nav_hide_list.length;i<len;i++){
			nav_btn[i].index=i;
			nav_btn[i].onmouseover=function(){
				slideDown();
				hide();	
				nav_hide_list[this.index].style.display="block";
			}
	//		nav_btn[i].onmouseover=function(){//因为不会写JQ里hover的stop(true)，所以这个地方的特效是阉割的！
	//			if(slideDown() || slideUp())return;
	//			else{
	//				slideUp();
	//			}
	//		}
		}
		nav_hide.onmouseenter=function(){
			slideDown;
		}
		nav_hide.onmouseleave=function(){
			slideUp()
		}
		//console.log(nav_hide.children[0]);
	})();
	
//top_container_productview_banner淡入淡出轮播图
	var t_p_banner=$('t_p_banner'),
		t_p_li=$('t_p_uldom').children,
		t_p_num=$('t_p_num').children,
		t_p_pre=$('t_p_pre'),
		t_p_next=$('t_p_next');
	//将banner淡入淡出函数闭包，避免变量名冲突！
	(function(){
		var index=1;
		function showbanner(){
			for(var i=0,len=t_p_num.length;i<len;i++){
				SpeedMove({
					obj:t_p_li[i],
					attr:["opacity",0],
					speed:[0.02]});//只有让下一张图片淡入，前一张淡出才能做出淡入淡出的效果
				removeClass(t_p_num[i],"t_p_on");
			}
			if(index>t_p_num.length)index=1;
			if(index<1)index=t_p_num.length;
			//调用速度运动插件
			SpeedMove({
				obj:t_p_li[index-1],
				attr:["opacity",1],
				speed:[0.02]});
			addClass(t_p_num[index-1],"t_p_on");
		}
		//点击小圆点轮播
		for(var i=0,len=t_p_num.length;i<len;i++){
			t_p_num[i].onclick=function (){
				var myindex=this.getAttribute('index');
				if(index==myindex)return;
				index=myindex;
				showbanner();
				return false;
			}	
		}
		//点击箭头轮播
		t_p_next.onclick=function (){
			index++;
			showbanner();
			return false;
		}
		t_p_pre.onclick=function (){
			index--;
			showbanner();
			return false;
		}
		//自动轮播
		var timer=null;//先赋值一个空对象，否则在鼠标划入事件里找不到变量，作用域不通；
		var time=function(){
			timer=setInterval(t_p_next.onclick,3000)
		}
		time();
		t_p_banner.onmouseover=function(){
			clearInterval(timer)
		};
		t_p_banner.onmouseout=function(){
			time();
		}
	})();
	
//starProduct明星产品 焦点轮播图
	var starp_pre=$("starp_pre"),
		starp_next=$("starp_next"),
		t_sp_pic=$("t_sp_pic");
	t_sp_pic.style.width=248*t_sp_pic.children.length+"px";
	//将明星产品的banner函数闭包，避免变量名冲突
	(function(){
		function slide(num,pre,next){
			SpeedMove({
				obj:t_sp_pic,
				attr:["marginLeft",num*t_sp_pic.children.length/2],
				speed:[58]});
			removeClass(next,"on");
			if(pre.className == "iconfont fl"){
				addClass(pre,"on");
			}
		}
		starp_next.onclick=function(){
			slide(-248,starp_pre,this);
		}
		starp_pre.onclick=function(){
			slide(0,starp_next,this);
		}
		var timer=setInterval(function(){
			if(parseInt(getAttr(t_sp_pic,"marginLeft"))==0){
				starp_next.onclick();
			}
			else{
				starp_pre.onclick();
			}
		},9000)
	})();
//配件里的tab选项卡
	var m_head_nav=$("m_head_nav").children,
		m_m_p_cont=$("m_m_p_cont").children;
	//将配件选项卡函数闭包，避免变量名冲突
	(function(){
		for (var i=0;i<m_head_nav.length;i++){
			m_head_nav[i].index=i;
			m_head_nav[i].onmouseover=function(){
				for(var j=0;j<m_head_nav.length;j++){
					removeClass(m_head_nav[j],"on");
					m_m_p_cont[j].style.display="none";
				}
				addClass(this,"on");
				m_m_p_cont[this.index].style.display="block";
			}
		}
	})();
	
		
}

