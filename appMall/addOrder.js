var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var goodsList; // 待结算商品列表
var receiptAddress;//默认地址
var buyType;//购买类型
var userId;
var totalPrice=0;//订单总价
var factPrice=100;//订单实际提交价
var payType=1;//支付方式
var channel;//框架支付方式
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

	goodsList = currentWebview.goodsList;
	
	buyType=currentWebview.buyType;

	//如果要获取当前页面的数据
	mui.fire(paredntWebview,'getExtendOptions',{});
	//监听返回获取到options数据
	window.addEventListener('postExtendOptions',function(e){
		console.log(JSON.stringify(e.detail.extendOptions))
	},false);

 	userId= localStorage.getItem("userId"); // 用户id
	getPayDetail();

	// 绑定事件
	bindEvent();
	plus.payment.getChannels(function(channels){
	 	//console.log("channels:"+JSON.stringify(channels));
        channel=channels[payType];
        console.log(JSON.stringify(channel));
    },function(e){
        alert("获取支付通道失败："+e.message);
    });
});

function getPayDetail(){
	var formData = new FormData();
	formData.append("buyerId", userId);
	formData.append("buyType", buyType);//购买类型分为：购物车结算和非购物车结算
	for(var i=0;i<goodsList.length;i++){
		var itemGoods=goodsList[i];
		var strSkuId=itemGoods["mallGoodsSku.id"];
		var nCount=itemGoods["nCount"];
		formData.append("mallOrderDetailList["+i+"].mallGoodsSku.id", strSkuId);
		formData.append("mallOrderDetailList["+i+"].count", nCount);
	}
	$.ajax({
		url: prefix + "/pay/getPayDetail",
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,  
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				if(res.resCode == 0){
					var result=res.result;
					goodsList=result["goodsData"];
					receiptAddress=result["defaultAddress"];
		            factPrice=result["factPrice"];
		            totalPrice=result["totalPrice"];
                    $("#paymentAmount").html(factPrice);
					setHtml();
				}
			}
	});
}

function setHtml() {
	// 第一步查询默认地址
	if(receiptAddress){
		queryDefaultAddress();
	}
	//第二步设置商品
	setProduct();
	// //设置颜色选择
	// setChooseColor();
	// //设置评价
	// setevalute();
	// //设置店铺
	// setStore();
	// //设置相试宝贝
	// setGoodsLike();
}

/**
 * 设置收货地址
 * @author xuezhenxiang
 */
function queryDefaultAddress(){
	var strReceiptUserName=receiptAddress["strReceiptUserName"];
	var strReceiptMobile=receiptAddress["strReceiptMobile"];
	var strDetailaddress=receiptAddress["strDetailaddress"];
	var isDefault=receiptAddress["isDefault"];
	var strIsDefault="";
	if(1==isDefault){
		strIsDefault="默认";
	}else{
		strIsDefault="非默认";
	}
	$("#strConsigneeName").html(strReceiptUserName);
	$("#strIsDefault").html(strIsDefault);
	$("#strMobile").html(strReceiptMobile);
	$("#strFullAdress").html(strDetailaddress);
}
/**
 * 设置商品
 * @author xuezhenxiang
 */
function setProduct(){
	for(var i = 0, len = goodsList.length; i < len; i++){
		var strSkuName = goodsList[i]["strSkuName"];
		var strGoodsImg = goodsList[i]["strMainImg"];
		var remarks = goodsList[i]["remarks"];
		var goodsFactPrice = goodsList[i]["goodsFactPrice"];
		var skuPrice = goodsList[i]["skuPrice"];
		var count = goodsList[i]["count"];

		var goodsTemplate = $("#goodsTemplate").html();

		goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
		goodsTemplate = goodsTemplate.replace("#strSkuName#", strSkuName);
		goodsTemplate = goodsTemplate.replace("#remarks#", remarks);
		goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
		goodsTemplate = goodsTemplate.replace("#nCount#", count);

		var goodsDom = $(goodsTemplate);
		$("#goodsList").append(goodsDom);
	}
}

/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
	// 点击确定按钮
	var strPayText="";//支付方式
	if(payType==0){
		strPayText="支付宝";
	}else if(payType==1){
		strPayText="微信";
	}else if(payType==2){
		strPayText="账户余额";
	}
	var showCon="<div class='confirm-item'><p>支付方式：</p><p>"+strPayText+"</p></div><div class='confirm-item'><p>支付金额：</p><p>"+factPrice+"</p></div>";
	//$("#payDailog").show();
	$("#doPay").on("click", function(){
		var btnArray = ['取消', '确认'];
        mui.confirm(showCon, '立即支付', btnArray, function(e) {
            if (e.index == 1) {
                doAddOrder();
            }
        },"div")
	});
}

function doAddOrder(){
		var formData = new FormData();
		formData.append("buyerId", userId);
		formData.append("buyType", buyType);//购买类型分为：购物车结算和非购物车结算
		var strMobile=localStorage.getItem("userMobile");
		formData.append("strMobile", strMobile);
		formData.append("addressId", receiptAddress["id"]);//收货地址ID
		formData.append("factPrice", factPrice);
		formData.append("totalPrice", totalPrice);
		formData.append("strPayType", payType);
		for(var i=0;i<goodsList.length;i++){
			var itemGoods=goodsList[i];
			var strSkuId=itemGoods["strSkuId"];
			var nCount=itemGoods["count"];
			var goodsTotalPrice=itemGoods["goodsTotalPrice"];
			var goodsFactPrice=itemGoods["goodsFactPrice"];
			var useTickecCount=itemGoods["useTickecCount"];
			formData.append("mallOrderDetailList["+i+"].mallGoodsSku.id", strSkuId);
			formData.append("mallOrderDetailList["+i+"].count", nCount);
			formData.append("mallOrderDetailList["+i+"].goodsFactPrice", goodsFactPrice);
			formData.append("mallOrderDetailList["+i+"].goodsTotalPrice", goodsTotalPrice);
			formData.append("mallOrderDetailList["+i+"].waterTicketsNum", useTickecCount);
		}
		$.ajax({
		url: prefix + "/order/save",
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,  
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					console.log(result);
					doPay(result.strPayInfo);
				}else{
					  mui.alert(result, '提示', btnArray, function(e) {
			        },"div")
				}
			}
		});
		
	}

function doPay(payInfo){
	console.log("payInfo:"+payInfo);
	if(payType==1){//微信
		var appid=payInfo["appid"];
		var noncestr=payInfo["noncestr"];
		var package=payInfo["package"];
		var partnerid=payInfo["partnerid"];
		var prepayid=payInfo["prepayid"];
		var timestamp=payInfo["timestamp"];
		var sign=payInfo["sign"];
		var a={"appid":appid,"noncestr":noncestr,"package":package,"partnerid":partnerid,"prepayid":prepayid,"timestamp":timestamp,"sign":sign};
		console.log("a:"+a);
		var stra=JSON.stringify(a);
		console.log("stra:"+stra);
		alert(stra);
		plus.payment.request(channel,stra,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        console.log("跳支付页面");
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==0){
		plus.payment.request(channel,payInfo,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        console.log("跳支付页面");
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==2){//余额
		
	}
}
