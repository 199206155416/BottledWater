mui.plusReady(function() {
	queryLogList();
});

mui.init({
	swipeBack: false
});

function queryLogList(){
	var strUserId = localStorage.getItem("userId"); // 用户id
	var sendData={strUserId:strUserId,pageNo:1,pageSize:500}
	$.ajax({
		url: prefix + "/account/log/list",
		type: 'POST',
		data: sendData,
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			var result = res.result;
			$("#load").hide();
			if(res.resCode == 0){
				 for(var i in result){
				 	var item=result[i];
				 	var state=item.state;
				 	var stateText="";
				 	switch(state){
				 		case 0:
				 		stateText="未支付";
				 		break;
				 		case 2:
				 		stateText="支付未确认";
				 		break;
				 		case 3:
				 		stateText="支付成功";
				 		break;
				 		case 4:
				 		stateText="超时关闭";
				 		break;
				 		case 5:
				 		stateText="支付失败";
				 		break;
				 	}
				 	var rechargeMoney=item.rechargeMoney;
				 	var createDate=item.createDate;
				 	var payType=item.payType;
				 	var payTypeText="";
				 	if(0==payType){
				 		payTypeText="支付宝";
				 	}else if(1==payType){
				 		payTypeText="微信";
				 	}
				 	var strHtml='<li class="mui-table-view-cell">'+
                                '<div>'+
			                	'<p class="recharge-state">'+stateText+'</p>'+
			                	'<p class="recharge-time">'+createDate+'</p>'+
				                '</div>'+
				                '<div>'+
				                	'<p class="recharge-price">+¥'+rechargeMoney+'</p>'+
				                	'<p class="recharge-type">'+payTypeText+'</p>'+
				                '</div>'+
				            			'</li>';
				     $("#rechargeRecordList").append(strHtml);
				 }
			}else{
				alert(result);
			}
		}
	});
}