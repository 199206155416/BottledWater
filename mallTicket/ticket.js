mui.init({
	swipeBack:false,
	pullRefresh: {
		container:'#pullrefresh',
		down:{
			contentdown:'下拉可刷新',
			contentover:'释放立即刷新',
			contentrefresh:'正在加载..',
			callback:pulldownRefresh
		},
		up:{
			contentrefresh:'正在加载..',
			contentnomore:'没有更多数据了',
			callback:pullupRefresh
		}
	}
});


var  wishListwebview;//心愿单当前页面
var needlogin;//需要登录div

var wishListData = [];
var wishListList;//
var isloaded = false;//是否正在请求数据
var li;//将要删除的li删除后设置为null
mui.plusReady(function(){
	
	wishListwebview = plus.webview.currentWebview();
	needlogin = document.querySelector('.need-login');
	wishListList = document.getElementById('wishList');
	
	//为登录按钮添加事件
	document.querySelector('.need-login button').addEventListener('tap',function(){				
		pushWebView({
			webType: 'newWebview_First',
			id: 'login/login.html',
			href: 'login/login.html',
			aniShow: getaniShow(),
			title: "登录",
			isBars: false,
			barsIcon: '',
			extendOptions: {}
		})
	},false);
	
	//添加show事件设置是否需要加载或则更新心愿单
	wishListwebview.addEventListener('show',function(){
		if (localStorage.getItem('user')) {
			
			getlikelist('1');
		}else {
			needlogin.style.display = 'block';
			wishListList.style.display = 'none';
			wishListList.innerHTML = '';
			wishListData = [];
		}
	},false);
	
	//特殊：接收自定义事件登录成功
	window.addEventListener('loginSuccess',function(){
		//隐藏登录div
		needlogin.style.display = 'none';
		wishListList.style.display = 'block';
		//去加载获取心愿单列表
		if (wishListData.length>0 || isloaded) {
			return;
		}
		getlikelist('1');
	},false);
	
	mui('#wishList').on('tap','.mui-btn-danger',function(){
		var div = this.parentNode;
		li = div.parentNode;//设置li
		var idA = li.children[1].children[0];
		var id = idA.getAttribute('href');
		//查询数组删除其中的一项。
		
		mui.confirm('确认删除？','心愿单',['确认','取消'],function(e){
			if (e.index == 0) {
				deleteItemSuccess({
					code:'000000',
					id:id
				});
			}
		});
	});
	
	//添加每个item点击的监听事件
	mui('#wishList').on('tap','a',function(){
		var item = this;
		var itemID = this.getAttribute('href');
		//弹入分类商品列表
		pushWebView({
			webType:"newWebview_First",
			id:'appIndex/product-detail-needtem.html',
			href:'appIndex/product-detail-needtem.html',
			aniShow:getaniShow(),
			title:'商品详情',
			isBars:false,
			barsIcon:'',
			product_id:{itemID:itemID},
		});
	});
	
	
	//接收登出通知
	window.addEventListener('logout',function(){
		//显示登录div
		needlogin.style.display = 'block';
		wishListList.style.display = 'none';
		wishListList.innerHTML = '';
		wishListData = [];
	},false);
});


//接收item成功的信息
function deleteItemSuccess(data){
	if (data.code == '000000') {
		console.log(data.id);
		if (deleteItemByID(data.id)) {
			if (li) {
				li.parentNode.removeChild(li);
				li = null;
			}
		}
	}
}

//通过id删除数组中的一条
function deleteItemByID(id) {
	var index = -1;
	for (var i = 0; i < wishListData.length; i++) {
		if (wishListData[i].product_id == id) {
			index = i;
			break;
		}
	}
	if (index >= 0) {
		wishListData.splice(index,1);
		return true;
	}else {
		return false;
	}
}


function getlikelist(page) {
	for (var  i = 0; i < 20 ; i ++) {
		var item = {};
		item.product_id = i;
		item.large_image_url = '../img/50.jpg';
		item.product_name = "谁叫你加入心愿单的，找死啊";
		item.default_price = "28.0";
		item.list_price = '30.0';
		wishListData.push(item);
		var listItem = document.createElement('li');
		listItem.className = 'mui-table-view-cell mui-media';
		listItem.innerHTML = '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-danger">删除</a></div><div class="mui-slider-handle"><a href="'+item.product_id+'"><img  src="'+item.large_image_url+'" class="mui-media-object mui-pull-left"/> <div class="mui-media-body"><p class="itemName mui-ellipsis-2">'+item.product_name+'</p><p class="price"><span class="curprice">¥'+item.default_price+'</span>&nbsp;&nbsp;<span class="preprice">¥'+item.list_price+'</span></p></div></a></div>';
		wishListList.appendChild(listItem);
	}
	isloaded = false;
}

function pulldownRefresh() {
	setTimeout(function(){
		
		 mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	},1000);
}
function pullupRefresh(){
	var copythis = this;
	setTimeout(function(){
		copythis.endPullupToRefresh(true|false);
	});
}