mui.init({
	swipeBack: true
});

mui.plusReady(function() {

	// 查询收货地址
	// queryAddressList();

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

