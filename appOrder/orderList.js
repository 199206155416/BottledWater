var currentWebview;
var type = -1; // -1 == 全部， -2 == 待付款， -3 == 待发货， -4 == 待收货， -5 == 已完成, 默认为-1
var pageNo = 1;
var pageSize =20; 
var loadFlag = 1; // 上拉加载标志
var payChannels;
var payType;
var channel;
var _LoadNumber = { a: false };
var payStrOrderId
mui.init({
	swipeBack: false,
//	pullRefresh: {
//	    container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
//	    down : {
//			style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
//			color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
//			height: '50px',//可选,默认50px.下拉刷新控件的高度,
//			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
//			offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
//			auto: true,//可选,默认false.首次加载自动上拉刷新一次
//			callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//	    }
//	}
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	type = currentWebview.type ? currentWebview.type : -1;
	
	renderTab(type);

	// 获取订单列表
	getOrderList();
	initPayChannel();
	
	// 绑定事件
	bindEvent();

});

function bindEvent(){
	// 屏幕滚动后加载列表
	$("#scroll").scroll(function(){
		var scrollTop = $(this).scrollTop();	// 滚动高度		    
		var scrollHeight = $(this).height(); // 文档高度
		var windowHeight = $(window).height(); // 文档窗口高度
			
		if (scrollTop + windowHeight >= scrollHeight - 300) {
			if(loadFlag == 1){
				loadFlag = 0;
				console.log("pageNo:"+pageNo);
				getOrderList();
			}
		}

	});
	
	// 点击切换tab
	$("#myTapWidth").on("click", "li", function(){
		type = $(this).attr("type");
		$(this).addClass("row").siblings().removeClass("row");
		
		pageNo = 1;
		loadFlag = 1;
		$("#orderListID").html("");
		$("#load").show();
		// 获取数据
		getOrderList();
		
	});
	
	 window.addEventListener('choosePayType',function(event){
  	    var data=event.detail;
  	    payType=parseInt(data["payType"]);
		getPayInfo();
	},false);
}

/**
 * 初始化支付渠道
 * @param {Object} payType
 */
function initPayChannel(){
	plus.payment.getChannels(function(channels){
			payChannels=channels;
	    },function(e){
	        alert("获取支付通道失败："+e.message);
	    });
	
}

/**
 * 渲染tab
 * @author xuezhenxiang
 * */
function renderTab(type){
	$("#myTapWidth li[type="+ type +"]").addClass("row").siblings().removeClass("row");
};

/**
 * 获取订单列表
 * @author xuezhenxiang
 */
function getOrderList(){
	var userId = localStorage.getItem("userId");
	var formData = new FormData();
	formData.append("strBuyerId",userId);
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	formData.append("state", type);
	
	$.ajax({
		url: prefix + "/order/list",
		type: 'POST',
		data: formData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
			_LoadNumber.a = true;
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				var list = res.result.list; // 列表数据
				var count = res.result.count; // 数据总量
				if(count == 0){
					$("#orderNullTemp").show();
					// return false;
				}else{
					$("#orderNullTemp").hide();
				}
				
				$("#load").hide();
				if(list.length <= 0){
					return false;
				}

				for(var i = 0, len = list.length; i < len; i++){
					var order = list[i];
					var lOrderId = list[i].id; // 订单id
					var strOrderNum = list[i].strOrderNum; // 订单编号
					var strStateName = list[i].strStateName; // 订单状态
					var factPrice=list[i].factPrice;
					var orderListTemp = $("#orderListTemp").html();

					orderListTemp = orderListTemp.replace("#lOrderId#", lOrderId);
					orderListTemp = orderListTemp.replace("#strOrderNum#", strOrderNum);
					orderListTemp = orderListTemp.replace("#strStateName#", strStateName);
					orderListTemp = orderListTemp.replace("#factPrice#", factPrice);
					
					var orderList = $(orderListTemp);
					var mallOrderDetailList=list[i].mallOrderDetailList
					;(function(orderList, lOrderId,order){
						orderList.find(".goodsList").on("click", function(){
							pushWebView({
								webType: 'newWebview_First',
								id: 'appOrder/orderDetail.html',
								href: 'appOrder/orderDetail.html',
								aniShow: getaniShow(),
								title: "订单详情",
								isBars: false,
								barsIcon: '',
								extendOptions: {
									strOrderId: lOrderId
								}
							});
						});
						orderList.find(".payment").click(function(){
							    var strPayType=order.strPayType;
							    var factPrice=order.factPrice
							    nowPay(lOrderId,strPayType,factPrice);
							    return false;
						});
						
						orderList.find(".applySale").click(function(){
									openRefund(order);
						});
						
						orderList.find(".cancel").click(function(){
									var btnArray = ['取消', '确认'];
							        mui.confirm("确认删除此订单?", '取消订单', btnArray, function(e) {
							            if (e.index == 1) {
							                cancelOrder(lOrderId);
							            }
							        },"div");
						});
					})(orderList, lOrderId,order);

					for(var i1 = 0, len1 = mallOrderDetailList.length; i1 < len1; i1++){
						var item=mallOrderDetailList[i1];
						var id = item.id;
						var strGoodsName = item.strSkuName;
						var strGoodsImg = item.strGoodsImg;
						var strGoodsSKUDetail = item.strTitle;
						var skuPrice = item.skuPrice;
						var count = item.count;
						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsTitle#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#strGoodsSKUDetail#", commonNameSubstr(strGoodsSKUDetail, 28));
						goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
						goodsTemplate = goodsTemplate.replace("#count#", count);
						
						var goods = $(goodsTemplate);
						;(function(){

						})();
						orderList.find(".goodsList").append(goods);
					}
					$("#orderListID").append(orderList);
					if(strStateName=="待付款"){
						$("#orderListID li").last().find(".checkBill>div").eq(0).show();
						$("#orderListID li").last().find(".checkBill>div").eq(1).show();
					}else if(strStateName=="待发货"&&factPrice!=0){
						$("#orderListID li").last().find(".checkBill>div").eq(2).show();
					}

				}
				
				pageNo++;
				loadFlag = 1;
			}
		}
	})
}

function openRefund(order){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appOrder/applyAfterSale.html-1',
			href: 'appOrder/applyAfterSale.html',
			aniShow: getaniShow(),
			title: "退款/售后",
			isBars: false, 
			barsIcon: '',
			extendOptions: {
				order: order
			}
		});
}

/**
 * 取消订单
 * @param {Object} strOrderId
 */
function cancelOrder(strOrderId){
		$.ajax({
		url: prefix + "/order/cancelOrder",
		type: "POST",
		data: {"strOrderId":strOrderId}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					mui.toast("取消成功");
					getOrderList();
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

function openPayType(factPrice){
	pushWebView({
			webType: 'newWebview_First',
			id: 'appMall/payCenter.html-1',
			href: 'appMall/payCenter.html',
			aniShow: getaniShow(),
			title: "支付方式",
			isBars: false, 
			barsIcon: '',
			extendOptions: {
				factPrice: factPrice,openType:1
			}
		});
}

/**
 * 立即支付
 * @param {Object} strOrderId
 * @param {Object} strPayType
 * @param {Object} factPrice
 */
function nowPay(strOrderId,strPayType,factPrice){
	openPayType(factPrice);
	payStrOrderId=strOrderId;
}

function getPayInfo(){
	channel=payChannels[payType];
	$.ajax({
		url: prefix + "/pay/againPay",
		type: "POST",
		data: {"strOrderId":payStrOrderId,"strPayType":payType,"strOrderType":"0"}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					doPay(result);
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

function doPay(payInfo){
	console.log("payInfo:"+payInfo);
	if(payType==1){//微信
		var appid=payInfo["appid"];
		var noncestr=payInfo["noncestr"];
		var package=payInfo["package"];
		var partnerid=payInfo["partnerid"];
		var prepayid=payInfo["prepayid"];
		var timestamp=payInfo["timestamp"];
		var sign=payInfo["sign"];
		var payInfoNew={"appid":appid,"noncestr":noncestr,"package":package,"partnerid":partnerid,"prepayid":prepayid,"timestamp":timestamp,"sign":sign};
		var stra=JSON.stringify(payInfoNew);
		plus.payment.request(channel,stra,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                       getOrderList();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==0){
		plus.payment.request(channel,payInfo,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        getOrderList();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==2){//余额
		 plus.nativeUI.alert("支付成功！",function(){
                      getOrderList();
          });

		
	}
};

//下拉刷新
function PullRefresh(id, callback) {
	var Tween = {
		Linear: function (t, b, c, d) { return c * t / d + b; },
		Quad: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t + b;
			},
			easeOut: function (t, b, c, d) {
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t + b;
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		Cubic: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t * t + b;
			},
			easeOut: function (t, b, c, d) {
				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b;
			}
		},
		Quart: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t * t * t + b;
			},
			easeOut: function (t, b, c, d) {
				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			}
		},
		Quint: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t * t * t * t + b;
			},
			easeOut: function (t, b, c, d) {
				return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
			}
		},
		Sine: {
			easeIn: function (t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},
			easeOut: function (t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},
			easeInOut: function (t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			}
		},
		Expo: {
			easeIn: function (t, b, c, d) {
				return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
			},
			easeOut: function (t, b, c, d) {
				return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if (t == 0) return b;
				if (t == d) return b + c;
				if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
			}
		},
		Circ: {
			easeIn: function (t, b, c, d) {
				return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
			},
			easeOut: function (t, b, c, d) {
				return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
			}
		},
		Elastic: {
			easeIn: function (t, b, c, d, a, p) {
				if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
				if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
				else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			},
			easeOut: function (t, b, c, d, a, p) {
				if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
				if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
				else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			},
			easeInOut: function (t, b, c, d, a, p) {
				if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
				if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
				else var s = p / (2 * Math.PI) * Math.asin(c / a);
				if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
			}
		},
		Back: {
			easeIn: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * (t /= d) * t * ((s + 1) * t - s) + b;
			},
			easeOut: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			},
			easeInOut: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
			}
		},
		Bounce: {
			easeIn: function (t, b, c, d) {
				return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
			},
			easeOut: function (t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			},
			easeInOut: function (t, b, c, d) {
				if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
				else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
			}
		}
	}
	function xround(x, num) {
		return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
	}
	var scrollElement = document.getElementById(id);
	/**1滚动条状态，3touch接管状态 */
	var topState = 1;
	//var isTop = false;
	var startClientY = 0;
	var prevMoveY = 0;
	var refreshHeight = 44;
	var isRefres = false;
	//刷新状态1正常，2松手刷新，3刷新中
	var refresState = 1;
	//移动距离
	var distance = 0;
	scrollElement.addEventListener('scroll', function (event) {
		//console.log(event);

	}, false);
	scrollElement.addEventListener('touchstart', function (event) {
		var touch = event.targetTouches[0];
		startClientY = xround(touch.clientY, 2);
		prevMoveY = startClientY;
	}, false);
	var touchmove = function (event) {
		var touch = event.targetTouches[0];
		var clientY = xround(touch.clientY, 2);
		var direction = 'down';
		if (prevMoveY > clientY) {
			direction = 'up'
		}
		//触碰到下滑临界值
		if (topState === 1 && $("#scroll").scrollTop() <= 0 && direction == 'down') {
			event.preventDefault();
			startClientY = clientY;
			topState = 3;
			console.log('到顶了', event)
			return;
		}
		if (topState == 3) {
			if (window.swiper && window.swiper.autoplaying == true) {
				window.swiper.stopAutoplay();
			}
			if (direction == 'down') {
				event.preventDefault();
				distance = (clientY - startClientY) / 2 - refreshHeight;
				setState(distance);
				scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
				scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			}
			else {
				distance = clientY - startClientY - refreshHeight;
				if (distance > -refreshHeight) {
					event.preventDefault();
					distance = (clientY - startClientY) / 2 - refreshHeight;
					setState(distance);
					scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
				}
				else {
					topState = 1;
					setState(-refreshHeight)
					scrollElement.style.webkitTransform = 'translate3d(0,' + -refreshHeight + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + -refreshHeight + 'px,0)';
				}
			}

		}
		prevMoveY = clientY;
	}
	function setState(distance) {
		if (refresState != 2 && distance >= 0) {
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'block';
			refresState = 2;
		}
		if (refresState != 1 && distance < 0) {
			refresState = 1;
			document.getElementById('top1').style.display = 'block';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'none';
		}
	}
	scrollElement.addEventListener('touchmove', touchmove, false);
	var touchend = function (event) {
		scrollElement.removeEventListener('touchmove', touchmove, false);
		scrollElement.removeEventListener('touchend', touchend, false);
		var touch = event.targetTouches[0];
		if (refresState == 2) {
			refresState = 3;
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'block';
			document.getElementById('top3').style.display = 'none';
			an(0);
		 	_LoadNumber = { a: false };
			_isPullRefresh = true;
			var loadNumberTimeId = setInterval(function () {
				if (_LoadNumber.a) {
					_isPullRefresh = false;
					refresState = 1;
					an(- refreshHeight);
					clearInterval(loadNumberTimeId);
				}
				
			}, 1000); 
			// 请求接口数据
			callback();
		} else {

			if (topState == 3) {
				an(- refreshHeight);
			}
			else {
				scrollElement.addEventListener('touchmove', touchmove, false);
				scrollElement.addEventListener('touchend', touchend, false);
			}
		}
		topState = 1;
	}
	scrollElement.addEventListener('touchend', touchend, false);
	scrollElement.addEventListener('touchcancel', touchend, false);


	var an = function (position) {
		position = +position;
		var tdistance = +distance
		var start = 0, during = 35;
		var _run = function () {
			start++;
			distance = Tween.Cubic.easeOut(start, tdistance, position - tdistance, during);
			scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
			scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			if (start < during) {
				requestAnimationFrame(_run);
			}
			else {
				if (refresState !== 3) {
					scrollElement.addEventListener('touchmove', touchmove, false);
					scrollElement.addEventListener('touchend', touchend, false);
				}
				else {
				}
				if (position == (- refreshHeight)) {
					document.getElementById('top1').style.display = 'block';
					document.getElementById('top2').style.display = 'none';
					document.getElementById('top3').style.display = 'none';
				}

				topState = 1;
			}
		};
		_run();
	}
}
//下拉刷新调用
PullRefresh('scroll', function(){
	pageNo = 1;
	loadFlag = 1;
	$("#orderListID").html("");
	$("#load").hide();
	// 获取数据
	getOrderList();
});





