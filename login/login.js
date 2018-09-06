var account;
var psd;
var login;
var register;
var repsd;
var loginWebview;

mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	loginWebview = plus.webview.currentWebview();

	// 登陆
	login();
	// 点击跳转注册页
	goToRegister();
	
	// //检测本地的登录过的账号。
	// if (localStorage.getItem('account')) {
	// 	account.value = localStorage.getItem('account');
	// }
});

/**
 * 忘记密码
 */
function forgetPassword(){
	$("#forgetPassword").on("click", function(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'login/forgetPassword.html',
			href: 'login/forgetPassword.html',
			aniShow: getaniShow(),
			title: "注册",
			isBars: false,
			barsIcon: '',
			extendOptions: {}
		})
	})
};

/**
 * 点击跳转注册页
 */
function goToRegister(){
	$("#registerBtn").on("click", function(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'login/register.html',
			href: 'login/register.html',
			aniShow: getaniShow(),
			title: "注册",
			isBars: false,
			barsIcon: '',
			extendOptions: {}
		})
	})
};

/**
 * 点击登陆
 */
function login(){
	$("#loginBtn").on("click", function(){
		var strMobile = $("#mobile").val().trim();
		var strPassword = $("#password").val().trim();

		$.ajax({
			url: prefix + "/user/login",
			type: "POST",
			dataType: "json",
			data: {
				mobile: strMobile,
				password: strPassword
			},
			success: function(e){
				ajaxLog(e);

				if(e.resCode == 0){
					var result = e.result;
					// 存储用户id
					setStringValue("userId", result.id);
					// 存储电话
					setStringValue("userMobile", result.mobile);
					// 存储姓名
					setStringValue("userRoleNames", result.roleNames);
					// 存储启用状态
					setStringValue("userLoginFlag", result.loginFlag);

					

					//添加事件接收close事件，并且要判断是否已经登录成功，然后页面close，因为login页面是预先加载的页面
					//在这里向需要的页面发送消息事件通知已经登录做响应的处理
					loginWebview.addEventListener('hide', function() {
						mui.each(plus.webview.all(), function(index, item) {
							console.log(item.id)
						})
						var cartwebview = plus.webview.getWebviewById('appCart/cart.html');
						var minewebview = plus.webview.getWebviewById('myCenter/mine.html');
						var xinyuandanwebview = plus.webview.getWebviewById('mallTicket/ticket.html');
						mui.fire(cartwebview, 'loginSuccess', {});
						mui.fire(minewebview, 'loginSuccess', {});
						mui.fire(xinyuandanwebview, 'loginSuccess', {});
						loginWebview.close();
					}, false);

					mui.back();
					mui.toast('登录成功');

				}
			}
		})
	})
};

