var openType;//打开类型
var currentWebview; // 当前子页面
var map;
var changeValue;
var editAddressWebView;
var currentPoit;
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	var chooselng=currentWebview.chooselng;
	var chooselat=currentWebview.chooselat;
	console.log("chooselng:"+chooselng+" chooselat:"+chooselat);
    if(chooselng&&chooselat){
    	currentPoit=new BMap.Point(chooselng, chooselat);
    }
	editAddressWebView=plus.webview.getWebviewById("appAddress/editAddress.html");
	initMap();
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	$("#searchKey").bind('input propertychange', function() {
		 changeValue=$(this).val();
		 searchMap();
       }
     );
}

function openSearchMap(v){
	pushWebView({
			webType: 'newWebview_First',
			id: 'appAddress/searchMap.html',
			href: 'appAddress/searchMap.html',
			aniShow: getaniShow(),
			title: "地图检索",
			isBars: false,
			barsIcon: '',
			extendOptions: {changeValue:v,map:map}
		});
}




/**
 * 地图初始化
 */
function initMap(){
	map= new BMap.Map("container");
// 创建地图实例  
var point = new BMap.Point(116.404, 39.915);;
map.centerAndZoom(point, 15);
// 初始化地图，设置中心点坐标和地图级别 
	var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
	if(this.getStatus() == BMAP_STATUS_SUCCESS){
		if(currentPoit==undefined){
			currentPoit=r.point;
		}
		var mk = new BMap.Marker(currentPoit);
		map.addOverlay(mk);
		map.panTo(currentPoit);
		displayPOI()
		//alert('您的位置：'+r.point.lng+','+r.point.lat);
	}
	else {
		alert('failed'+this.getStatus());
	}        
});


//获取500范围内的poi
var mOption = {
    poiRadius : 500,           //半径为1000米内的POI,默认100米
    numPois : 12                //列举出50个POI,默认10个
}
var myGeo = new BMap.Geocoder();        //创建地址解析实例
function displayPOI(){
    map.addOverlay(new BMap.Circle(currentPoit,500));        //添加一个圆形覆盖物
    myGeo.getLocation(currentPoit,
        function mCallback(rs){
            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
            setShow(allPois);
        },mOption
    );
}
}

/**
 * 地址地址信息
 */
function setShow(allPois){
	 for(i=0;i<allPois.length;++i){
	 	       var poi=allPois[i];
	 	       var poit=poi.point;
                var strHtml='<li class="addressDetailInfo">'+
					'<div class="receiveInfo">'+
						'<div>'+
						'	<span style="font-size: .3rem;color: #333;">'+poi.title+'</span>'+
						'</div>'+
						'<div>'+
							'<span>'+poi.address+'</span>'+
						'</div>'+
					'</div>'+
				'</li>';
				$("#peripheryInfo").append(strHtml);
				$("#peripheryInfo li:eq("+i+")").data("i",i);
                map.addOverlay(new BMap.Marker(poit));              
           }
	 $("#peripheryInfo li").click(function(){
	 	    var n=$(this).data("i");
	 	    var choosePoi=allPois[n];
	 	    var chooseTitle=choosePoi.title;
	 	    var chooseAddress=choosePoi.address;
	 	    var choosePoit=choosePoi.point;
	 	    var lng=choosePoit.lng;//经度
	 	    var lat=choosePoit.lat;//纬度
	 	    var data={chooseTitle:chooseTitle,chooseAddress:chooseAddress,lng:lng,lat:lat};
	 	    mui.fire(editAddressWebView,"chooseMap",data);
	 	    mui.back();
	 	    
	 });
	 $("#load").hide();
}

function searchMap(){
	alert("changeValue:"+changeValue);
 var local = new BMap.LocalSearch("石家庄",   
            {renderOptions: {map: map,autoViewport: true},pageCapacity: 8,onSearchComplete:function(results){
            	if (local.getStatus() == BMAP_STATUS_SUCCESS){      
		            // 判断状态是否正确      
		            var s = [];      
		            for (var i = 0; i < results.getCurrentNumPois(); i ++){      
		                s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);      
		            }      
		             console.log(s.join("<br>"));
        		}else{
        			mui.toast("检索失败");
        		}
            	
            }});  
local.search(changeValue);
}

