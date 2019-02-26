var currentWebview;
var type = -1; // -1 == 全部， -2 == 待付款， -3 == 待发货， -4 == 待收货， -5 == 已完成, 默认为-1
var  sendState=0;//0:未配送，1：已经配送
var pageNo = 1;
var pageSize =20; 
var loadFlag = 1; // 上拉加载标志
var payChannels;
var payType;
var channel;
var _LoadNumber = { a: false };
var payStrOrderId
var currentPoit;
var map;
mui.init({
	swipeBack: false,
	pullRefresh: {
	    container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
			style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			height: '50px',//可选,默认50px.下拉刷新控件的高度,
			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
			auto: true,//可选,默认false.首次加载自动上拉刷新一次
			callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
 }
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	// 获取订单列表
	getOrderList();
	// 绑定事件
	bindEvent();
	
	getCurrentLocation();
	map= new BMap.Map("container");
    map.centerAndZoom("石家庄",12);

});




/**
 * 获取当前定位
 */
function getCurrentLocation(){
	var geolocation = new BMap.Geolocation();
	  geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			currentPoit=r.point;
		}
		else {
			alert('failed'+this.getStatus());
		}        
	});
}

 function getdist(pointA,pointB){
        //var pointA = new BMap.Point(106.486654,29.490295);  // 创建点坐标A--大渡口区
        //var pointB = new BMap.Point(106.581515,29.615467);  // 创建点坐标B--江北区
        //alert((map.getDistance(pointA,pointB)));  //获取两点距离,保留小数点后两位
        var flag=false;
        var distNum=map.getDistance(pointA,pointB);
        distNum=parseInt(distNum);
        if(distNum<=1000000){
        	flag=true;
        }else{
        	flag=false;
        	mui.alert("距离目的地直线距离还有"+distNum+ "米,不能点击配送完成,小于100米才能点击！");
        }
        //G("dist").innerHTML = "直线距离"+map.getDistance(pointA,pointB) + "米";
        //var polyline = new BMap.Polyline([pointA,pointB], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
       // map.addOverlay(polyline);     //添加折线到地图上
       return flag;
    }



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
		sendState = $(this).attr("type");
		$(this).addClass("row").siblings().removeClass("row");
		
		pageNo = 1;
		loadFlag = 1;
		$("#orderListID").html("");
		$("#load").show();
		// 获取数据
		getOrderList();
		
	});
	
}


/**
 * 获取配送列表
 * @author xuezhenxiang
 */
function getOrderList(){
	var userId = localStorage.getItem("userId");
	var formData = new FormData();
	formData.append("deliveryId",userId);
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	formData.append("state", -1);
	formData.append("sendState", sendState);
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
					$("#load").hide(); 
					return false;
				}

				for(var i = 0, len = list.length; i < len; i++){
					var order = list[i];
					var lOrderId = list[i].id; // 订单id
					var strOrderNum = list[i].strOrderNum; // 订单编号
					var strStateName = list[i].strStateName; // 订单状态
					var factPrice=list[i].factPrice;
					var distributionFee=list[i].distributionFee;
					if(distributionFee){
						factPrice=factPrice-distributionFee;
					}
					var strReceiptUserName=list[i].strReceiptUserName;
					var strReceiptMobile=list[i].strReceiptMobile;
					var strLocation=list[i].strLocation;
					var strDetailAddress=list[i].strDetailAddress;
					var strDeliveryType=list[i].strDeliveryType;
					var dtPayTime=list[i].dtPayTime;
					var dmName=list[i].dmName;
					var dmMobile=list[i].dmMobile;
					var strDeliveryTypeName;
					if(strDeliveryType=="0"){
						strDeliveryTypeName="配送";
					}else if(strDeliveryType=="1"){
						strDeliveryTypeName="自取";
					}
					var remarks=list[i].remarks;
					var isWater=list[i].isWater;
							var bucketNum=list[i].bucketNum;
					var orderListTemp = $("#orderListTemp").html();
					orderListTemp = orderListTemp.replace("#dmName#", dmName);
					orderListTemp = orderListTemp.replace("#dmMobile#", dmMobile);
					orderListTemp = orderListTemp.replace("#dtPayTime#", dtPayTime);
					orderListTemp = orderListTemp.replace("#strDeliveryTypeName#", strDeliveryTypeName);
					orderListTemp = orderListTemp.replace("#strOrderId#", lOrderId);
					orderListTemp = orderListTemp.replace("#strOrderNum#", strOrderNum);
					orderListTemp = orderListTemp.replace("#strStateName#", strStateName);
					orderListTemp = orderListTemp.replace("#strReceiptUserName#", strReceiptUserName);
					orderListTemp = orderListTemp.replace("#strReceiptMobile#", strReceiptMobile);
					orderListTemp = orderListTemp.replace("#strDetailAddress#", strLocation+" "+strDetailAddress);
					orderListTemp = orderListTemp.replace("#remarks#", remarks);
					orderListTemp = orderListTemp.replace("#bucketNum#", bucketNum);
					orderListTemp = orderListTemp.replace("#factPrice#", factPrice);
					var orderList = $(orderListTemp);
					console.log("dmName:"+dmName);
					if(dmMobile){
						orderList.find("div[name='dadaDiv']").show();
					}
					var mallOrderDetailList=list[i].mallOrderDetailList;
					;(function(orderList, lOrderId,order){
						    var remarks=order.remarks;
							if(remarks){
								orderList.find("div[name='remarksDiv']").show();
							}
							var isWater=order.isWater;
							var bucketNum=order.bucketNum;
							if(bucketNum&&bucketNum!=0&&isWater=='0'){
								orderList.find("div[name='bucketNumDiv']").show();
							}
							orderList.find(".confirmOrder").on("click", function(){
									$(this).hide();
									sendDaDaOrder(lOrderId);
									return false;
							});
							var deliverState=order.deliverState;
							orderList.find(".confirmDispatch").click(function(){
								    //判定直线距离
								    var lng=order.strLng;
								    var lat=order.strLat;
									if(lng!='0'&&lat!='0'){
										lng=parseFloat(lng);
										lat=parseFloat(lat);
										var pointDist = new BMap.Point(lng, lat);
										var f=getdist(currentPoit,pointDist);
										if(!f){//说明大于100啦
											return false;
										}
									}
									editDeliverState(1,lOrderId);
								    return false;
							});
							
					        var sendState=order.sendState;
					        var strDeliveryType=order.strDeliveryType;
					        var isWater=order.isWater;

							if(deliverState==0&&order.strDeliveryType=="0"&&isWater=='1'){
								orderList.find(".confirmOrder").show();
							}else{
								orderList.find(".confirmOrder").hide();
							}
							
							if(sendState==1){
								orderList.find(".confirmDispatch").hide();
							}
							
					})(orderList, lOrderId,order);

					for(var i1 = 0, len1 = mallOrderDetailList.length; i1 < len1; i1++){
						var item=mallOrderDetailList[i1];
						var id = item.id;
						var strGoodsName = item.strSkuName;
						var strGoodsImg = item.strGoodsImg;
						var strTitle = item.strTitle;
						if(!strTitle){
							strTitle="";
						}
						var skuPrice = item.skuPrice;
						var count = item.count;
						var strSkuAttr=item.strSkuAttr;
						if(!strSkuAttr){
							strSkuAttr="";
						}
						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsTitle#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#strGoodsSKUDetail#", strSkuAttr);
						goodsTemplate = goodsTemplate.replace("#strTitle#", strTitle);
						goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
						goodsTemplate = goodsTemplate.replace("#count#", count);
						//console.log(goodsTemplate);
						var goods = $(goodsTemplate);
						;(function(){

						})();
						orderList.find(".goodsList").append(goods);
					}
					$("#orderListID").append(orderList);
					
				}
				
				pageNo++;
				loadFlag = 1;
			}
		}
	})
}

function sendDaDaOrder(strOrderId){
	   var userId= localStorage.getItem("userId"); // 用户id
	   var userMobile= localStorage.getItem("userMobile"); // 手机号
	   var userName= localStorage.getItem("userName"); // 用户
		$.ajax({
		url: prefix + "/order/sendDaDaOrder",
		type: "POST",
		data: {"strOrderId":strOrderId,userId:userId,userName:userName,strMobile:userMobile}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					mui.toast("通知成功");
				    $("#"+strOrderId).find(".confirmOrder").hide();
				}else{
					mui.toast(result);
				}
			}
		});
}

function editDeliverState(stateValue,strOrderId){
	   var userId= localStorage.getItem("userId"); // 用户id
	   var userMobile= localStorage.getItem("userMobile"); // 手机号
	   var userName= localStorage.getItem("userName"); // 用户
		$.ajax({
		url: prefix + "/order/editDeliverState",
		type: "POST",
		data: {"strOrderId":strOrderId,"stateType":stateValue,userId:userId,userName:userName,strMobile:userMobile}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					if(0==stateValue){
						mui.toast("接单成功");
						$("#"+strOrderId).find(".confirmOrder").hide();
					}else{
						mui.toast("配送成功！");
						$("#"+strOrderId).remove();
						
					}
					
				}else{
					mui.toast(result);
				}
			}
		});
}


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





