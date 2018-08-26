mui.init({
	swipeBack:false
});


var cartSupplierItem = [];
var cartWebview;//当前购物车webview
var needlogin;//需要登录的div
var downDiv = document.querySelector('.downDiv');

mui.plusReady(function(){
	// cartWebview = plus.webview.currentWebview();
	// needlogin = document.querySelector('.need-login');
	// downDiv.style.display = 'none';
	// //为登录按钮添加事件
	// document.querySelector('.need-login button').addEventListener('tap',function(){
	// 	var title = '登录';
	// 	pushWebView({
	// 		webType: 'newWebview_First',
	// 		id: 'login/login.html',
	// 		href: 'login/login.html',
	// 		aniShow: getaniShow(),
	// 		title: "登录",
	// 		isBars: false,
	// 		barsIcon: '',
	// 		extendOptions: {}	
	// 	})
	// },false);
	
	// //为页面显示的时候添加监听
	// cartWebview.addEventListener('show',function(){
	// 	//判断用户是否已经登录,已经登录就需要去获取购物车列表
	// 	if (localStorage.getItem('user')) {
	// 		//将登录按钮隐藏，并且去获取购物车列表或则更新购物车列表todo
	// 		needlogin.style.display = 'none';
			
	// 		if(cartSupplierItem.length <= 0) {
	// 			//去获取数据
	// 			initCartData();
	// 		}
	// 	}else {
	// 		//如果退出登录或者没有登录成功这个div将被显示出来。
	// 		needlogin.style.display = 'block';
	// 	}
	// },false);
	
	// //特殊：添加事件接收登录页面成功后发来的消息
	// window.addEventListener('loginSuccess',function(){
	// 	//页面成功后，要隐藏登录模块，然后去加载数据返回
	// 	needlogin.style.display = 'none';
	// 	initCartData();
	// },false);
	
	// //退出登录
	// window.addEventListener('logout',function(){
	// 	needlogin.style.display = 'block';
	// 	var loginDiv =  document.querySelector('.login');
	// 	loginDiv.innerHTML = '';
	// 	cartSupplierItem = [];
	// },false)
});

/**
 * 查询购物车列表
 * @author xuezhenxiang
 */
function getCartList(){
	$.ajax({
		url: prefix + "/shoppingcard/list",
		type: 'GET',
		dataType: "json",
		success: function(e){
			// 打印请求报错日志
			ajaxLog(e);

			if(e.resCode == 0){
		}
	});
};