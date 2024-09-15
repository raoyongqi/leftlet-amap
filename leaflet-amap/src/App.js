import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.chinatmsproviders/src/leaflet.ChineseTmsProviders';
import 'leaflet.markercluster/dist/leaflet.markercluster'; // Import markercluster
import { markersData } from './data.js'; // 引入数据和配置

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const getColorForWeight = (weight) => {
  if (weight > 1000000) return '#FF0000'; // Red for high values
  if (weight > 100000) return '#FF7F00'; // Orange for medium-high values
  if (weight > 10000) return '#FFFF00'; // Yellow for medium values
  return '#00FF00'; // Green for low values
};

const App = () => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([31.2304, 121.4737], 13); // Center on Shanghai

    // Add a tile layer
    L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 6,
      attribution: 'Map data &copy; <a href="https://www.amap.com/">高德地图</a>'
    }).addTo(map);

    // Create a MarkerClusterGroup
    const markers = L.markerClusterGroup({
      iconCreateFunction: function(cluster) {
        const childMarkers = cluster.getAllChildMarkers();
        let totalWeight = 0;

        // Calculate the total weight of the cluster
        childMarkers.forEach(marker => {
          totalWeight += marker.options.weight;
        });

        // Customize the cluster icon
        const clusterColor = getColorForWeight(totalWeight);
        return L.divIcon({
          html: `<div style="background-color: ${clusterColor}; border-radius: 50%; color: #fff; text-align: center; line-height: 40px; width: ${Math.min(totalWeight / 10, 80)}px; height: ${Math.min(totalWeight / 10, 80)}px;">${formatNumber(totalWeight)}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [Math.min(totalWeight / 10, 80), Math.min(totalWeight / 10, 80)],
        });
      }
    });

    // Add individual markers
    markersData.forEach(item => {
      const size = Math.min(item.weight * 2, 30); // Adjust size based on weight
      const markerColor = getColorForWeight(item.weight);
      const marker = L.marker(item.position, {
        icon: L.divIcon({
          html: `<div style="background-color: ${markerColor}; border-radius: 50%; color: #fff; text-align: center; line-height: ${size}px; width: ${size}px; height: ${size}px;">${formatNumber(item.weight)}</div>`,
          className: 'custom-marker-icon',
          iconSize: [size, size],
        }),
        weight: item.weight
      });
      markers.addLayer(marker);
    });

    // Add the MarkerClusterGroup to the map
    map.addLayer(markers);

    // Cleanup function to avoid memory leaks
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{ height: '100%', width: '100%' }}></div>
  );
};

export default App;
