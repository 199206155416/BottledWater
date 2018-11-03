mui.init({
	swipeBack: false
});
var bucketNum;
mui.plusReady(function() {
	bindEent();
	getBucketInfo();
	
});

function openRetreatLog(){
	pushWebView({
				webType: 'newWebview_First',
				id: 'myCenter/retreatRecord.html_1',
				href: 'myCenter/retreatRecord.html',
				aniShow: getaniShow(),
				title: "充值记录",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
		   });
}

function bindEent(){
	$("#bucketBtn").click(function(){
		  	mui.prompt('请输入退桶个数', '只能输入数字', '退桶', '', function(e) {
		  		 var num=e.value;
		  		 if(isNaN(num)){
		  		 	mui.toast('只能输入数字');
		  		 	return;
		  		 }
		  		 if(""==num){
		  		 	mui.toast('退桶个数不能为空');
		  		 	return;
		  		 }
		  		 if(num>bucketNum){
		  		 	mui.toast('退桶个数不能大于压桶个数');
		  		 	return;
		  		 }
		  		 doRetreatBucket(num);
			});
	});
}

/**
 * 
 * @param {Object} num
 */
function doRetreatBucket(num){
	  var userId= localStorage.getItem("userId"); // 用户id
	  var strMobile=localStorage.getItem("userMobile");
	  var sendData={strUserId:userId,strMobile:strMobile,bucketCount:num};
		$.ajax({
		url: prefix + "/refund/refundBucket",
		type: 'POST',
		data:sendData,
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				var data=res.result;
				mui.alert(data, '提示', function(e) {
			        },"div");
			   getBucketInfo();
			}
		}
	});
}

function getBucketInfo(){
	    var userId= localStorage.getItem("userId"); // 用户id
		$.ajax({
		url: prefix + "/user/getUserbucketNum/"+userId,
		type: 'GET',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				var data=res.result;
				bucketNum=data.bucketNum;
				var bucketMoney=data.bucketMoney;
				$("#bucketNum").html(bucketNum+"桶");
				$("#bucketMoney").html("￥"+bucketMoney);
			}
		}
	});
}