mui.init({
	swipeBack:true
});
var userId;

mui.plusReady(function(){
	bindEent();
	userId= localStorage.getItem("userId"); // 用户id
	getCouponList(0);
});

/**
 * 绑定事件
 */
function bindEent(){
	$(".tab-list>li").each(function(i,ele){
		$(ele).data("state",i);
		$(ele).click(function(){
			  $(".active").removeClass("active");//移除原来的
			  $(this).addClass("active");//当前添加选中状态
			  var state=$(this).data("state");
			  $("#coupons").html("");//清空原来内容
			  getCouponList(state);
		});
	});
}
/**
 * 优惠券使用说明
 */
function openCouponCon(){
	pushWebView({
			webType: 'newWebview_First',
			id: "myCenter/conshow.html",
			href: "myCenter/conshow.html",
			aniShow: getaniShow(),
			extendOptions: {conType:2}
	});
}

/**
 * 获取优惠券 0：未使用，1：已使用，2：过期
 * @param {Object} state
 */
function getCouponList(state){
	     var formData=new FormData();
	     formData.append("strUserId",userId);
	     formData.append("state",state);
	     formData.append("pageNo",1);
	     formData.append("pageSize",20);
		$.ajax({
		url: prefix + "/coupon/list",
		type: "POST",
		data: formData,
		contentType: false,
		processData: false,  
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					console.log(result);
					for(var i in result){
						var item=result[i];
						var strCouponName=item["strCouponName"];
						var dtExpire=item["dtExpire"];
						var fullPrice=item["fullPrice"];
						var couponPrice=item["couponPrice"];
						var remarks=item["remarks"];
						var strHtml='<li class="coupon-item">'+
									'<div class="coupon-item-body">'+
										'<div>'+
											'<p class="coupon-name">'+strCouponName+'</p>'+
											'<p class="coupon-time">过期：'+dtExpire+'</p>'+
										'</div>'+
										'<div>'+
											'<p class="coupon-price">￥'+couponPrice+'</p>'+
											'<p class="coupon-comment">满'+fullPrice+'可用</p>'+
										'</div>'+
									'</div>'+
									'<div class="coupon-item-footer">'+
										'<p class="coupon-introduce">'+remarks+'</p>'+
									'</div>'+
								'</li>';
						$("#coupons").append(strHtml);
					}
				}else{
					  mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

