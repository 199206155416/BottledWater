mui.init({
	swipeBack:true
});
var currentWebview;
var payType=1;
mui.plusReady(function(){
	currentWebview = plus.webview.currentWebview();
    var accountBalance = currentWebview.accountBalance;
    $("#accountBalance").html(accountBalance);
	bindEvent();
	initPayChannel();
});



function bindEvent(){
	$("#chargeBtn").on("click", function(){
		var showCon="<div class='confirm-item'><input name='payTpye' value='0' type='radio' checked/>支付宝    <input name='payTpye' value='1' type='radio'/> 微信</div><div class='confirm-item'><p>支付金额：</p><p><input name='accountMoney' type='text'/></p></div>";
		var btnArray = ['取消', '确认'];
        mui.confirm(showCon, '充值', btnArray, function(e) {
            if (e.index == 1) {
                doCharge();
            }
        },"div")
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

/**
 * 初始化支付名称
 * @param {Object} payType
 */
function initPayText(){
		switch(payType){
			case 0:
			  channel=payChannels[payType];
			break;
			case 1:
			  channel=payChannels[payType];
			break;
		}
}

/**
 * 进行充值
 */
function doCharge(){
	initPayText();
	var accountMoney=$("input[name='accountMoney']").val();
	if(isNaN(accountMoney)){
		  mui.alert("只能输入数字", '提示', function(e) {
			        },"div");
	      return false;
	}
	var dataFormData=new FormData();
	var strUserId = localStorage.getItem("userId"); // 用户id
	dataFormData.append("user.id",strUserId);
	dataFormData.append("rechargeMoney",accountMoney);
	dataFormData.append("strPayType",payType);
	$.ajax({
			url: prefix + "/account/save",
			type: 'POST',
			data: dataFormData,
			contentType: false,
		    processData: false,  
			dataType: "json",
			success: function(res){
				// 打印请求报错日志
				ajaxLog(res);
				var result = res.result;
				if(res.resCode == 0){
					//进行支付
					var strPayInfo=result;
					doPay(strPayInfo);
				}else{
					 mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
	
}
//进行充值支付
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
		var payInfoNew={"appid":appid,"noncestr":noncestr,"package":package,"partnerid":partnerid,"prepayid":prepayid,"timestamp":timestamp,"sign":sign};
		var stra=JSON.stringify(payInfoNew);
		plus.payment.request(channel,stra,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                       // openPaySuccess(strOrderId);
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==0){
		plus.payment.request(channel,payInfo,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}
}



/**
 * 打开充值记录
 */
function openChargeLog(){
	pushWebView({
				webType: 'newWebview_First',
				id: 'myCenter/rechargeRecord.html_1',
				href: 'myCenter/rechargeRecord.html',
				aniShow: getaniShow(),
				title: "充值记录",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
		   });
}
