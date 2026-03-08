import { useState, useRef, useMemo } from "react";
import { G } from "../../constants/theme";
import { LOCATIONS, REGION_LABELS, fetchLocationData } from "../../utils/simulation";
import { Search, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Create a custom icon to replicate the old MapMarker design
const createCustomIcon = (c, isSelected, isRecommended, locId, locLabel, isHovered) => {
  const color = isSelected ? G.cyan : isRecommended ? "#22c55e" : isHovered ? G.blue : G.textMuted;
  const pulseHtml = (isSelected || isRecommended)
    ? `<div class="marker-pulse" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1px solid ${isRecommended ? '#22c55e' : G.cyan}"></div>`
    : '';

  const labelHtml = `<div style="
    position: absolute; 
    top: -20px; 
    left: 20px; 
    padding: 4px 12px;
    background: ${isSelected ? G.blue : isRecommended ? 'rgba(34, 197, 94, 0.2)' : '#1e293b'};
    border: 1px solid ${isSelected ? G.cyan : isRecommended ? '#22c55e' : 'transparent'};
    border-radius: 4px;
    white-space: nowrap;
    opacity: ${(isHovered || isSelected) ? 1 : 0.4};
    color: ${isSelected ? 'white' : G.text};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    pointer-events: none;
  ">${(isHovered || isSelected || isRecommended) ? (REGION_LABELS[locId]?.name.toUpperCase() || locLabel.toUpperCase()) : locLabel}</div>`;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
        ${pulseHtml}
        <div style="position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #080c14; border: 2px solid ${color};"></div>
        <div style="position: absolute; width: 6px; height: 6px; border-radius: 50%; background: ${isSelected ? G.cyan : isRecommended ? '#22c55e' : color};"></div>
        ${labelHtml}
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24] // Center the icon
  });
};

const LocationMarker = ({ lat, lng, loc, isSelected, isHovered, isRecommended, onSelect, setHovered }) => {
  const icon = useMemo(
    () => createCustomIcon(null, isSelected, isRecommended, loc.id, loc.label, isHovered),
    [isSelected, isRecommended, isHovered, loc]
  );

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(loc.id),
        mouseover: () => setHovered(loc.id),
        mouseout: () => setHovered(null),
      }}
    />
  );
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Component to handle recentering the map if needed
const MapController = ({ selected }) => {
  const map = useMap();
  useMemo(() => {
    if (typeof selected === 'object' && selected !== null && selected.lat && selected.lng) {
      map.flyTo([selected.lat, selected.lng], map.getZoom());
    }
  }, [selected, map]);
  return null;
};

export function WorldMap({ selected, onSelect, recommendations = [] }) {
  const [hovered, setHovered] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const defaultProps = {
    center: [22.5937, 78.9629],
    zoom: 4
  };

  const handleMapClick = async ({ lat, lng }) => {
    setIsFetching(true);
    try {
      const data = await fetchLocationData(lat, lng);
      onSelect(data);
    } catch (e) {
      alert(e.message);
      console.warn("Location error boundary constraint", e);
    } finally {
      setIsFetching(false);
    }
  };

  const isCustomSelected = typeof selected === 'object' && selected !== null;

  return (
    <div className="glass glossy" style={{
      position: "relative",
      width: "100%",
      height: "450px",
      borderRadius: "24px",
      overflow: "hidden",
      background: "#080c14",
      border: `1px solid ${G.border}`,
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1
    }}>
      <style>
        {`
          .leaflet-container {
            background: #080c14;
            font-family: inherit;
          }
          .custom-leaflet-icon {
            background: transparent;
            border: none;
          }
          @keyframes mapMarkerPulse {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(3); opacity: 0; }
          }
          .marker-pulse {
            animation: mapMarkerPulse 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>

      {/* Map Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: `1px solid ${G.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(255,255,255,0.02)",
        zIndex: 1000,
        position: 'relative'
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isFetching ? (
            <Loader2 size={14} color={G.blue} className="animate-spin" />
          ) : (
            <Search size={14} color={G.textMuted} />
          )}
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: isFetching ? G.blue : G.textMuted }}>
            {isFetching ? "ANALYZING REGION..." : "GLOBAL REGISTRY"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "10px", color: G.textMuted }}>Optimal Zones</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: G.blue }} />
            <span style={{ fontSize: "10px", color: G.textMuted }}>Selected Region</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <MapContainer
          center={defaultProps.center}
          zoom={defaultProps.zoom}
          minZoom={1}
          maxZoom={10}
          zoomControl={false}
          style={{ width: '100%', height: '100%', cursor: isFetching ? "wait" : "crosshair" }}
        >
          {/* Smooth dark basemap from CartoDB */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapEvents onMapClick={handleMapClick} />
          <MapController selected={selected} />

          {LOCATIONS.map(loc => {
            const [lat, lng] = loc.cx.split(',').map(Number);
            return (
              <LocationMarker
                key={loc.id}
                lat={lat}
                lng={lng}
                loc={loc}
                isSelected={selected === loc.id}
                isHovered={hovered === loc.id}
                isRecommended={recommendations.includes(loc.id)}
                onSelect={onSelect}
                setHovered={setHovered}
              />
            );
          })}

          {isCustomSelected && (
            <LocationMarker
              key="custom-selection"
              lat={selected.lat}
              lng={selected.lng}
              loc={{ id: selected.id, label: selected.name }}
              isSelected={true}
              isHovered={false}
              isRecommended={false}
              onSelect={() => { }}
              setHovered={() => { }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
