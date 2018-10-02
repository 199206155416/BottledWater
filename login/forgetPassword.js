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
	      var mobileRegs=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		  var mobile=$("#mobile").val();
		  if(mobile==""){
		     mui.toast("请输入手机号");
		     return;
		  }
		  if(mobile.match(mobileRegs)==null){
		      mui.toast("手机号格式不正确");
		     return;
		  }
		  var strCode=$("#strCode").val();
		  if(strCode==undefined||""==strCode){
		       mui.toast("请输入验证码");
		        return;
		  }
		  
		   var regx4 =/^\d{4}$/;
		  if(strCode.match(regx4)==null){
		    mui.toast("验证码只能是4位数字");
		    return;
		   }
		  var password=$("#password").val();
		  var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
		  if(password.match(regx)==null){
		    mui.toast("密码同时包含数字和字母！");
		    return;
		   }
		  
		  forgetPwd(mobile,strCode,password);
	});
}

/**
 * 修改支付密码
 * @param {Object} strCode
 * @param {Object} paypassword
 */
function forgetPwd(mobile,strCode,password){
	   var userId = localStorage.getItem('userId'); // 用户id
	   var sendData={"userId":userId,mobile:mobile,strUserSmsCode:strCode,password:password};
       $.ajax({
				url: prefix + "/user/forgetPwd",
				type: "POST",
				data: sendData,
				dataType: "json",
				success: function(res){
					ajaxLog(res);
					var result=res.result;
					if(res.resCode == 0){
					   mui.toast("修改成功");
					   mui.back(); 
					}else{
						mui.toast(result);
					}
				}
			})
}

var timer0;
var num=60;
var flag=false;
function getMsgCode(){
   var mobileRegs=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
   var mobile=$("#mobile").val();
		  if(mobile==""){
		     mui.toast("请输入手机号");
		     return;
		  }
		  if(mobile.match(mobileRegs)==null){
		      mui.toast("手机号格式不正确");
		     return;
		  }
   if(!flag){
	   //执行获取验证码
	   var sendData={strMobile:mobile,type:1};
       $.ajax({
				url: prefix + "/sys/sendSms",
				type: "POST",
				data: sendData,
				dataType: "json",
				success: function(res){
					ajaxLog(res);
					var result=res.result;
					if(res.resCode == 0){
					   $("#getCodeBtn").html("重新获取60s");
					   timer0=window.setInterval("editDivText()",1000);
					   flag=true;
					}else{
						mui.alert(result);
					}
				}
			})
   }
   
   
}

function editDivText(){
   num=num-1;
   $("#getCodeBtn").html("重新获取"+num+"s");
   if(num==0){
      $("#getCodeBtn").html("获取验证码");
      flag=false;
      window.clearInterval(timer0);
   }
}

