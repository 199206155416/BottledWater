var currentWebview;

mui.init({
	swipeBack: false,
	// pullRefresh: {
	//     container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	//     down : {
	// 		style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	// 		color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	// 		height: '50px',//可选,默认50px.下拉刷新控件的高度,
	// 		range: '100px', //可选 默认100px,控件可下拉拖拽的范围
	// 		offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
	// 		auto: true,//可选,默认false.首次加载自动上拉刷新一次
	// 		callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	//     }
 //  	}
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	// 获取订单列表
	getOrderList();
	
	// 绑定事件
	bindEvnet();
});

function bindEvent(){
	// 提交表单
	$("#applyBtn").on("click", function(){
		var strUserId = localStorage.getItem("userId");
		

	});

	// 选择原因
	$("#selectReason").on("click", function(){
		// 初始化mui选择器
		initSelect();
	});
};

/**
 * 初始化mui选择器
 */
function initSelect(){
	var picker = new mui.PopPicker();
 	picker.setData([
 		{value:'选错商品了', text:'选错商品了'},
	]);
 	picker.show(function (selectItems) {
	    // console.log(selectItems[0].text);//智子
	    // console.log(selectItems[0].value);//zz 

	    $("#refundReason").html(selectItems[0].text);
  	})
};
