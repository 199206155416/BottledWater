var _LoadNumber = { a: false };

mui.init({
	swipeBack: false
});
var parentWebView;
var touxiangimg;
var logoutBtn;
var trueimg;
var touxiangword;
var accountBalance;
mui.plusReady(function() {
	//注册列表的点击事件
	addListevent();
	renderHtml();
	getBalace();
	getTel();
});
//客服电话
function getTel() {
	$.ajax({
		url: prefix + "/sys/getSysValue/5",
		type: 'GET',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				$("#tel").html(res.result);
			}
		}
	});
}

//获取账户余额
function getBalace(){
	var userId= localStorage.getItem("userId"); // 用户id
	$.ajax({
		url: prefix + "/account/getBalace/"+userId,
		type: "GET",
		dataType: "json",
		success: function(res){
			_LoadNumber.a = true;
			ajaxLog(res);
			if(res.resCode == 0){
				var result = res.result;
				accountBalance=result;
				$("#lAccountBalance").html(result);
			}else{
				alert(result);
			}
		}
	})
}

// 渲染页面
function renderHtml(){
	var userRoleNames = localStorage.getItem("userRoleNames");
	var userMobile = localStorage.getItem("userMobile");
	var userRoleNames=localStorage.getItem("userRoleNames");
    if(userRoleNames&&userRoleNames.indexOf("配送员")!=-1&&userRoleNames.indexOf("便利店")==-1){//如果角色有配送员就显示我的配送单
         $("li[name='dis']").show();
    }else{
    	 $("li[name='dis']").hide();
    }
     if(userRoleNames&&userRoleNames.indexOf("便利店配送员")!=-1){
     	 $("li[name='dis']").eq(0).show();
         $("li[name='zwjs']").show();
    }else{
         $("li[name='zwjs']").hide();
    }
    if(!userRoleNames){
    	userRoleNames="";
    }
	$("#userName").html(userRoleNames);
	$("#userPhone").html(userMobile);
};

//注册列表的点击事件
function addListevent() {
	
	 window.addEventListener('setAccount',function(e){
			console.log(JSON.stringify(e.detail));
			var data=e.detail;
			accountBalance=data["m"];
		    $("#lAccountBalance").html(accountBalance);
	},false);
	
	window.addEventListener('loginSuccess',function(e){
			renderHtml()
	},false);
	
	$("#mineHandleList").on('click', 'li', function() {
		var id = $(this).attr("id");
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
		}
		var optionsData={};
		if("appAddress/addressList.html"==id){
			optionsData={openType:1};
		}else if(id=="myCenter/accountCharge.html"){
			optionsData={accountBalance:accountBalance};
		}
		pushWebView({
			webType: 'newWebview_First',
			id: id,
			title:"",
			href: id,
			aniShow: aniShow,
			extendOptions: optionsData
		})
	});

	$("#messageBtn").on("click", function(){
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {
			
		}else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
			
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				title:"",
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		pushWebView({
			webType: 'newWebview_First',
			id: "myCenter/message.html",
			title:"",
			href: "myCenter/message.html",
			aniShow: aniShow,
			extendOptions: {}
		})
	});
	
	// 去订单页
	$("#openOrder").on("click", '.item', function(){
		var type = $(this).attr("type"); 
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		
		if(type == -6){
			pushWebView({
				webType: 'newWebview_First',
				id: "appOrder/afterSale.html",
				href: "appOrder/afterSale.html",
				aniShow: aniShow,
				extendOptions: {}
			});
			return false;
		}
		
		pushWebView({
			webType: 'newWebview_First',
			id: "appOrder/orderList.html",
			href: "appOrder/orderList.html",
			aniShow: aniShow,
			extendOptions: {
				type: type
			}
		});
	});
	// 全部订单
	$("#myOrder").on("click", function(){
		var aniShow = getaniShow();
		//检测已经存在sessionkey否者运行下面的登陆代码
		if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
			id = "login/login.html";
			aniShow = 'slide-in-bottom';
			
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: {}
			})
			return false;
		}
		
		pushWebView({
			webType: 'newWebview_First',
			id: "appOrder/orderList.html",
			href: "appOrder/orderList.html",
			aniShow: aniShow,
			extendOptions: {
				type: -1
			}
		});
	});
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
		 	_LoadNumber = { a: false, b:false };
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
	// 获取余额
	getBalace();
});
