mui.init({
	swipeBack:false
});


var cartSupplierItem = [];
var cartWebview;//当前购物车webview
var needlogin;//需要登录的div
var downDiv = document.querySelector('.downDiv');

mui.plusReady(function(){
	cartWebview = plus.webview.currentWebview();
	needlogin = document.querySelector('.need-login');
	downDiv.style.display = 'none';
	//为登录按钮添加事件
	document.querySelector('.need-login button').addEventListener('tap',function(){
		var title = '登录';
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
	
	//为页面显示的时候添加监听
	cartWebview.addEventListener('show',function(){
		//判断用户是否已经登录,已经登录就需要去获取购物车列表
		if (localStorage.getItem('user')) {
			//将登录按钮隐藏，并且去获取购物车列表或则更新购物车列表todo
			needlogin.style.display = 'none';
			
			if(cartSupplierItem.length <= 0) {
				//去获取数据
				initCartData();
			}
		}else {
			//如果退出登录或者没有登录成功这个div将被显示出来。
			needlogin.style.display = 'block';
		}
	},false);
	
	//特殊：添加事件接收登录页面成功后发来的消息
	window.addEventListener('loginSuccess',function(){
		//页面成功后，要隐藏登录模块，然后去加载数据返回
		needlogin.style.display = 'none';
		initCartData();
	},false);
	
	//退出登录
	window.addEventListener('logout',function(){
		needlogin.style.display = 'block';
		var loginDiv =  document.querySelector('.login');
		loginDiv.innerHTML = '';
		cartSupplierItem = [];
	},false)
});


function addTop() {
		
	mui('.mui-table-view').on('tap','span',function(){
		selectItem(this);
	});
	
	mui('.table_head').on('tap','p.head_msg',function(){
		var span = this.getElementsByTagName('span')[0];
		var isXuanze = selectItem(span);
		
		var objThis = span;
		var cellImgs = span.parentNode.parentNode.getElementsByClassName('selectImg');
		mui.each(cellImgs,function(index,item) {
			//去除第一个
			if (index >= 1) {
				if (isXuanze) {
					
					item.className = "mui-icon iconfont icon-xuanze selectImg";
				}else {
					
					item.className = "mui-icon iconfont icon-xuanze1 selectImg";
				}
			}
		});
	});
	
	//手动写增加减少
	mui('.mui-numbox').on('tap','.mui-numbox-btn-minus',function(){
		var inputNumbox = this.nextSibling;
		var  num = parseInt(inputNumbox.value);
		if (num>1) {
			num -= 1;
			inputNumbox.value = ''+num;
		}
	});
	mui('.mui-numbox').on('tap','.mui-numbox-btn-plus',function(){
		var inputNumbox = this.previousSibling;
		var  num = parseInt(inputNumbox.value);
		num += 1;
		inputNumbox.value = ''+num;
	});
}

function selectItem(obj) {
		var isXuanze = obj.classList.contains('icon-xuanze1');
		if (isXuanze) {
			obj.className = "mui-icon iconfont icon-xuanze selectImg";
		}else {
			
			obj.className = "mui-icon iconfont icon-xuanze1 selectImg";
		}
		return isXuanze;
}

function initCartData() {
	
	var suppliers = [{
		supplier_name :'凡客成品',
		supplier_id:0
	},{
		supplier_name :'京东',
		supplier_id:1
	},{
		supplier_name :'淘宝',
		supplier_id:2
	},{
		supplier_name :'老干妈',
		supplier_id:3
	}];
	var cartItems = [{
		supplier_id:0,
		products:[{
			product_small_image_url:'../img/50.jpg',
			product_name:'爱买不买鬼东西',
			default_price:'3000',
			features:[{
				product_feature_type_id:90,
				description:'你又买不起，看了有什么用啊'
			}]
		}]
	},{
		supplier_id:1,
		products:[{
			product_small_image_url:'../img/50.jpg',
			product_name:'爱买不买鬼东西',
			default_price:'3000',
			features:[{
				product_feature_type_id:90,
				description:'你又买不起，看了有什么用啊'
			}]
		}]
	},{
		supplier_id:2,
		products:[{
			product_small_image_url:'../img/50.jpg',
			product_name:'爱买不买鬼东西',
			default_price:'3000',
			features:[{
				product_feature_type_id:90,
				description:'你又买不起，看了有什么用啊'
			}]
		}]
	},{
		supplier_id:3,
		products:[{
			product_small_image_url:'../img/50.jpg',
			product_name:'爱买不买鬼东西',
			default_price:'3000',
			features:[{
				product_feature_type_id:90,
				description:'你又买不起，看了有什么用啊'
			}]
		}]
	}];
	for (var i = 0; i < suppliers.length; i++) {
		var supplier = suppliers[i];
		var cartSupplier = new Object;
		cartSupplier.supplier_name = supplier.supplier_name;
		cartSupplier.supplier_id = supplier.supplier_id;
		for (var j = 0; j < cartItems.length; j ++) {
			var item = new Object;
			item = cartItems[j];
			if (cartSupplier.supplier_id == item.supplier_id) {
				
				cartSupplier.products = item.products;
				break;
			}
		}
		cartSupplierItem[i] = cartSupplier;
	}
	
	setHtml(cartSupplierItem);
	addTop();
}


function setHtml(items) {
	
	
	var loginDiv =  document.querySelector('.login');
	var html ='';
	mui.each(items,function(index,item){
	
		console.log(JSON.stringify(item));
		//结构 <div>head+table</div>
		var listDiv = '';
		listDiv += '<div class="table_head" >';
		//标题 head
		//结构<p>img + span</p>
		var listHead ='';
	
		listHead += '<p class="head_msg">';
		listHead += '<span class="mui-icon iconfont icon-xuanze1 selectImg"></span>';
//				listHead += '<img src="../img/iconfont-xuanzekuang.png" class="selectImg"/>';
		listHead += '<span class="head_title">' + item.supplier_name + '</span>';
		listHead += '</p>';
		listDiv += listHead;
		
		listDiv += '<ul class="mui-table-view">';
		var listCellStr = '';
		mui.each(item.products,function(i,product){
			listCellStr += '<li class="mui-table-view-cell mui-media">';
			//左边div
			var leftCellDiv = '';
			leftCellDiv += '<div class="leftClassCell">';
			leftCellDiv += '<p style="display:inline;"><span class="mui-icon iconfont icon-xuanze1 selectImg"></span></p>';
//					leftCellDiv += '<img src="../img/iconfont-xuanzekuang.png" class="selectImg" />';
			leftCellDiv += '<img src="'+ product.product_small_image_url + '"class="cellImg" />';
			leftCellDiv += '</div>';
			listCellStr += leftCellDiv;
			//右边div
			var rightCellDiv = '';
			rightCellDiv += '<div class="rightClassCell">';
			rightCellDiv += '<p class="itemName mui-ellipsis-2">'+product.product_name+'</p>';
			var features = product.features;
			if (features) {
				
				rightCellDiv += '<p class="itemfeatures">'+ features[0].product_feature_type_id +':' + features[0].description +'</p>';
			}
			rightCellDiv += '<p class="price">' + '¥' + product.default_price+ '.00'+ '</p>';
			
			rightCellDiv += '<div class="mui-numbox"><button class="mui-btn mui-numbox-btn-minus" type="button">-</button><input class="mui-numbox-input" type="number"  value="1"/><button class="mui-btn mui-numbox-btn-plus" type="button">+</button></div>';
			rightCellDiv += '</div>';
			listCellStr += rightCellDiv;
			
			listCellStr += '</li>';
		});
		
		listDiv += listCellStr + '</ul>';
		
		listDiv += '</div>'
		
		
		html += listDiv;
		console.log(html);
	});
	
	loginDiv.innerHTML = html;
}