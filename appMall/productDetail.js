var mallGoods = null;
var attrMap = null;
var slideImgList = null;
var currentSku = ""; // 已选择sku
var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var goodsId; // 商品id
var buyNowFlag = 0; // buyNowFlag == 0 点击sku选择弹层确定按钮立即购买, buyNowFlag == 1 加入购物车


mui.init({
	swipeBack: false
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	paredntWebview = currentWebview.parent();
	detailcontent = document.getElementById('detailcontent');
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		goodsId = null;
	}, false);

	goodsId = currentWebview.goodsId;
	
	//如果要获取当前页面的数据
	mui.fire(paredntWebview,'getExtendOptions',{});
	//监听返回获取到options数据
	window.addEventListener('postExtendOptions',function(e){
		console.log(JSON.stringify(e.detail.extendOptions))
	},false);
	
	// 查询商品详情
	getGoodsDetail();

	// 绑定事件
	bindEvent();
});

/**
 * 查询商品详情
 * @author xuezhenxiang
 */
function getGoodsDetail(){
	$.ajax({
		url: prefix + "/goods/detail/" + goodsId,
		type: "GET",
		dataType: "json",
		success: function(res){
			ajaxLog(res);
			if(res.resCode == 0){
				var result = res.result;

				mallGoods = {
					strSkuId: result.mallGoods.strDefaultSkuId,
					strSkuName: result.mallGoods.strDefaultSkuName,
					strTitle: result.mallGoods.strTitle,
					strIntroduce: result.mallGoods.strIntroduce,
					nSkuPrice: result.mallGoods.defaultSkuPrice,
					strDetailIcon: result.mallGoods.strDetailIcon,
					nSaleNum: result.mallGoods.defaultSkuSaleNum
				};

				

				slideImgList = result.mallGoods.strDetailMainImg.split("|");

				attrMap = result.attrMap;

				for(var i in attrMap){
					currentSku += attrMap[i][0] + " ";
				}
				setHtml();
			}
		}
	})
};

function setHtml() {
	// 第一步设置第一个图片滑动
	setSldiderHtml();
	// 第二步设置商品名字价钱等
	setproductMessage();
	// 设置sku选择
	setChooseSku();
	
};

/**
 * 设置图片轮播
 * @author xuezhenxiang
 */
function setSldiderHtml(focusImgs){
	var focusImgs = slideImgList; // 图片
	var focusImgHtml = "";
	for(var i = 0; i < focusImgs.length; i++){
		focusImgHtml += "<div class='swiper-slide'><img src="+ focusImgs +" class='slide_img'/></div>";
	}		
	$("#slide_a").html(focusImgHtml);
	// 轮播图数字
	//Swiper  轮播插件
	window.swiper = new Swiper('#banner-swiper',{
		pagination : '.swiper-pagination',
		paginationClickable :true,
		autoplayDisableOnInteraction:false,
		initialSlide :0,
		resistanceRatio : 0
	});
};

/**
 * 第二步设置商品名字价钱等
 * @author xuezhenxiang
 */
function setproductMessage(){
	var strGoodsName = mallGoods.strSkuName;
	var strIntroduce = mallGoods.strIntroduce;
	var strTitle = mallGoods.strTitle;
	var nSkuPrice = mallGoods.nSkuPrice;
	var strDetailIcon = mallGoods.strDetailIcon;
	var nSaleNum = mallGoods.nSaleNum;

	$("#strDetailName, #strDetailName1").html(strGoodsName); // 商品名称
	$("#strNotice").html(strTitle); // 商品描述
	$("#nPrice, #nPrice1").html("<span>￥</span>" + nSkuPrice); // 商品价格
	$("#saleNum").html("已售 " + nSaleNum); // 商品已售
	$("#appendRove").html(currentSku); // 当前商品sku信息
	$("#selectIMG").attr("src", strDetailIcon);
	$("#mallDetail").html(strIntroduce); // 商品规格图片
};

/**
 * 设置sku选择
 * @author xuezhenxiang
 */ 
function setChooseSku(){
	var strHtml = ""
	for(var i in attrMap){
		strHtml += "<div class='class'><h3>"+ i +"</h3>";
		for(var ii = 0,ll = attrMap[i].length; ii < ll; ii++){
			if(ii == 0){
				strHtml += "<span class='row' name="+ i +">"+ attrMap[i] +"</span>";
			}else{
				strHtml += "<span name="+ i +">"+ attrMap[i] +"</span>";
			}
		}
		strHtml += "</div>";
	}
	$("#mallSku").html(strHtml);
};

/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
	// 添加购物车
	$("#addCart").on("click", function(){
		$("#mallbackground").show();
		$("#mallSelection")
			.show()
			.animate({bottom: 0}, 300);
		// 确定按钮加入购物车
		buyNowFlag = 1;
	});
	// 立即购买
	$("#buyNow, #appDetailApprove").on("click", function(){
		$("#mallbackground").show();
		$("#mallSelection")
			.show()
			.animate({bottom: 0}, 300);
		// 确定按钮加入购物车
		buyNowFlag = 0;
	});
	// 关闭sku选择弹层
	$("#closeBtn, #mallbackground").on("click", function(){
		$("#mallSelection").animate({bottom: "-8rem"}, 300, function(){
			$("#mallbackground").hide();
			$("#mallSelection").hide();
		});
	});
	// 点击购物车
	$("#shopCart").on("click", function(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appCart/cart.html-1',
			href: 'appCart/cart.html',
			aniShow: getaniShow(),
			title: "购物车",
			isBars: false,
			barsIcon: '',
			extendOptions: {
				hasBack: 1
			}
		});
	});

	// 提交按钮绑定事件
	$("#submitBtn").on("click", function(){
		var strUserId = localStorage.getItem('userId'); // 用户id
		var nCount = $("#num_id").html();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && strUserId) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
				pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			});
			return false;
		}

		if(buyNowFlag == 0){
			pushWebView({
				webType: 'newWebview_First',
				id: 'appMall/addOrder.html',
				href: 'appMall/addOrder.html',
				aniShow: getaniShow(),
				title: "提交订单",
				isBars: false,
				barsIcon: '',
				extendOptions: {
					goodsList: [
						{
							"mallGoodsSku.id": mallGoods.strSkuId,
							"goodsFactPrice": mallGoods.nSkuPrice,
							"strGoodsImg": mallGoods.strDetailIcon,
							"strSku": currentSku,
							"strSkuName": mallGoods.strSkuName,
							"nCount": nCount
						}
					],
					buyType:0
					
				}

			});
		}else if(buyNowFlag == 1){
			var formData = new FormData();
			
			formData.append("strUserId", strUserId);
			formData.append("strSpuId", goodsId);
			formData.append("skuCount", nCount);
			formData.append("mallGoodsSku.id", mallGoods.strSkuId);

			$.ajax({
				url: prefix + "/shoppingcard/save",
				type: "POST",
				data: formData,
				contentType: false,
			 	processData: false,  
				dataType: "json",
				success: function(res){
					ajaxLog(res);
					if(res.resCode == 0){
						mui.toast(res.result);
						$("#mallSelection").animate({bottom: "-8rem"}, 300, function(){
							$("#mallbackground").hide();
							$("#mallSelection").hide();
						});

						mui.each(plus.webview.all(), function(index, item) {
							console.log(item.id)
						})
						var cartwebview = plus.webview.getWebviewById('appCart/cart.html');
						mui.fire(cartwebview, 'addCart', {});
					}
				}
			})
		}
	});

	// 切换sku
	$("#mallSku").on("click", "span", function(){
		var flag = $(this).hasClass("row");
		var name = $(this).attr("name");
		currentSku = "";

		if(!flag){
			$(this).addClass("row").siblings().removeClass("row");

			var formData = new FormData();
			
			formData.append("mallGoods.id", goodsId);


			$("#mallSku .row").each(function(i, v){
				var strAttrName = $(v).attr('name');
				var strSttrValue = $(v).html();

				formData.append("mallSkuAttrList["+i+"].strAttrName", strAttrName);
				formData.append("mallSkuAttrList["+i+"].strSttrValue", strSttrValue);

				currentSku += strSttrValue + " ";
			});
			
			$.ajax({
				url: prefix + "/goods/skuDetailByAttr",
				type: "POST",
				data: formData,
				contentType: false,
			 	processData: false,  
				dataType: "json",
				success: function(res){
					ajaxLog(res);
					if(res.resCode == 0){

						var result = res.result;

						mallGoods = {
							strSkuId: result.id,
							strSkuName: result.mallGoods.strSkuName,
							strIntroduce: result.mallGoods.strIntroduce,
							nSkuPrice: result.mallGoods.skuPrice,
							strGoodsImg: result.mallGoods.strDetailMainImg,
							strDetailIcon: result.mallGoods.strDetailIcon,
							nSaleNum: result.mallGoods.saleNum
						};

						// 第二步设置商品名字价钱等
						setproductMessage();
					}
				}
			})
		}
	});

	// 选择购买数量
	$("#count").on("click", "div", function(){
		var count = $("#num_id").html();
		if($(this).hasClass("left")){
			count--;
			if(count <= 1){
				count = 1;
			}
		}else if($(this).hasClass("right")){
			count++;
		}
		$("#num_id").html(count);
	});

};

