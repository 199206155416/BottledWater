mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	queryLogList();
});

function queryLogList(){
	var strUserId = localStorage.getItem("userId"); // 用户id
	var sendData={strUserId:strUserId,pageNo:1,pageSize:500}
	$.ajax({
		url: prefix + "/refund/refundBucketList",
		type: 'POST',
		data: sendData,
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			$("#load").hide();
			var result = res.result;
			if(res.resCode == 0){
				 for(var i in result){
				 	var item=result[i];
				 	var bucketCount=item.bucketCount;//退桶个数
				 	var bucketMoney=item.bucketMoney;
				 	var createDate=item.createDate;
				 	var state=item.state;
				 	var stateName="";
				 	if(0==state||1==state){
				 		stateName="退桶中";
				 	}else if(2==state){
				 		stateName="退桶成功";
				 	}else if(3==state){
				 		stateName="退桶失败";
				 	}
				 	var strHtml='<li class="mui-table-view-cell">'+
                                '<div>'+
			                	'<p class="recharge-state">'+bucketCount+'个</p>'+
			                	'<p class="recharge-time">'+createDate+'</p>'+
				                '</div>'+
				                '<div>'+
				                	'<p class="recharge-price">+¥'+bucketMoney+'</p>'+
				                	'<p class="recharge-type">'+stateName+'</p>'+
				                '</div>'+
				            			'</li>';
				     $("#reRecordList").append(strHtml);
				 }
			}else{
				mui.toast(result);
			}
		}
	});
}