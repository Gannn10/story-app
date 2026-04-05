import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function initMap(id, lat=-6.2, lon=106.8) {
  const map = L.map(id).setView([lat, lon], 10);

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  const sat = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');

  osm.addTo(map);

  L.control.layers({
    "Default": osm,
    "Satellite": sat
  }).addTo(map);

  return map;
}