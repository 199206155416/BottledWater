var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var goodsId; // 商品id
var buyNowFlag = 0; // buyNowFlag == 0 点击sku选择弹层确定按钮立即购买, buyNowFlag == 1 加入购物车

mui.init({
	swipeBack: false
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	paredntWebview = currentWebview.parent();
	detailcontent = document.getElementById('detailcontent');
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		goodsId = null;
	}, false);

	goodsId = currentWebview.goodsId;
	
	//如果要获取当前页面的数据
	mui.fire(paredntWebview,'getExtendOptions',{});
	//监听返回获取到options数据
	window.addEventListener('postExtendOptions',function(e){
		console.log(JSON.stringify(e.detail.extendOptions))
	},false);
	
	// 查询商品详情
	getGoodsDetail();

	// 绑定事件
	bindEvent();
});

/**
 * 查询商品详情
 * @author xuezhenxiang
 */
function getGoodsDetail(){
	$.ajax({
		url: prefix + "/goods/detail/" + goodsId,
		type: "GET",
		dataType: "json",
		success: function(e){
			ajaxLog(e);
			if(e.resCode == 0){
				var goods = e.result.mallGoods;
				var attrMap = e.result.attrMap;
				setHtml();
			}
		}
	})
};

function setHtml() {
	// 第一步设置第一个图片滑动
	setSldiderHtml();
	// //第二步设置商品名字价钱等
	// setproductMessage();
	// //设置颜色选择
	// setChooseColor();
	// //设置评价
	// setevalute();
	// //设置店铺
	// setStore();
	// //设置相试宝贝
	// setGoodsLike();
};

/**
 * 设置图片轮播
 * @author xuezhenxiang
 */
function setSldiderHtml(){

};

/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
	// 添加购物车
	$("#addCart").on("click", function(){
		$("#mallbackground").show();
		$("#mallSelection")
			.show()
			.animate({bottom: 0}, 300);
		// 确定按钮加入购物车
		buyNowFlag = 1;
	});
	// 立即购买
	$("#buyNow, #appDetailApprove").on("click", function(){
		$("#mallbackground").show();
		$("#mallSelection")
			.show()
			.animate({bottom: 0}, 300);
		// 确定按钮加入购物车
		buyNowFlag = 0;
	});
	// 关闭sku选择弹层
	$("#closeBtn, #mallbackground").on("click", function(){
		$("#mallSelection").animate({bottom: "-8rem"}, 300, 'ease-in-out', function(){
			$("#mallbackground").hide();
			$("#mallSelection").hide();
		});
	});
	// 点击购物车
	$("#shopCart").on("click", function(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appCart/cart.html',
			href: 'appCart/cart.html',
			aniShow: getaniShow(),
			title: "购物车",
			isBars: false,
			barsIcon: '',
			extendOptions: {}
		});
	});

	// 提交按钮绑定事件
	$("#submitBtn").on("click", function(){
		if(buyNowFlag == 0){
			pushWebView({
				webType: 'newWebview_First',
				id: 'appMall/addOrder.html',
				href: 'appMall/addOrder.html',
				aniShow: getaniShow(),
				title: "提交订单",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
			});
		}else if(buyNowFlag == 1){

		}
		
	});

};
