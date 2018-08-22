
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	// 查询收货地址
	queryAddressList();
	// 绑定事件
	bindEvent();

	// account = document.querySelector('input[type="text"]');
	// psd = document.querySelector('input[type="password"]');
	// login = document.getElementById('loginBtn');
	// register = document.getElementById('register');
	// repsd = document.getElementById('repsd');
	// loginWebview = plus.webview.currentWebview();
	// //检测本地的登录过的账号。
	// if (localStorage.getItem('account')) {
	// 	account.value = localStorage.getItem('account');
	// }
	// //登陆的点击事件
	// login.addEventListener('tap', function() {
	// 	//将两个数据存放起来，第一个是等出之后删除，第二个只要登录之后就会记录保存
	// 	localStorage.setItem('user', {});
	// 	mui.back();
	// 	mui.toast('登录成功');
	// 	//添加事件接收close事件，并且要判断是否已经登录成功，然后页面close，因为login页面是预先加载的页面
	// 	//在这里向需要的页面发送消息事件通知已经登录做响应的处理
	// 	loginWebview.addEventListener('hide', function() {
	// 		mui.each(plus.webview.all(), function(index, item) {
	// 			console.log(item.id)
	// 		})
	// 		var cartwebview = plus.webview.getWebviewById('appCart/cart.html');
	// 		var minewebview = plus.webview.getWebviewById('myCenter/mine.html');
	// 		var xinyuandanwebview = plus.webview.getWebviewById('mallTicket/ticket.html');
	// 		mui.fire(cartwebview, 'loginSuccess', {});
	// 		mui.fire(minewebview, 'loginSuccess', {});
	// 		mui.fire(xinyuandanwebview, 'loginSuccess', {});
	// 		loginWebview.close();
	// 	}, false);
	// }, false);
	// //注册按钮的点击事件
	// register.addEventListener('tap', function() {
	// 	pushWebView({
	// 		webType: 'newWebview_First',
	// 		id: 'myCenter/register-needtem.html',
	// 		href: 'myCenter/register-needtem.html',
	// 		aniShow: getaniShow(),
	// 		title: "注册",
	// 		isBars: false,
	// 		barsIcon: '',
	// 		extendOptions: {}
	// 	})
	// }, false);
	// //注册按钮的点击事件
	// repsd.addEventListener('tap', function() {
	// 	pushWebView({
	// 		webType: 'newWebview_First',
	// 		id: 'myCenter/forget-psd-needtem.html',
	// 		href: 'myCenter/forget-psd-needtem.html',
	// 		aniShow: getaniShow(),
	// 		title: "注册",
	// 		isBars: false,
	// 		barsIcon: '',
	// 		extendOptions: {}
	// 	})
	// }, false);
});

/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
	$("#addAddressButton").on("click", function(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appAddress/editAddress.html',
			href: 'appAddress/editAddress.html',
			aniShow: getaniShow(),
			title: "添加地址",
			isBars: false,
			barsIcon: '',
			extendOptions: {}
		})
	});
};

/**
 * 查询收货地址
 * @author xuezhenxiang
 */
function queryAddressList(){
	var userId = localStorage.getItem("userId"); // 用户id

	$.ajax({
		url: prefix + "/address/list?strUserId=" + userId,
		type: 'GET',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);

			if(res.resCode == 0){
				var result = res.result;

				for(var i = 0, len = result.length; i < len; i++){
					var addressTemplate = $("#defaultAdd").html();

					var address = $(addressTemplate);

					;(function(){
						address.on("click", function(){
							
						})
					})();

					$("#showArea").append(address);
				}
			}
		}
	});
};
