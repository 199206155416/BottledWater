mui.init({
	swipeBack: true
});
var parentWebView;
var touxiangimg;
var logoutBtn;
var trueimg;
var touxiangword;
mui.plusReady(function() {
	addListevent();
})

//注册列表的点击事件
function addListevent() {
	$("#save").on('click', function() {
		  var oldPwd=$("#oldPwd").val();
		  if(oldPwd==""){
		     mui.toast("请输入旧密码");
		     return;
		  }
		  var newPwd0=$("#newPwd0").val();
		  var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
		  if(newPwd0.match(regx)==null){
		    mui.toast("密码同时包含数字和字母！");
		    return;
		   }
		  var newPwd1=$("#newPwd1").val();
		  if(newPwd0!=newPwd1){
		  	 mui.toast("确认密码和新密码不一致");
		      return;
		  }
		  editPwd(oldPwd,newPwd0);
	});
}

/**
 * 修改密码
 * @param {Object} oldPwd
 * @param {Object} newPwd
 */
function editPwd(oldPwd,newPwd){
	   var userId = localStorage.getItem('userId'); // 用户id
	   var sendData={"userId":userId,oldPwd:oldPwd,newPwd:newPwd};
       $.ajax({
				url: prefix + "/user/editPwd",
				type: "POST",
				data: sendData,
				dataType: "json",
				success: function(res){
					ajaxLog(res);
					var result=res.result;
					if(res.resCode == 0){
					   mui.toast("修改成功");
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
						mui.toast(result);
					}
				}
			})
}





