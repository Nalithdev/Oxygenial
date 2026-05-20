"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "selected-marker",
});

export interface MedicalCompanyMarker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  sectors?: string | null;
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

interface MedicalMapProps {
  companies: MedicalCompanyMarker[];
  selectedId: number | null;
  onSelect: (company: MedicalCompanyMarker) => void;
}

export function MedicalMap({ companies, selectedId, onSelect }: MedicalMapProps) {
  const withCoords = companies.filter(
    (c) => c.latitude != null && c.longitude != null,
  );
  const selected = withCoords.find((c) => c.id === selectedId);

  return (
    // position:relative + z-index:0 crée un stacking context sandboxant tous les z-index internes de Leaflet
    <div className="w-full h-full relative" style={{ zIndex: 0 }}>
      {/* Badge à l'intérieur du stacking context → ne peut pas passer au-dessus du Dialog */}
      {withCoords.length > 0 && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm border border-slate-200 pointer-events-none">
          {withCoords.length} service{withCoords.length > 1 ? "s" : ""} sur la carte
        </div>
      )}
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={6}
        className="w-full h-full rounded-xl"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {withCoords.map((company) => (
          <Marker
            key={company.id}
            position={[company.latitude, company.longitude]}
            icon={company.id === selectedId ? selectedIcon : defaultIcon}
            eventHandlers={{ click: () => onSelect(company) }}
          />
        ))}
        {selected && <FlyTo lat={selected.latitude} lng={selected.longitude} />}
      </MapContainer>
    </div>
  );
}
