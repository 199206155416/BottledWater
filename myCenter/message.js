var userId;
var pageNo=1;

mui.init({
	swipeBack: false
});

mui.plusReady(function() {
userId= localStorage.getItem("userId"); // 用户id
getMessageList();
});
// //点击头像事件
// function addHeadevent() {
// 	//点击头像登录
// 	touxiangimg.addEventListener('tap', function() {
// 		if (!localStorage.getItem('user')) {
// 			pushWebView({
// 				webType: 'newWebview_First',
// 				id: 'login/login.html',
// 				href: 'login/login.html',
// 				aniShow: getaniShow(),
// 				title: "登录",
// 				isBars: false,
// 				barsIcon: '',
// 				extendOptions: {}
// 			})
// 		}
// 	}, false);
// }

/**
 * 消息列表
 */
function getMessageList(){
	var formData=new FormData();
 	formData.append("user.id",userId);
 	formData.append("pageNo", pageNo);
 	formData.append("pageSize",20);
	$.ajax({
		url: prefix + "/nofify/list",
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
				for(var i in result){
					var item=result[i];
					var itemSub=item.oaNotify;
					var typeName=itemSub.typeName;
					var type=itemSub["type"];
					var title=itemSub["title"];
					var content=itemSub["content"];
					var createDate=itemSub["createDate"];
					var strHtml=' <ul class="mui-table-view"><li class="mui-table-view-cell">'+
				               	'<p class="message-label">'+typeName+'</p>'+
				               	'<p>'+createDate+'</p>'+
				            '</li>'+
				            '<li class="mui-table-view-cell">'+
				              	'<p>'+content+'</p>'+
				            '</li></ul>';
					$(".mui-content").append(strHtml);
				}
				pageNo++;
				loadFlag = 1;
			}else{
			  	mui.alert(result, '提示', function(e) {
		        },"div");
			}
		}
	});
}

