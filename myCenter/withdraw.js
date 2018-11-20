var userId; // 用户id
var state = 0; // tab状态  0：未使用，1：已使用，2：过期
var pageNo = 1;
var loadFlag = 1; // 上拉加载标志
var _LoadNumber = { a: false };

mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	bindEvent();
	userId = localStorage.getItem("userId"); // 用户id
	getCouponList();
});

/**
 * 绑定事件
 */
function bindEvent() {
	// 点击tab切换列表
	$(".tab-list").on("click", "li", function() {
		state = $(this).index();
		$(".active").removeClass("active"); //移除原来的
		$(this).addClass("active"); //当前添加选中状态
		$("#coupons").html(""); //清空原来内容
		$("#load").show();
		getCouponList();
	});

	// 屏幕滚动后加载列表
	$(window).scroll(function() {
		var scrollTop = $(this).scrollTop();	// 滚动高度		    
		var scrollHeight = $(this).height(); // 文档高度
		var windowHeight = $(window).height(); // 文档窗口高度
			
		if (scrollTop + windowHeight >= scrollHeight - 300) {
			if(loadFlag == 1){
				loadFlag = 0;
				getCouponList();
			}
		}
	});
};
/**
 * 优惠券使用说明
 */
function openCouponCon() {
	pushWebView({
		webType: 'newWebview_First',
		id: "myCenter/conshow.html",
		href: "myCenter/conshow.html",
		aniShow: getaniShow(),
		extendOptions: {
			conType: 2
		}
	});
}

/**
 * 获取优惠券 0：未使用，1：已使用，2：过期
 * @param {Object} state
 */
function getCouponList() {
	var formData = new FormData();
	formData.append("strUserId", userId);
	formData.append("state", state);
	formData.append("pageNo", pageNo);
	formData.append("pageSize", 20);
	$.ajax({
		url: prefix + "/coupon/list",
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,
		dataType: "json",
		success: function(res) {
			_LoadNumber.a = true;
			ajaxLog(res);
			var result = res.result;
			if(res.resCode == 0) {
				console.log(result);
				
				if(result.length < 10){
					$("#load").hide();
				}else{
					$("#load").show();
				}
				
				for(var i in result) {
					var item = result[i];
					var strCouponName = item["strCouponName"];
					var dtExpire = item["dtExpire"];
					var fullPrice = item["fullPrice"];
					var couponPrice = item["couponPrice"];
					var remarks = item["remarks"];
					var strHtml = '<li class="coupon-item">' +
						'<div class="coupon-item-body">' +
						'<div>' +
						'<p class="coupon-name">' + strCouponName + '</p>' +
						'<p class="coupon-time">过期：' + dtExpire + '</p>' +
						'</div>' +
						'<div>' +
						'<p class="coupon-price">￥' + couponPrice + '</p>' +
						'<p class="coupon-comment">满' + fullPrice + '可用</p>' +
						'</div>' +
						'</div>' +
						'<div class="coupon-item-footer">' +
						'<p class="coupon-introduce">' + remarks + '</p>' +
						'</div>' +
						'</li>';
					$("#coupons").append(strHtml);
				}

				pageNo++;
				loadFlag = 1;
			} else {
				mui.alert(result, '提示', function(e) {}, "div");
			}
		}
	});
}

//下拉刷新
function PullRefresh(id, callback) {
	var Tween = {
		Linear: function(t, b, c, d) {
			return c * t / d + b;
		},
		Quad: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t + b;
			},
			easeOut: function(t, b, c, d) {
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut: function(t, b, c, d) {
				if((t /= d / 2) < 1) return c / 2 * t * t + b;
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		Cubic: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t * t + b;
			},
			easeOut: function(t, b, c, d) {
				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if((t /= d / 2) < 1) return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b;
			}
		},
		Quart: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t * t * t + b;
			},
			easeOut: function(t, b, c, d) {
				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			}
		},
		Quint: {
			easeIn: function(t, b, c, d) {
				return c * (t /= d) * t * t * t * t + b;
			},
			easeOut: function(t, b, c, d) {
				return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
			}
		},
		Sine: {
			easeIn: function(t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},
			easeOut: function(t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},
			easeInOut: function(t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			}
		},
		Expo: {
			easeIn: function(t, b, c, d) {
				return(t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
			},
			easeOut: function(t, b, c, d) {
				return(t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},
			easeInOut: function(t, b, c, d) {
				if(t == 0) return b;
				if(t == d) return b + c;
				if((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
			}
		},
		Circ: {
			easeIn: function(t, b, c, d) {
				return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
			},
			easeOut: function(t, b, c, d) {
				return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
			},
			easeInOut: function(t, b, c, d) {
				if((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
			}
		},
		Elastic: {
			easeIn: function(t, b, c, d, a, p) {
				if(t == 0) return b;
				if((t /= d) == 1) return b + c;
				if(!p) p = d * .3;
				if(!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			},
			easeOut: function(t, b, c, d, a, p) {
				if(t == 0) return b;
				if((t /= d) == 1) return b + c;
				if(!p) p = d * .3;
				if(!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return(a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			},
			easeInOut: function(t, b, c, d, a, p) {
				if(t == 0) return b;
				if((t /= d / 2) == 2) return b + c;
				if(!p) p = d * (.3 * 1.5);
				if(!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
				} else var s = p / (2 * Math.PI) * Math.asin(c / a);
				if(t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
			}
		},
		Back: {
			easeIn: function(t, b, c, d, s) {
				if(s == undefined) s = 1.70158;
				return c * (t /= d) * t * ((s + 1) * t - s) + b;
			},
			easeOut: function(t, b, c, d, s) {
				if(s == undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			},
			easeInOut: function(t, b, c, d, s) {
				if(s == undefined) s = 1.70158;
				if((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
			}
		},
		Bounce: {
			easeIn: function(t, b, c, d) {
				return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
			},
			easeOut: function(t, b, c, d) {
				if((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if(t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if(t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			},
			easeInOut: function(t, b, c, d) {
				if(t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
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
	scrollElement.addEventListener('scroll', function(event) {
		//console.log(event);

	}, false);
	scrollElement.addEventListener('touchstart', function(event) {
		var touch = event.targetTouches[0];
		startClientY = xround(touch.clientY, 2);
		prevMoveY = startClientY;
	}, false);
	var touchmove = function(event) {
		var touch = event.targetTouches[0];
		var clientY = xround(touch.clientY, 2);
		var direction = 'down';
		if(prevMoveY > clientY) {
			direction = 'up'
		}
		//触碰到下滑临界值
		if(topState === 1 && $("#scroll").scrollTop() <= 0 && direction == 'down') {
			event.preventDefault();
			startClientY = clientY;
			topState = 3;
			//console.log('到顶了', event)
			return;
		}
		if(topState == 3) {
			if(window.swiper && window.swiper.autoplaying == true) {
				window.swiper.stopAutoplay();
			}
			if(direction == 'down') {
				event.preventDefault();
				distance = (clientY - startClientY) / 2 - refreshHeight;
				setState(distance);
				scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
				scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			} else {
				distance = clientY - startClientY - refreshHeight;
				if(distance > -refreshHeight) {
					event.preventDefault();
					distance = (clientY - startClientY) / 2 - refreshHeight;
					setState(distance);
					scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
				} else {
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
		if(refresState != 2 && distance >= 0) {
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'block';
			refresState = 2;
		}
		if(refresState != 1 && distance < 0) {
			refresState = 1;
			document.getElementById('top1').style.display = 'block';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'none';
		}
	}
	scrollElement.addEventListener('touchmove', touchmove, false);
	var touchend = function(event) {
		scrollElement.removeEventListener('touchmove', touchmove, false);
		scrollElement.removeEventListener('touchend', touchend, false);
		var touch = event.targetTouches[0];
		if(refresState == 2) {
			refresState = 3;
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'block';
			document.getElementById('top3').style.display = 'none';
			an(0);
			_LoadNumber = {
				a: false
			};
			_isPullRefresh = true;
			var loadNumberTimeId = setInterval(function() {
				if(_LoadNumber.a) {
					_isPullRefresh = false;
					refresState = 1;
					an(-refreshHeight);
					clearInterval(loadNumberTimeId);
				}

			}, 1000);
			// 请求接口数据
			callback();
		} else {

			if(topState == 3) {
				an(-refreshHeight);
			} else {
				scrollElement.addEventListener('touchmove', touchmove, false);
				scrollElement.addEventListener('touchend', touchend, false);
			}
		}
		topState = 1;
	}
	scrollElement.addEventListener('touchend', touchend, false);
	scrollElement.addEventListener('touchcancel', touchend, false);

	var an = function(position) {
		position = +position;
		var tdistance = +distance
		var start = 0,
			during = 35;
		var _run = function() {
			start++;
			distance = Tween.Cubic.easeOut(start, tdistance, position - tdistance, during);
			scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
			scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			if(start < during) {
				requestAnimationFrame(_run);
			} else {
				if(refresState !== 3) {
					scrollElement.addEventListener('touchmove', touchmove, false);
					scrollElement.addEventListener('touchend', touchend, false);
				} else {}
				if(position == (-refreshHeight)) {
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
PullRefresh('scroll', function() {
	pageNo = 1;
	loadFlag = 1;
	$("#coupons").html("");
	// 获取数据
	getCouponList();
});