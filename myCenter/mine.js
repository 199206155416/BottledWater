mui.init({
	swipeBack: false
});
var parentWebView;
var touxiangimg;
var logoutBtn;
var trueimg;
var touxiangword;
var accountBalance;
mui.plusReady(function() {
	//注册列表的点击事件
	addListevent();

	// parentWebView = plus.webview.currentWebview().parent();
	// touxiangimg = document.getElementById('touxiangimg');
	// logoutBtn = document.getElementById('logoutBtn');
	// trueimg = document.getElementById('trueimg');
	// touxiangword = document.getElementById('touxiangword');
	// //检测是否已经登录
	// trueimg.style.display = 'none';
	// logoutBtn.style.display = 'none'
	// touxiangimg.style.display = 'inline'
	// touxiangword.style.color = 'indianred'
	
	// //点击头像事件
	// addHeadevent();
	// //接收登录成功事件
	// window.addEventListener('loginSuccess', function() {
	// 	//登出按钮显示出来 头像图片显示出来名字显示出来
	// 	logoutBtn.style.display = 'block';
	// 	touxiangimg.style.display = 'none';
	// 	trueimg.style.display = 'inline';
	// 	touxiangword.innerText = "测试号";
	// 	touxiangword.style.color = 'black';
	// }, false);
	// logoutBtn.addEventListener('tap', function() {
	// 	var btnArray = ['否', '是'];
	// 	mui.confirm('确认要退出登录吗？', 'Hello MUI', btnArray, function(e) {
	// 		if (e.index == 1) {
	// 			//确定
	// 			trueimg.style.display = 'none';
	// 			logoutBtn.style.display = 'none';
	// 			touxiangimg.style.display = 'inline';
	// 			touxiangword.style.color = 'indianred';
	// 			localStorage.removeItem('user');
	// 			mui.toast("退出登录")
	// 			//发出退出登录给wishlish和cart页面
	// 			var cartwebview = plus.webview.getWebviewById('appCart/cart.html');
	// 			var xinyuandanwebview = plus.webview.getWebviewById('mallTicket/ticket.html');
	// 			mui.fire(cartwebview,'logout',{});
	// 			mui.fire(xinyuandanwebview,'logout',{})
	// 		} else {
	// 			//取消
	// 		}
	// 	});
	// }, false)
	
	renderHtml();
	getBalace();
});

//获取账户余额
function getBalace(){
	var userId= localStorage.getItem("userId"); // 用户id
	$.ajax({
		url: prefix + "/account/getBalace/"+userId,
		type: "GET",
		dataType: "json",
		success: function(res){
			ajaxLog(res);
			if(res.resCode == 0){
				var result = res.result;
				accountBalance=result;
				$("#lAccountBalance").html(result);
			}else{
				alert(result);
			}
		}
	})
}

// 渲染页面
function renderHtml(){
	var userRoleNames = localStorage.getItem("userRoleNames");
	var userMobile = localStorage.getItem("userMobile");
	
	$("#userName").html(userRoleNames);
	$("#userPhone").html(userMobile);
};

//注册列表的点击事件
function addListevent() {
	$("#mineHandleList").on('click', 'li', function() {
		var id = $(this).attr("id");
		
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
		}
		var optionsData={};
		if("appAddress/addressList.html"==id){
			optionsData={openType:1};
		}else if(id=="mycenter/accountCharge.html"){
			optionsData={accountBalance:accountBalance};
		}
		pushWebView({
			webType: 'newWebview_First',
			id: id,
			href: id,
			aniShow: aniShow,
			extendOptions: optionsData
		})
	});

	$("#messageBtn").on("click", function(){
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {
			
		}else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
			
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		pushWebView({
			webType: 'newWebview_First',
			id: "myCenter/message.html",
			href: "myCenter/message.html",
			aniShow: aniShow,
			extendOptions: {}
		})
	});
	
	// 去订单页
	$("#openOrder").on("click", '.item', function(){
		var type = $(this).attr("type"); 
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		
		if(type == -6){
			pushWebView({
				webType: 'newWebview_First',
				id: "appOrder/afterSale.html",
				href: "appOrder/afterSale.html",
				aniShow: aniShow,
				extendOptions: {}
			});
			return false;
		}
		
		pushWebView({
			webType: 'newWebview_First',
			id: "appOrder/orderList.html",
			href: "appOrder/orderList.html",
			aniShow: aniShow,
			extendOptions: {
				type: type
			}
		});
	});
	// 全部订单
	$("#myOrder").on("click", function(){
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
			
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		
		pushWebView({
			webType: 'newWebview_First',
			id: "appOrder/orderList.html",
			href: "appOrder/orderList.html",
			aniShow: aniShow,
			extendOptions: {
				type: -1
			}
		});
	});
};

