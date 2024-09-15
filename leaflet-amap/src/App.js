import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.chinatmsproviders/src/leaflet.ChineseTmsProviders';
import 'leaflet.markercluster/dist/leaflet.markercluster'; // 引入 markercluster

const App = () => {
  useEffect(() => {
    // 初始化地图
    const map = L.map('map').setView([31.2304, 121.4737], 13); // 定位到上海

    // 使用高德地图瓦片层
    L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.amap.com/">高德地图</a>'
    }).addTo(map);

    // 数据点，包含权重
    const markersData = [
      { position: [31.2304, 121.4737], weight: 5 },
      { position: [31.2204, 121.4837], weight: 10 },
      { position: [31.2404, 121.4637], weight: 3 },
      // 添加更多数据点
    ];

    // 创建 MarkerClusterGroup
    const markers = L.markerClusterGroup({
      iconCreateFunction: function(cluster) {
        const childMarkers = cluster.getAllChildMarkers();
        let totalWeight = 0;

        // 计算聚合点的权重总和
        childMarkers.forEach(marker => {
          totalWeight += marker.options.weight;
        });

        // 自定义聚合点的显示样式
        return L.divIcon({
          html: `<div style="background-color: rgba(0, 128, 255, 0.7); border-radius: 50%; color: #fff; text-align: center; line-height: 40px; width: 40px; height: 40px;">${totalWeight}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
        });
      }
    });

    // 添加 Marker 到 MarkerClusterGroup 中
    markersData.forEach(item => {
      const marker = L.marker(item.position, { weight: item.weight });
      markers.addLayer(marker);
    });

    // 将 MarkerClusterGroup 添加到地图
    map.addLayer(markers);

    // 清理函数，避免内存泄漏
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: "100vh" }}></div>
    </div>
  );
};

export default App;
