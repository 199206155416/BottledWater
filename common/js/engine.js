(function(own) {
// 请求前缀
own.prefix = 'http://www.zhilonggk.com/api/';
//own.prefix = 'http://47.93.61.246/api/';
// 接口请求打印日志
own.ajaxLog = function(res){
	console.log(JSON.stringify(res));
	if(res.resCode != 0){
		mui.toast(res.result);
	}
};

// 存储数据
own.setStringValue = function(name, str){
	localStorage.setItem(name, str);
}

//当页面hide的时候将其中的页面close掉
own.closeChildWebviewOfhide = function(currentWebview, closedWebviewId) {
	currentWebview.addEventListener('hide', function() {

		var closeWeb = plus.webview.getWebviewById(closedWebviewId);

		if (!currentWebview.getURL() || !closeWeb) {
			return;
		}
		closeWeb.close();
		closeWeb = null;
	}, false);
}
//当页面close的时候将其中的页面close掉
own.closeChildWebviewOfclose = function(currentWebview, closedWebviewId) {
	currentWebview.addEventListener('close', function() {
		var closeWeb = plus.webview.getWebviewById(closedWebviewId);
		if (!currentWebview.getURL() || !closeWeb) {
			return;
		}
		closeWeb.close();
		closeWeb = null;
	}, false);
}

//一般情况下设置anishow
own.getaniShow = function() {
	var aniShow = 'slide-in-right';
	if (mui.os.android) {
		var androidlist = document.querySelectorAll('ios-only');
		if (androidlist) {
			mui.each(androidlist, function(num, obj) {
				obj.style.display = 'none';
			});
		}

		if (parseFloat(mui.os.version) < 4.4) {
			aniShow = 'slide-in-right';
		}
	}

	return aniShow;
}

own.pushWebView = function(options) {
	var webview = plus.webview.getWebviewById('template');
	mui.fire(webview, options.webType, {
		id: options.id,
		href: options.href,
		aniShow: options.aniShow,
		title: options.title,
		isBars: options.isBars,
		createNew: options.createNew,
		barsIcon: options.barsIcon,
		extendOptions: options.extendOptions
	});
}

//设置是否需要bounce，一般有scroll的地方会将bounce取消掉
own.setSubWebviewBounce = function(bounce) {
	var curSubWebview = plus.webview.currentWebview();
	curSubWebview.setStyle({
		bounce: bounce
	});
}

own.setMask = function(options) {

	var menu = null;
	
	var mask = null;
	var maskBool = true;
	var main = plus.webview.getWebviewById('HBuilder');
	mui.fire(main, 'showMask', {
		'id': plus.webview.currentWebview().id
	});

	if (mask == null) {

		mask = mui.createMask(function() { 
			
			
			console.log(maskBool);
			if (maskBool == true) {

				mui.fire(main, 'hiddeMask', {});
				
			}
		});
	} else {

		maskBool = true;
	}
	mask.show();


	document.addEventListener('hiddeMask', function() {

		maskBool = false;
		mask.close();
	});
	
	
 	menu = mui.preload({
		id: 'offcanvas-drag-left-plus-menu',
		url: '../event/webview_Alert.html',
		styles: {
			left: "30%",
			height:'200px',
			width:'200px',
			zindex: 99999
		}
	});
		
	var main = plus.webview.currentWebview();
	menu.show();
	
};

/**
 * 名称截取方法
 * @author xuezhenxiang
 * @param strName 需要截取的名称
 * @param length 需要截取的长度 不传默认截取10个字 传值1个字等于2个字符
 * @returns
 */
own.commonNameSubstr = function(str, sub_length) {
	str = str.trim();
	var temp1 = str.replace(/[^\x00-\xff]/g, "**"); // 精髓
	var mlength = 22;
	if (sub_length == undefined) {
		var temp2 = temp1.substring(0, mlength);
		//找出有多少个*
		var x_length = temp2.split("\*").length - 1;
		var hanzi_num = x_length / 2;
		var sub_length = mlength - hanzi_num;//实际需要sub的长度是总长度-汉字长度
		var res = str.substring(0, sub_length);
	} else {
		var temp2 = temp1.substring(0, sub_length);
		//找出有多少个*
		var x_length = temp2.split("\*").length - 1;
		var hanzi_num = x_length / 2;
		var sub_length = sub_length - hanzi_num;//实际需要sub的长度是总长度-汉字长度
		var res = str.substring(0, sub_length);
	}
	if (sub_length < str.length) {
		var end = res + "...";
	} else {
		var end = res;
	}
	return end;
}

})(window);