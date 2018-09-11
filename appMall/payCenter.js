var mallGoods = null;
var attrMap = null;
var slideImgList = null;
var currentSku = ""; // 已选择sku
var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var goodsId; // 商品id
var buyNowFlag = 0; // buyNowFlag == 0 点击sku选择弹层确定按钮立即购买, buyNowFlag == 1 加入购物车
var accountBalance;
var addOrderWebView;
mui.init({
	swipeBack: false
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	addOrderWebView=plus.webview.getWebviewById("appMall/addOrder.html");
	paredntWebview = currentWebview.parent();
	detailcontent = document.getElementById('detailcontent');
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		goodsId = null;
	}, false);

	factPrice = currentWebview.factPrice;
	$("#factPrice").html("￥"+factPrice);
	// 绑定事件
	bindEvent();
	getBalace();
});

/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
	$(".table-view>li").each(function(i,ele){
		$(ele).on("click",function(){
			var id=$(this).attr("id");
			if(2==id&&accountBalance<factPrice){
				alert("账户余额不足,请选择其他付款方式或充值");
				return false;
			}
			mui.fire(addOrderWebView,"choosePayType",{"payType":id});
			mui.back();
		});
	});
	
}
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
				$("#accountBalance").html(result);
			}else{
				alert(result);
			}
		}
	})
}

