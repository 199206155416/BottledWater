mui.init({
	swipeBack:true
});

var addressPicker;
var pickerlabel;
mui.plusReady(function(){
	addressPicker = document.getElementById('addressPicker');
	pickerlabel = addressPicker.children[0];

	//监听呼出picker事件
	addressPicker.addEventListener('tap',function(){
		var cityPicker3 = new mui.PopPicker({
			layer:3
		});
		cityPicker3.setData(cityData3);
		cityPicker3.show(function(items){
			pickerlabel.innerText = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
		});
	},false);
	
	//接收rightbar事件
	window.addEventListener('navRightPress', function() {
		mui.toast('选择了确定');
		//上报服务器e3-server
		mui.back();
	}, false)
});