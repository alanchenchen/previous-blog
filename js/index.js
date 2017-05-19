	//头部banner
	var c_banner=$("c_picNum"),
		c_ulDom=$("c_ulDom"),
		c_picNum=$("c_picNum").getElementsByTagName("li"),
		c_next=$("c_next");
		banner({
			obj:{dom:c_banner,picDom:c_ulDom,numChildren:c_picNum,nextBtn:c_next},
			e:"onclick",
			Attr:["marginTop",-464],
			cName:"on",
			speed:[4,50],
			loop:true,
			interval:2700
		});

