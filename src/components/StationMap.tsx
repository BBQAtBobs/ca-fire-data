"use client";

/**
 * Lightweight station map using OpenStreetMap tile images.
 * Renders station markers as positioned dots over a static map tile.
 * No Mapbox token required.
 */

import { useState } from "react";

interface Station {
  name: string;
  lat: number;
  lng: number;
}

// Convert lat/lng to pixel position within the map container
// using a simple Mercator approximation relative to the map center
function latLngToOffset(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  width: number,
  height: number
): { x: number; y: number } {
  const scale = Math.pow(2, zoom) * 256;

  const worldX = ((lng + 180) / 360) * scale;
  const worldY =
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) +
          1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
    scale;

  const centerWorldX = ((centerLng + 180) / 360) * scale;
  const centerWorldY =
    ((1 -
      Math.log(
        Math.tan((centerLat * Math.PI) / 180) +
          1 / Math.cos((centerLat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
    scale;

  return {
    x: width / 2 + (worldX - centerWorldX),
    y: height / 2 + (worldY - centerWorldY),
  };
}

export function StationMap({
  stations,
  centerLat,
  centerLng,
  zoom = 11,
  className = "",
}: {
  stations: Station[];
  centerLat: number;
  centerLng: number;
  zoom?: number;
  className?: string;
}) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const width = 600;
  const height = 340;

  // Generate OSM tile URL for the center
  const tileX = Math.floor(((centerLng + 180) / 360) * Math.pow(2, zoom));
  const tileY = Math.floor(
    ((1 -
      Math.log(
        Math.tan((centerLat * Math.PI) / 180) +
          1 / Math.cos((centerLat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );

  // Use a static map image approach — multiple tiles stitched
  const tiles: { x: number; y: number; url: string }[] = [];
  const tilesX = 3;
  const tilesY = 2;
  for (let dx = -1; dx < tilesX - 1; dx++) {
    for (let dy = -1; dy < tilesY - 1; dy++) {
      tiles.push({
        x: dx,
        y: dy,
        url: `https://tile.openstreetmap.org/${zoom}/${tileX + dx}/${tileY + dy}.png`,
      });
    }
  }

  // Calculate tile offset to center the map
  const tilePixelX = ((centerLng + 180) / 360) * Math.pow(2, zoom) * 256;
  const tilePixelY =
    ((1 -
      Math.log(
        Math.tan((centerLat * Math.PI) / 180) +
          1 / Math.cos((centerLat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
    Math.pow(2, zoom) *
    256;
  const offsetX = width / 2 - (tilePixelX - tileX * 256 + 256); // center within tiles
  const offsetY = height / 2 - (tilePixelY - tileY * 256 + 256);

  return (
    <div className={`bg-white rounded-lg border border-stone-200 overflow-hidden ${className}`}>
      <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Station Locations
        </h2>
        <span className="text-[10px] text-stone-400">
          {stations.length} stations mapped
        </span>
      </div>
      <div className="relative overflow-hidden" style={{ height: `${height}px` }}>
        {/* Tile layer */}
        <div
          className="absolute"
          style={{
            left: `${offsetX}px`,
            top: `${offsetY}px`,
          }}
        >
          {tiles.map((tile) => (
            <img
              key={`${tile.x}-${tile.y}`}
              src={tile.url}
              alt=""
              width={256}
              height={256}
              className="absolute opacity-60 saturate-[0.3] contrast-[1.1]"
              style={{
                left: `${(tile.x + 1) * 256}px`,
                top: `${(tile.y + 1) * 256}px`,
              }}
            />
          ))}
        </div>

        {/* Station markers */}
        {stations.map((station) => {
          const pos = latLngToOffset(
            station.lat,
            station.lng,
            centerLat,
            centerLng,
            zoom,
            width,
            height
          );
          const isHovered = hoveredStation === station.name;
          if (pos.x < -10 || pos.x > width + 10 || pos.y < -10 || pos.y > height + 10) {
            return null;
          }
          return (
            <div
              key={station.name}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 20 : 10,
              }}
              onMouseEnter={() => setHoveredStation(station.name)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              {/* Marker */}
              <div
                className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform cursor-pointer ${
                  isHovered ? "bg-amber-500 scale-150" : "bg-amber-400"
                }`}
              />
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded whitespace-nowrap shadow-lg">
                  {station.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
                </div>
              )}
            </div>
          );
        })}

        {/* Subtle overlay gradient at edges */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 via-transparent to-white/40" />
      </div>
      <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-100">
        <span className="text-[10px] text-stone-400">
          Map data © OpenStreetMap contributors · Station locations approximate
        </span>
      </div>
    </div>
  );
}
