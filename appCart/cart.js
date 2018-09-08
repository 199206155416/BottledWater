var cartObj = {
	list: []
};
var cartSupplierItem = [];
var cartWebview;//当前购物车webview
var needlogin;//需要登录的div
var hasBack = false;


mui.init({
	swipeBack: false
});

mui.plusReady(function(){
	cartWebview = plus.webview.currentWebview();

	hasBack = cartWebview.hasBack;

	if(hasBack == 1){
		$(".mui-action-back").show();
	}
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
	
	//特殊：添加事件接收登录页面成功后发来的消息
	window.addEventListener('loginSuccess',function(){
		// 先清空列表
		$("#shopList").html("");
		getCartList();
	},false);
	
 	//退出登录
 	window.addEventListener('logout',function(){
		// 先清空列表
		$("#shopList").html("");
 	},false)

	//接收添加购物车事件事件
	window.addEventListener('addCart', function() {
		// 先清空列表
		$("#shopList").html("");
		getCartList();
	}, false);

	// 获取购物车列表
	getCartList();

	// 事件绑定
	bindEvent();
});

/**
 * 事件绑定
 * @author xuezhenxiang
 */ 
function bindEvent(){
	// 点击右上角编辑/完成按钮
	$("#edit").on("click", function(){
		var flag = $(this).attr("flag");

		if(flag == 1){
			$(this).html("编辑").attr("flag", 0);
			$("#totalPrice").show();
			$("#toPayMent").show();
			$("#toPayDele").hide();
		}else{
			$(this).html("完成").attr("flag", 1);
			$("#totalPrice").hide();
			$("#toPayMent").hide();
			$("#toPayDele").show();
		}
	});

	// 点击结算按钮
	$("#toPayMent").on("click", function(){
		var list = cartObj.list;
		var goodsList = [];
		
		for(var i = 0, len = list.length; i < len; i++){
			if(list[i].isCheck == 1){
				goodsList.push({
					"mallGoodsSku.id": list[i].mallGoodsSku.id,
					"goodsFactPrice": list[i].mallGoodsSku.skuPrice,
					"strGoodsImg": list[i].strSpuImg,
					"strSku": list[i].mallGoodsSku.remarks,
					"strSkuName": list[i].mallGoodsSku.strSkuName,
					"nCount": list[i].skuCount
				})
			}
		}

		if(goodsList.length == 0){
			mui.toast("请选择商品");
			return false;
		}

		pushWebView({
			webType: 'newWebview_First',
			id: 'appMall/addOrder.html',
			href: 'appMall/addOrder.html',
			aniShow: getaniShow(),
			title: "提交订单",
			isBars: false,
			barsIcon: '',
			extendOptions: {
				goodsList: goodsList
			}
		});
	});

	// 点击删除按钮
	$("#toPayDele").on("click", function(){
		var list = cartObj.list;
		var deleteList = [];
		
		for(var i = 0, len = list.length; i < len; i++){
			if(list[i].isCheck == 1){
				deleteList.push({
					id: list[i].id
				})
			}
		}

		deleteCartList(deleteList);
	});

	// 切换购物车商品的选中和非选中状态
	$("#shopList").on("click", ".pitchImgleft", function(){
		var curIndex = $(this).attr("curindex");
		var isCheck = cartObj.list[curIndex].isCheck;

		if(isCheck == 1){
			cartObj.list[curIndex].isCheck = 0;
			$(this).find("img").attr({"src": "../appAddress/image/ic_yuanquan_nor@2x.png"});
			if($("#checkAll").hasClass("on")){
				$("#checkAll").removeClass("on");
			}
		}else{
			cartObj.list[curIndex].isCheck = 1;
			$(this).find("img").attr({"src": "../appAddress/image/ic_yuanquan_press@2x.png"});
		}

		calculatePrice();

	});

	// 点击全选按钮
	$("#checkAll").on("click", function(){
		var nType = $(this).hasClass("on");
		var list = cartObj.list;
		if(!nType){
			for(var i = 0, len = list.length; i < len; i++){
				cartObj.list[i].isCheck = 1;
				$(".pitchImgleft").find("img").attr({"src": "../appAddress/image/ic_yuanquan_press@2x.png"});
			}
			$(this).addClass("on");
		}else{
			for(var i = 0, len = list.length; i < len; i++){
				cartObj.list[i].isCheck = 0;
				$(".pitchImgleft").find("img").attr({"src": "../appAddress/image/ic_yuanquan_nor@2x.png"});
			}
			$(this).removeClass("on");
		}

		calculatePrice();

	});
};

/**
 * 查询购物车列表
 * @author xuezhenxiang
 */
function getCartList(){
	var strUserId = localStorage.getItem('userId'); // 用户id
	var formData = new FormData();
			
	formData.append("strUserId", strUserId);
	formData.append("pageNo", 1);
	formData.append("pageSize", 20);

	$.ajax({
		url: prefix + "/shoppingcard/list",
		type: 'POST',
		data: formData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				var result = res.result;

				if(result.length == 0){
					$("#shopPingNullTemp").show();
					$("#container").hide();
					$("#shopBottomFixd").hide();
					return false;
				}else{
					$("#shopPingNullTemp").hide();
					$("#container").show();
					$("#shopBottomFixd").show();
				}

				cartObj.list = result;
				for(var i = 0, len = result.length; i < len; i++){
					var lId = result[i].id
					var strSpuId = result[i].strSpuId;
					var strSpuImg = result[i].strSpuImg;
					var skuCount = result[i].skuCount;
					
					var mallGoodsSku = {
						id: result[i].mallGoodsSku.id,
						strSkuName: result[i].mallGoodsSku.strSkuName,
						skuStock: result[i].mallGoodsSku.skuStock,
						skuPrice: result[i].mallGoodsSku.skuPrice,
						remarks: result[i].mallGoodsSku.remarks,
					};

					var goodsTemplate = $("#goodsTemplate").html();

					goodsTemplate = goodsTemplate.replace("#lId#", lId);
					goodsTemplate = goodsTemplate.replace("#strSpuImg#", strSpuImg);
					goodsTemplate = goodsTemplate.replace("#strSkuName#", mallGoodsSku.strSkuName);
					goodsTemplate = goodsTemplate.replace("#skuPrice#", mallGoodsSku.skuPrice);
					goodsTemplate = goodsTemplate.replace("#skuStock#", mallGoodsSku.skuStock);
					goodsTemplate = goodsTemplate.replace("#skuCount#", skuCount);
					goodsTemplate = goodsTemplate.replace("#curIndex#", i);
					goodsTemplate = goodsTemplate.replace("#strSKUItemValues#", mallGoodsSku.remarks);
					

					cartObj.list[i].isCheck = 0;

					var goodsDom = $(goodsTemplate);

					;(function(goodsDom, i, skuStock){

						// 点击减少商品数量
						goodsDom.find(".left").on("click", function(){
							var nSkuCount = cartObj.list[i].skuCount-1;

							if(nSkuCount <= 1){
								nSkuCount = 1;
							}
							
							$(this).siblings(".contentNum").html(nSkuCount)
							cartObj.list[i].skuCount = nSkuCount;

							calculatePrice();
						});

						// 点击增加商品数量
						goodsDom.find(".right").on("click", function(){
							var nSkuCount = cartObj.list[i].skuCount+1;

							if(nSkuCount >= skuStock){
								nSkuCount = skuStock;
								mui.toast("库存不足")
							}
							
							$(this).siblings(".contentNum").html(nSkuCount)
							cartObj.list[i].skuCount = nSkuCount;

							calculatePrice();
						});

					})(goodsDom, i, mallGoodsSku.skuStock);

					$("#shopList").append(goodsDom);

				}
				calculatePrice();
			}
		}
	});
};

/**
 * 左滑删除
 * @author xuezhenxiang
 */ 
function deleteitem($this,event){//this指当前滑动的元素
	event.stopPropagation();
	var li = $($this).parent();
	var lId = li.attr("lid");
	
	deleteCartList([{id: lId}]);
};

/**
 * 删除购物车商品
 */ 
function deleteCartList(goodsList){
	var goodsList = goodsList || [];
	var formData = new FormData();

	for(var i = 0, len = goodsList.length; i < len; i++){
		formData.append("list["+i+"].id", goodsList[i].id);
	}

	$.ajax({
		url: prefix + "/shoppingcard/delete",
		type: 'POST',
		data: formData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				var list = cartObj.list;
				var result = [];
				var tempObj = {};

				for(var i = 0, len = goodsList.length; i < len; i++){
					var delId = goodsList[i].id;
					$("#shopList li[lid="+ delId +"]").remove();
					for(var j = 0, jLen = list.length; j < jLen; j++){
					 	var allId = list[j].id;
					 	if(allId != delId){
					 		tempObj[allId] = list[j];
					 	}
					}
				}
				
				
				for (var i = goodsList.length - 1; i >= 0; i--) {
				    var delId = goodsList[i].id;
				    $("#shopList li[lid="+ delId +"]").remove();
				    for (var j = list.length - 1; j >= 0; j--) {
				        var allId = list[j].id;
				        if (allId != delId) {
				            goodsList.splice(i, 1);
				            list.splice(j, 1);
				            break;
				        }
				    }
				}
				mui.toast("删除成功");
				cartObj.list = list;
				calculatePrice()
			}
		}
	});
};

/**
 * 计算总价/数量
 * @author xuezhenxiang
 */ 
function calculatePrice(){
	var list = cartObj.list;
	var nCount = 0;
	var nTotalPrice = 0;

	if(list.length == 0){
		$("#shopPingNullTemp").show();
		$("#container").hide();
		$("#shopBottomFixd").hide();

		return false;
	}
	
	for(var i = 0, len = list.length; i < len; i++){
		if(list[i].isCheck == 1){
			nCount += list[i].skuCount;
			nTotalPrice += list[i].skuCount*list[i].mallGoodsSku.skuPrice
		}
	}

	$("#shopNumId").html("(" + nCount + ")");
	$("#priceMoney").html("￥" + nTotalPrice);
};


/**
 * 屏幕滚动后加载列表
 */
// var loadFlag = 1;
// $(window).scroll(function(){
//     var scrollTop = $(window).scrollTop();	// 滚动高度		    
//     var scrollHeight = $(document).height(); // 文档高度
// 	var windowHeight = $(window).height(); // 文档窗口高度
	
// 	if (scrollTop + windowHeight >= scrollHeight - 300) {
// 		if(loadFlag == 1){
// 			loadFlag == 0;
// 			getCartList();
// 		}
// 	}

// });