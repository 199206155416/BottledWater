mui.init({
	swipeBack: true
});
var account;
var psd;
var login;
var register;
var repsd;
var loginWebview;
var registerWebview;
mui.plusReady(function() {
	registerWebview = plus.webview.currentWebview();
	// 注册
	register();
});

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
   	flag=true;
	   //执行获取验证码
	   var sendData={strMobile:mobile,type:0};
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
					}else{
						mui.toast(result);
						flag=false;
      					window.clearInterval(timer0);
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



/**
 * 注册
 * @author xuezhenxiang
 */
function register(){
	$("#registerBtn").on("click", function(){
		var mobile = $("#mobile").val().trim();
		var password = $("#password").val().trim();
		var strUserSmsCode = $("#strUserSmsCode").val().trim();
		if(!strUserSmsCode){
			mui.toast("请输入验证码");
		    return;
		}
		 var regx =/^[\w]{6,12}$/;
		  if(password.match(regx)==null){
		    mui.toast("密码必须至少6位");
		    return;
		   }
		var strInviteCode=$("#strInviteCode").val();
		if(!strInviteCode){
			strInviteCode="";
		}
		$.ajax({
			url: prefix + "/user/register",
			type: "POST",
			dataType: "json",
			data: {
				mobile: mobile,
				password: password,
				strUserSmsCode: strUserSmsCode,
				strInviteCode:strInviteCode
			},
			success: function(e){
				ajaxLog(e);

				if(e.resCode == 0){
					//mui.toast('注册成功');
					//直接登录
					var loginwebview = plus.webview.getWebviewById('login/login.html');
					registerWebview.close();
					mui.fire(loginwebview, 'doLogin', {"strMobile":mobile,"strPassword":password});
				}
			}
		})
	});
};
