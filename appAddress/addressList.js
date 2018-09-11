var openType;//打开类型
var currentWebview; // 当前子页面
var addOrderWebView;
var addressList;
var defaultAddressIndex;//默认地址索引
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	openType=currentWebview.openType;
	if(openType==0){
		addOrderWebView=plus.webview.getWebviewById("appMall/addOrder.html");
	}
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
	
   window.addEventListener('addressEvent',function(e){
			console.log(JSON.stringify(e.detail));
			var receiptAddress=e.detail;
			var dataType=receiptAddress["dataType"];
			var index=0;
			if(dataType==0){//添加地址
				 addressList.unshift(receiptAddress);
				 handelAddress(receiptAddress,0,"add");
			}else if(dataType==1){//编辑地址
				index=receiptAddress.editDataIndex;
				addressList[index]=receiptAddress;
				$("#showArea>li").eq(index).remove();
				handelAddress(receiptAddress,index,"editAdd");
			}
			
	},false);
}

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

				if(result.length == 0){
					$("#blankPage").show();
					return;
				}
				$("#blankPage").hide();
				addressList=result;
				for(var i = 0, len = result.length; i < len; i++){
				    handelAddress(result[i],i,"init");
				}
			}
			if(openType==0){//说明是从提交订单页面进入的绑定选择事件
				$(".receiveInfo").each(function(i,ele){//单击选择
					$(ele).data("index",i);
					$(ele).click(function(){
						var index=$(this).data("index");
						var chooseAddress=addressList[index];
						mui.fire(addOrderWebView,"chooseAddressEvent",chooseAddress);
					    mui.back();
					});
				});
			}
		}
	});
}

	function handelAddress(addressData,i,flag){
		          var id = addressData.id; // 地址id
		          var strReceiptUserName = addressData.strReceiptUserName; // 收货人姓名
					var strReceiptMobile = addressData.strReceiptMobile; // 收货人电话
					var strLocation = addressData.strLocation; // 收货人省市区
					var strDetailaddress = addressData.strDetailaddress; // 收货人详细地址
					var strTag = addressData.strTag; // 收货人地址标签
					var isDefault = addressData.isDefault; // 是否默认地址，0：不是，1：是
					var addressTemplate = $("#defaultAdd").html();
					if(isDefault==1){
						defaultAddressIndex=i;
					}
					addressTemplate = addressTemplate.replace("#strReceiptUserName#", strReceiptUserName);
					addressTemplate = addressTemplate.replace("#strReceiptMobile#", strReceiptMobile);
					addressTemplate = addressTemplate.replace("#strLocation#", strLocation);
					addressTemplate = addressTemplate.replace("#strDetailaddress#", strDetailaddress);
					addressTemplate = addressTemplate.replace("#strTag#", strTag);
					addressTemplate = addressTemplate.replace("#isDefault#", isDefault == 1 ? "defaultAddress" : "");
					var address = $(addressTemplate);
					address.find(".default1").data("i",i);
					address.find(".editAddress").data("i",i);
					;(function(id, address, isDefault){
						// 删除地址
						address.find(".delAddress").on("click", function(){
							var that = address;
							var btnArray = ['否', '是'];
							mui.confirm('您确定要删除当前地址吗？', '', btnArray, function(e) {
								if (e.index == 1) {
									deleteAddress(that, id);
								}
							}, "div")
						});

						// 编辑地址
						address.find(".editAddress").on("click", function(){
							var index=$(this).data("i");
							var optionsData=addressList[index];
							optionsData["index"]=index;
							optionsData["addressId"]=optionsData["id"];
							pushWebView({
								webType: 'newWebview_First',
								id: 'appAddress/editAddress.html',
								href: 'appAddress/editAddress.html',
								aniShow: getaniShow(),
								title: "编辑地址",
								isBars: false,
								barsIcon: '',
								extendOptions: optionsData
							});
						});
						// 设置默认
						address.find(".default1").on("click", function(){
							if(isDefault == 1) return;
							var userId = localStorage.getItem("userId"); // 用户id
							var that = this;
							$.ajax({
								url: prefix + "/address/setDefault",
								type: 'POST',
								data: {
									id: id,
									strUserId: userId
								},
								dataType: "json",
								success: function(res){
									if(res.resCode == 0){
										$(that)
											.addClass("defaultAddress")
											.parents(".addressDetailInfo")
											.siblings()
											.find(".default1")
											.removeClass("defaultAddress");
										  var index=$(that).data("i");
										  addressList[defaultAddressIndex]["isDefault"]=0;
										  defaultAddressIndex=index;
										   addressList[defaultAddressIndex]["isDefault"]=1;
									}
								}
							});
						})
						
					})(id, address);
					var isBindEvent=false;
					if("init"==flag){
						$("#showArea").append(address);
					}else if("add"==flag){
						$("#showArea").prepend(address);
						isBindEvent=true;
					}else if("editAdd"==flag){
						i=i-1;
						if(i<0){
							$("#showArea").prepend(address);
						}else{
							$("#showArea>li").eq(i).after(address);
						}
						isBindEvent=true;
						i=i+1;
					}
					if(isBindEvent){
						$("#showArea>li").eq(i).data("index",i);
						$("#showArea>li").eq(i).click(function(){
							var index=$(this).data("index");
							var chooseAddress=addressList[index];
							mui.fire(addOrderWebView,"chooseAddressEvent",chooseAddress);
						    mui.back();
						});
					}
					
					
	}

/**
 * 删除地址
 * @author xuezhenxiang
 */
function deleteAddress(that, id){
	if(!id) return;

	$.ajax({
		url: prefix + "/address/delete",
		type: 'POST',
		data: {
			id: id
		},
		dataType: "json",
		success: function(res){
			if(res.resCode == 0){
				mui.toast(res.result);
				that.remove();

				if($("#showArea li").length == 0){
					$("#blankPage").show();
				}
			}
		}
	});
};
