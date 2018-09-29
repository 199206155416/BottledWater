mui.init({
	swipeBack: false,
	pullRefresh: {
	    container: ".container",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
			// style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			// color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			// height: '50px',//可选,默认50px.下拉刷新控件的高度,
			// range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			// offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
			// auto: true,//可选,默认false.首次加载自动上拉刷新一次
			callback: function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				// 获取余额
				getBalace();

//				setTimeout(function(){
//					mui('.container').pullRefresh().endPulldown();
//				}, 3000);
			}
	    }
  	}
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
			mui('.container').pullRefresh().endPulldown();
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
			title:"",
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
				title:"",
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		pushWebView({
			webType: 'newWebview_First',
			id: "myCenter/message.html",
			title:"",
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

