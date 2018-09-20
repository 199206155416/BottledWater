var openType;//打开类型
var currentWebview; // 当前子页面
var map;
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	initMap();
	// 绑定事件
	//bindEvent();
});
/**
 * 地图初始化
 */
function initMap(){
	map= new BMap.Map("container");
// 创建地图实例  
var point = new BMap.Point(116.404, 39.915);
var mPoint;
map.centerAndZoom(point, 15);
// 初始化地图，设置中心点坐标和地图级别 
var geolocation = new BMap.Geolocation();
//定位
geolocation.getCurrentPosition(function(r){
	if(this.getStatus() == BMAP_STATUS_SUCCESS){
		var mk = new BMap.Marker(r.point);
		map.addOverlay(mk);
		map.panTo(r.point);
		mPoint=r.point;
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
    map.addOverlay(new BMap.Circle(mPoint,500));        //添加一个圆形覆盖物
    myGeo.getLocation(mPoint,
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
                var strHtml='<li class="addressDetailInfo">'+
					'<div class="receiveInfo">'+
						'<div>'+
						'	<span>'+allPois[i].title+'</span>'+
						'</div>'+
						'<div>'+
							'<span>'+allPois[i].address+'</span>'+
						'</div>'+
					'</div>'+
				'</li>';
				$("#peripheryInfo").append(strHtml);
                map.addOverlay(new BMap.Marker(allPois[i].point));                
           }
}

