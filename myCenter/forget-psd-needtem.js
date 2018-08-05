mui.init({
	swipeBack:true
});

var uploadBtn;
var account;
mui.plusReady(function(){
	account = document.querySelector('input[type="text"]');
	uploadBtn = document.querySelector('button[type="button"]');
	
	uploadBtn.addEventListener('tap',function(){
		if(account.value.length <= 0){
			mui.toast('请输入账号');
			return;
		}
		
		//联网发送信息todo
	},false);
});
