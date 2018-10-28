mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	//注册列表的点击事件
	addListevent();
	
})
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

//注册列表的点击事件
function addListevent() {
	$("#moreList").on('click', 'li', function() {
		var id = $(this).attr("id");
		var extendOptionsData={};
		if(0==id||1==id){
			extendOptionsData={conType:id};
			id="myCenter/conshow.html";
		}
		var aniShow = getaniShow();

		pushWebView({
			webType: 'newWebview_First',
			id: id,
			href: id,
			aniShow: aniShow,
			extendOptions: extendOptionsData
		})
	});
}

/**
 * 退出登录
 */
function loginout(){
	   var userId = localStorage.getItem('userId'); // 用户id
	   var sendData={"userId":userId};
       $.ajax({
				url: prefix + "/user/loginout",
				type: "POST",
				data: sendData,
				dataType: "json",
				success: function(res){
					ajaxLog(res);
					var result=res.result;
					if(res.resCode == 0){
					   localStorage.removeItem("userId");
					   localStorage.removeItem("userMobile");
					   localStorage.removeItem("userRoleNames");
					   localStorage.removeItem("userLoginFlag");
					   localStorage.removeItem("clientId");
					   id = "login/login.html";
						aniShow = 'slide-in-bottom';
						pushWebView({
							webType: 'newWebview_First',
							id: id,
							href: id,
							aniShow: aniShow,
							extendOptions: {}
							});
					}else{
						mui.alert(result);
					}
				}
			})
}

