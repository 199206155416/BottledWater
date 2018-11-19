var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var goodsList; // 待结算商品列表
var receiptAddress;//默认地址
var buyType;//购买类型
var userId;
var totalPrice=0;//订单总价
var factPrice=100;//订单实际提交价
var payType;//支付方式，2：账户余额，0：支付宝，1：微信
var strPayText;
var channel;//框架支付方式
var payChannels;
var strOrderId;//定的ID
var bucketNum=0;
var bucketMoney=0.0;
var ticketTotalCount=0;
var isSubmit=false;
var strTitle;//副标题
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
});

/**
 * 打开收货地址
 */
function openAddress(){
	pushWebView({
			webType: 'newWebview_First',
			id: "appAddress/addressList.html",
			href: "appAddress/addressList.html",
			aniShow: getaniShow(),
			title: "收货地址",
			extendOptions: {openType:0}
	});
}

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
		formData.append("mallOrderDetailList["+i+"].strTitle", strTitle);
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
		            payType=result["payType"];
		            console.log("支付渠道："+payType);
                    $("#paymentAmount").html(factPrice);
					setHtml();
					initPayChannel();
					initPayText(payType);
					var strTip=result["strTip"];
					if(strTip){
					    mui.alert(strTip, '桶押金提示', function(e) {
				        },"div");
					}
					bucketNum=result["bucketNum"];
					bucketMoney=result["bucketMoney"];
					if(bucketNum){
						$("#bucketNum").show();
						$("#bucketNumText").html(bucketNum+"/"+bucketMoney+"￥");
					}
					ticketTotalCount=result["useTickecTotalCount"];
					if(ticketTotalCount){
						$("#eleUseTickecTotalCount").show();
						$("#useTickecTotalCount").html(ticketTotalCount+"张");
					}
				}
			}
	});
}

/**
 * 初始化支付渠道
 * @param {Object} payType
 */
function initPayChannel(){
	plus.payment.getChannels(function(channels){
			payChannels=channels;
	    },function(e){
	        alert("获取支付通道失败："+e.message);
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
	var strLocation=receiptAddress["strLocation"];
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
	$("#strFullAdress").html(strLocation+" "+strDetailaddress);
}
/**
 * 设置商品
 * @author xuezhenxiang
 */
function setProduct(){
	for(var i = 0, len = goodsList.length; i < len; i++){
		var strSkuName = goodsList[i]["strSkuName"];
		var strGoodsImg = goodsList[i]["strMainImg"];
		var strTitle = goodsList[i]["strTitle"];
		var strSkuSttrs=goodsList[i]["strSkuSttrs"];
		var strSttrs=strSkuSttrs.split(",");
		for(var j in strSttrs){
			var strSttrValue=strSttrs[j];
			var n=strSttrValue.indexOf(":");
			var v=strSttrValue.substr(n+1);
			if(j==0){
				strSkuSttrs=v;
			}else{
				strSkuSttrs+=" "+v;
			}
		}
		var goodsFactPrice = goodsList[i]["goodsFactPrice"];
		var skuPrice = goodsList[i]["skuPrice"];
		var count = goodsList[i]["count"];


		var goodsTemplate = $("#goodsTemplate").html();

		goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
		goodsTemplate = goodsTemplate.replace("#strSkuName#", strSkuName);
		goodsTemplate = goodsTemplate.replace("#strSkuSttrs#", strSkuSttrs);
		goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
		goodsTemplate = goodsTemplate.replace("#nCount#", count);
		var goodsDom = $(goodsTemplate);
		$("#goodsList").append(goodsDom);
	}
}

/**
 * 初始化支付名称
 * @param {Object} payType
 */
function initPayText(payType){
		var strPayTypeText="";
		switch(payType){
			case 0:
			  channel=payChannels[payType];
			  strPayText="支付宝";
			break;
			case 1:
			  channel=payChannels[payType];
			  strPayText="微信";
			break;
			case 2:
			 strPayText="账户余额";
			break;
			case 3:
			strPayText="货到付款/线下水票";
			break;
		}
		$("#elePayTypeText").html(strPayText);
}
/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
  window.addEventListener('choosePayType',function(event){
  	    var data=event.detail;
  	    payType=parseInt(data["payType"]);
		initPayText(payType);
	},false);
	window.addEventListener('chooseAddressEvent',function(e){
			console.log(JSON.stringify(e.detail));
			receiptAddress=e.detail;
			queryDefaultAddress();
	},false);
	//选择支付方式
	$("#elePayType").on("click", function(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appMall/payCenter.html-1',
			href: 'appMall/payCenter.html',
			aniShow: getaniShow(),
			title: "支付方式",
			isBars: false, 
			barsIcon: '',
			extendOptions: {
				factPrice: factPrice,openType:0
			}
		});
	});
	//$("#payDailog").show();
	$("#doPay").on("click", function(){
		if(!receiptAddress){
			mui.toast("选择收货地址");
			return false;
		}
		var strDeliveryType=$("#strDeliveryType").val();
		if(strDeliveryType==-1){
			mui.toast("请选择配送方式");
			return false;
		}
		var showCon="<div class='confirm-item'><p>支付方式：</p><p>"+strPayText+"</p></div><div class='confirm-item'><p>支付金额：</p><p>"+factPrice+"</p></div>";
		var btnArray = ['取消', '确认'];
        mui.confirm(showCon, '立即支付', btnArray, function(e) {
            if (e.index == 1) {
                doAddOrder();
            }
        },"div");
	});

	//桶押金说明
	$("#bucketNum").on('click',function() {
		var extendOptionsData={};
		extendOptionsData={conType:3};
		id="myCenter/conshow.html";
		var aniShow = getaniShow();
		pushWebView({
			webType: 'newWebview_First',
			id: id,
			href: id,
			aniShow: aniShow,
			extendOptions: extendOptionsData
		});
	});
}

function doAddOrder(){
		if(isSubmit){
			 mui.alert("支付中", '提示', function(e) {
			        },"div");
			 return false;
		}
		var formData = new FormData();
		formData.append("buyerId", userId);
		formData.append("buyType", buyType);//购买类型分为：购物车结算和非购物车结算
		var strMobile=localStorage.getItem("userMobile");
		formData.append("strMobile", strMobile);
		formData.append("addressId", receiptAddress["id"]);//收货地址ID
		formData.append("factPrice", factPrice);
		formData.append("totalPrice", totalPrice);
		formData.append("strPayType", payType);
		var strDeliveryType=$("#strDeliveryType").val();
		formData.append("strDeliveryType", strDeliveryType);
		var strBuyerMessage=$("#strBuyerMessage").val();//商品备注
		if(!strBuyerMessage){
			strBuyerMessage="";
		}
		formData.append("remarks", strBuyerMessage);
		if(bucketNum){
			formData.append("bucketNum", bucketNum);
		   formData.append("bucketMoney", bucketMoney);
		}
		if(ticketTotalCount){
			formData.append("ticketTotalCount", ticketTotalCount);
		}
		if(strOrderId){
			formData.append("id", strOrderId);
		}
		for(var i=0;i<goodsList.length;i++){
			var itemGoods=goodsList[i];
			var strSkuId=itemGoods["strSkuId"];
			var nCount=itemGoods["count"];
			var strTitle=itemGoods["strTitle"];
			var strSkuSttrs=goodsList[i]["strSkuSttrs"];
			var strSttrs=strSkuSttrs.split(",");
			var strSkuAttr="";
			for(var j in strSttrs){
				var strSttrValue=strSttrs[j];
				var n=strSttrValue.indexOf(":");
				var v=strSttrValue.substr(n+1);
				if(j==0){
					strSkuAttr=v;
				}else{
					strSkuAttr+=" "+v;
				}
			}
			var goodsTotalPrice=itemGoods["goodsTotalPrice"];
			var goodsFactPrice=itemGoods["goodsFactPrice"];
			var useTickecCount=itemGoods["useTickecCount"];
			formData.append("mallOrderDetailList["+i+"].mallGoodsSku.id", strSkuId);
			formData.append("mallOrderDetailList["+i+"].count", nCount);
			formData.append("mallOrderDetailList["+i+"].goodsFactPrice", goodsFactPrice);
			formData.append("mallOrderDetailList["+i+"].goodsTotalPrice", goodsTotalPrice);
			formData.append("mallOrderDetailList["+i+"].waterTicketsNum", useTickecCount);
			formData.append("mallOrderDetailList["+i+"].strTitle", strTitle);
			formData.append("mallOrderDetailList["+i+"].strSkuAttr", strSkuAttr);
		}
		isSubmit=true;
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
					strOrderId=result.strOrderId;
					var strPayInfo=result.strPayInfo;
					doPay(strPayInfo);
				}else{
					 strOrderId=res.strOrderId;
					  mui.alert(result, '提示', function(e) {
			        },"div");
			        isSubmit=false;
				}
			}
		});
	}

function doPay(payInfo){
	console.log("payInfo:"+payInfo);
	if(payType==1){//微信
		var appid=payInfo["appid"];
		var noncestr=payInfo["noncestr"];
		var packagea=payInfo["package"];
		var partnerid=payInfo["partnerid"];
		var prepayid=payInfo["prepayid"];
		var timestamp=payInfo["timestamp"];
		var sign=payInfo["sign"];
		var payInfoNew={"appid":appid,"noncestr":noncestr,"package":packagea,"partnerid":partnerid,"prepayid":prepayid,"timestamp":timestamp,"sign":sign};
		var stra=JSON.stringify(payInfoNew);
		//alert("channel:"+JSON.stringify(channel)+"stra:"+stra);
		plus.payment.request(channel,stra,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        openPaySuccess(strOrderId);
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                    	isSubmit=false;
                });
	}else if(payType==0){
		plus.payment.request(channel,payInfo,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        openPaySuccess(strOrderId);
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                    isSubmit=false;
                });
	}else if(payType==2){//余额
		openPaySuccess(strOrderId);
	}
    isSubmit=false;
}

function openPaySuccess(strOrderId){
	pushWebView({
			webType: 'newWebview_First',
			id: 'appMall/paySuccess.html-1',
			href: 'appMall/paySuccess.html',
			aniShow: getaniShow(),
			title: "支付结果",
			isBars: false, 
			barsIcon: '',
			extendOptions: {
				strOrderId: strOrderId
			}
		});
}
