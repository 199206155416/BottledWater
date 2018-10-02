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
	// 点击忘记密码页
	 forgetPassword();
	
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
			title: "忘记密码",
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
        var mobileRegs=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		  if(strMobile==""){
		     mui.toast("请输入手机号");
		     return;
		  }
		  if(strMobile.match(mobileRegs)==null){
		      mui.toast("手机号格式不正确");
		     return;
		  }
		  
		  var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
		  if(strPassword.match(regx)==null){
		    mui.toast("密码同时包含数字和字母！");
		    return;
		   }
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
					setClientInfo();
					

					//添加事件接收close事件，并且要判断是否已经登录成功，然后页面close，因为login页面是预先加载的页面
					//在这里向需要的页面发送消息事件通知已经登录做响应的处理
					loginWebview.addEventListener('hide', function() {
						mui.each(plus.webview.all(), function(index, item) {
							console.log(item.id)
						})
						var cartwebview = plus.webview.getWebviewById('appCart/cart.html');
						var minewebview = plus.webview.getWebviewById('myCenter/mine.html');
						
						mui.fire(cartwebview, 'loginSuccess', {});
						mui.fire(minewebview, 'loginSuccess', {});

						loginWebview.close();
					}, false);

					mui.back();
					mui.toast('登录成功');

				}
			}
		})
	})
}

function setClientInfo(){
	var clientId=localStorage.getItem("clientId");
    if(!clientId){
    	var pushClientInfo=plus.push.getClientInfo();
	    var token=pushClientInfo.token;
	    clientId=pushClientInfo.clientid;
	    var clientType=""//客户端类型
	    if(clientId==token){
	       clientType="android";
	    }else{
	       clientType="ios";
	    }
	    setStringValue("clientId",clientId);
	    //更新设备信息
	    updateUserClientInfo(clientId,clientType);
    }

}

/**
 * 更新用户设备信息
 * @param {Object} clientId
 * @param {Object} clientType
 */
function updateUserClientInfo(clientId,clientType){
var userId= localStorage.getItem("userId"); // 用户id
var sendData={"clientId":clientId,"clientType":clientType,"userId":userId};
  $.ajax({
		url: prefix + "/user/updateUserClientInfo",
		type: "POST",
		data: sendData,
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					
				}else{
					mui.alert(result);
				}
			}
	});
}


