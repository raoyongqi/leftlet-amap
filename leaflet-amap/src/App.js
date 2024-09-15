import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.chinatmsproviders/src/leaflet.ChineseTmsProviders';
import 'leaflet.markercluster/dist/leaflet.markercluster'; // Import markercluster

const App = () => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([31.2304, 121.4737], 13); // Center on Shanghai

    // Add a tile layer
    L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.amap.com/">高德地图</a>'
    }).addTo(map);

    // Sample data with weights
    const markersData = [
      { position: [31.2304, 121.4737], weight: 5 },
      { position: [31.2204, 121.4837], weight: 10 },
      { position: [31.2404, 121.4637], weight: 3 },
      // Add more data points as needed
    ];

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
        return L.divIcon({
          html: `<div style="background-color: rgba(0, 128, 255, 0.7); border-radius: 50%; color: #fff; text-align: center; line-height: 40px; width: 40px; height: 40px;">${totalWeight}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
        });
      }
    });

    // Add individual markers
    markersData.forEach(item => {
      const marker = L.marker(item.position, {
        icon: L.divIcon({
          html: `<div style="background-color: rgba(255, 128, 0, 0.7); border-radius: 50%; color: #fff; text-align: center; line-height: 20px; width: 30px; height: 30px;">${item.weight}</div>`,
          className: 'custom-marker-icon',
          iconSize: [30, 30],
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
