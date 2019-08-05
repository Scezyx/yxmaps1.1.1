// JavaScript 
	function G(id) {
		return document.getElementById(id);
	}//获取id函数

var map = new BMap.Map("allmap");//地图实例
	var point = new BMap.Point(106.55544,291.576526);
	map.centerAndZoom(point,12);
	map.enableDragging();
	map.enableScrollWheelZoom();//启用鼠标滚轮
var p;	//起点
var p1; //终点
var data;
var data_obj = {};
var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
	if(this.getStatus() == BMAP_STATUS_SUCCESS){
		var mk = new BMap.Marker(r.point);
		map.addOverlay(mk);
		map.panTo(r.point);
		map.centerAndZoom(r.point,12);
		mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画*/
		var circle = new BMap.Circle(r.point,10000,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});/*创建一个圆实例*/
		map.addOverlay(circle);/*将圆添加到地图中*/
		var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, panel: "r-result"}}); /*查找*/
		local.searchNearby('洗车',r.point,10000);/*调用查找*/
		point.lng = r.point.lng;
		point.lat = r.point.lat;
		var options = {
				onSearchComplete: function(results){
					// 判断状态是否正确
					if (local.getStatus() == BMAP_STATUS_SUCCESS){
						var s = [];
						for (var i = 0; i < results.getCurrentNumPois(); i ++){
							s.push(results.getPoi(i).title);
							data = s;
						}
						for(var i = 0;i < data.length;i++){
							/* console.info(data[i]); */
							/* data_obj添加数据 */
							var key = data[i];
							var val = data[i];
							data_obj[key] = val;
						}
						localStorage.setItem('map_dt',JSON.stringify(data_obj)); // 存入本地文件
						
					}
				}
			};
			var local = new BMap.LocalSearch(map, options);
			local.searchNearby('洗车',r.point,10000);/*调用查找*/
	}
	else {
		alert("无法为您定位,请确认是否开启GPS");
	}        
});


/*地点输入提示*/
var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "suggestId"
		,"location" : map
	});

	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace();
	});

	function setPlace(){
		map.clearOverlays();    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.centerAndZoom(pp, 18);
			map.addOverlay(new BMap.Marker(pp));    //添加标注
			var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
			driving.search(point,pp);//规划驾车路线
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(myValue);
	}
/*地点输入提示 end*/


/*定位按钮-----------------------------------------------*/

  var geolocationControl = new BMap.GeolocationControl();
  geolocationControl.addEventListener("locationSuccess", function(e){
    // 定位成功事件
    var address = '';
    address += e.addressComponent.province;
    address += e.addressComponent.city;
    address += e.addressComponent.district;
    address += e.addressComponent.street;
    address += e.addressComponent.streetNumber;
    alert("当前定位地址为：" + address);
	map.centerAndZoom(address,12);
  });
  geolocationControl.addEventListener("locationError",function(e){
    // 定位失败事件
    alert("无法获取您的位置");
  });
  
  map.addControl(geolocationControl);
/*定位按钮 end-------------------------------------------*/
/*设置铅点*/
var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
		//offset: new BMap.Size(0, -5),    //相当于CSS精灵
		imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
	  });
	var driving2 = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});    //驾车实例
	driving2.search(p, p1);    //显示一条公交线路

	window.run = function (){
		var driving = new BMap.DrivingRoute(map);    //驾车实例
		driving.search(p, p1);
		driving.setSearchCompleteCallback(function(){
			var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
			var paths = pts.length;    //获得有几个点

			var carMk = new BMap.Marker(pts[0],{icon:myIcon});
			map.addOverlay(carMk);
			i=0;
			function resetMkPoint(i){
				carMk.setPosition(pts[i]);
				if(i < paths){
					setTimeout(function(){
						i++;
						resetMkPoint(i);
					},100);
				}
			}
			setTimeout(function(){
				resetMkPoint(5);
			},100)

		});
	}

	setTimeout(function(){
		run();
	},1500);
/*设置铅点 end*/
G("SS").onclick=function(){
	var driving = new BMap.DrivingRoute(map);
	console.info(G("suggestId").value);
	myGeo.getPoint(G("suggestId").value, function(p1){
			if (p1) {
				map.centerAndZoom(p1, 14);
				map.addOverlay(new BMap.Marker(p1));
			}else{
				alert("您选择地址没有解析到结果!");
			}
		}, "重庆市");
	var routePolicy = BMAP_DRIVING_POLICY_LEAST_DISTANCE;
	var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
	driving.search(point,pp);//规划驾车路线		
}

G("refresh").onclick=function(){
	map.clearOverlays(); 
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
			map.centerAndZoom(r.point,12);
			mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画*/
			var circle = new BMap.Circle(r.point,10000,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});/*创建一个圆实例*/
			map.addOverlay(circle);/*将圆添加到地图中*/
			var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, panel: "r-result"}}); /*查找*/
			local.searchNearby('洗车',r.point,10000);/*调用查找*/
			point.lng = r.point.lng;
			point.lat = r.point.lat;
			var options = {
					onSearchComplete: function(results){
						// 判断状态是否正确
						if (local.getStatus() == BMAP_STATUS_SUCCESS){
							var s = [];
							for (var i = 0; i < results.getCurrentNumPois(); i ++){
								s.push(results.getPoi(i).title);
								data = s;
							}
							for(var i = 0;i < data.length;i++){
								/* console.info(data[i]); */
								/* data_obj添加数据 */
								var key = data[i];
								var val = data[i];
								data_obj[key] = val;
							}
							localStorage.setItem('map_dt',JSON.stringify(data_obj)); // 存入本地文件
						}
					}
				};
				var local = new BMap.LocalSearch(map, options);
				local.searchNearby('洗车',r.point,10000);/*调用查找*/
		}
		else {
			alert("无法为您定位,请确认是否开启GPS");
		}        
	});
};
