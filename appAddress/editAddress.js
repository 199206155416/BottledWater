var currentWebview; // 当前页面
var cityPicker3 = null; // 三级联动选择器
var id = null; // 地址id(id不为0时编辑地址否则添加新地址)
var addressId;
var editDataIndex;
var addreddListWebView;
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	addressListWebView=plus.webview.getWebviewById("appAddress/addressList.html_1");
	addressId = currentWebview.addressId;
	// 如果id存在查询地址信息
	if(addressId){
		getAddress();
		editDataIndex=currentWebview.index;
	}
	// 获取区数据
	getLocations();

	// 事件绑定
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

function bindEvent(){
     $("#strDetailaddress").click(function(){
     	openMaps();
     });
	// 选择省市区
	$("#showCityPicker3").on("click", function(){
		cityPicker3.show(function(items) {
			$("#strFullDistrictName").html(items[0].text + " " + items[1].text + " " + items[2].text);
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	});

	// 提交地址表单
	$("#btSave").on("click", function(){
		var dataObj = {};
		dataObj.strUserId = localStorage.getItem("userId"); // 用户id
		dataObj.strReceiptUserName = $("#strReceiptUserName").val().trim() || ""; // 收货人姓名
		dataObj.strReceiptMobile = $("#strReceiptMobile").val().trim() || ""; // 收货人电话
		dataObj.strLocation = $("#strFullDistrictName").html().trim() || ""; // 所在区
		dataObj.isDefault = $("#defaultAddress").is(":checked") ? 1 : 0; // 是否默认地址，0：不是，1：是
		dataObj.strDetailaddress = $("#strDetailaddress").val().trim() || ""; // 详细地址
		dataObj.strTag = $(".address-label:checked").val().trim() || ""; // 地址标签
		if(dataObj.strTag==""){
			dataObj.strTag=$("#strTag").val();
		}
		if(addressId){
			dataObj.id=addressId;
		}
		console.log("strUserId", dataObj.strUserId);

		$.ajax({
			url: prefix + "/address/save",
			type: 'POST',
			data: dataObj,
			dataType: "json",
			success: function(res){
				// 打印请求报错日志
				ajaxLog(res);

				if(res.resCode == 0){
					var result = res.result;
					if(addressId){
						mui.toast("地址编辑成功");
						dataObj["editDataIndex"]=editDataIndex;
						dataObj["dataType"]=1;
					}else{
						mui.toast("地址添加成功");
						dataObj["id"]=result;
						dataObj["dataType"]=0;
					}
					mui.fire(addressListWebView,"addressEvent",dataObj);
					mui.back();
				}
			}
		});
	});
};

/**
 * 获取区数据
 * @author 薛振翔
 */
function getLocations(){
	// $.ajax({
	// 	url: prefix + "/sys/getLocations",
	// 	type: 'GET',
	// 	dataType: "json",
	// 	success: function(res){
	// 		// 打印请求报错日志
	// 		ajaxLog(res);

	// 		if(res.resCode == 0){
	// 			var result = res.result;

				
	// 		}
	// 	}
	// });

	cityPicker3 = new mui.PopPicker({
		layer: 3
	});
	cityPicker3.setData(cityData3);
};

/**
 * 获取地址详情
 * @author xuezhenxiang
 */
function getAddress(){
	var strReceiptUserName = currentWebview.strReceiptUserName;
	var strReceiptMobile = currentWebview.strReceiptMobile;
	var strLocation = currentWebview.strLocation;
	var strDetailaddress = currentWebview.strDetailaddress;
	var isDefault = currentWebview.isDefault;
	var strTag = currentWebview.strTag;
	$("#strReceiptUserName").val(strReceiptUserName);
	$("#strReceiptMobile").val(strReceiptMobile);
	$("#strFullDistrictName").html(strLocation);
	$("#strDetailaddress").val(strDetailaddress);
	if(1==isDefault){
		$("#defaultAddress").attr("checked",true);
	}
	if("学校"==strTag){
		$("#homeAddress").removeAttr("checked");
		$("#schoolAddress").attr("checked",true);
	}else if("公司"==strTag){
		$("#homeAddress").removeAttr("checked");
		$("#companyAddress").attr("checked",true);
	}else if("家"!=strTag){
		$("#homeAddress").removeAttr("checked");
		$("#strTag").val(strTag);
	}
}

function openMaps(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appAddress/map.html',
			href: 'appAddress/map.html',
			aniShow: getaniShow(),
			title: "地图",
			isBars: false,
			barsIcon: '',
			extendOptions: {}
		})
}
