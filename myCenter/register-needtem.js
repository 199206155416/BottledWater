mui.init({
	swipeBack:true
});

var account;
var psd;
var repsd;
var registerBtn ;
mui.plusReady(function(){
	account = document.getElementById('account');
	psd = document.getElementById('psd');
	repsd = document.getElementById('repsd');
	registerBtn = document.querySelector('button[type="button"]');
	
	
	registerBtn.addEventListener('tap',function(){
		if (account.value.length <= 0) {
			mui.toast('请输入要注册的账号');
			return;
		}
		if (psd.value.length <= 0){
			mui.toast('请输入密码');
			return;
		}
		if (repsd.value.length <= 0 || psd.value != repsd.value	){
			mui.toast('两次输入密码必须一致');
			return;
		}
		
		//联网注册
		ajax_register({
			account:account.value,
			pwd:repsd.value,
			website_id:'1'
		});
	},false);
	
});

function registerSeccess(data) {
	if (data.code == '000000') {
		
	}
}