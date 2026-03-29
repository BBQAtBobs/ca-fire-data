/**
 * Stylized California locator graphic.
 *
 * Renders a simplified California outline with a pulsing dot
 * at the department's approximate location. The outline is a
 * hand-simplified SVG path — not cartographically precise,
 * but geographically useful for orientation.
 *
 * Coordinate mapping: lat/lng → SVG x/y within a bounding box
 * covering roughly California's extent.
 */

// California bounding box (approximate)
const CA_BOUNDS = {
  minLat: 32.5,
  maxLat: 42.0,
  minLng: -124.5,
  maxLng: -114.0,
};

const SVG_WIDTH = 160;
const SVG_HEIGHT = 240;

function geoToSvg(
  lat: number,
  lng: number
): { x: number; y: number } {
  const x =
    ((lng - CA_BOUNDS.minLng) / (CA_BOUNDS.maxLng - CA_BOUNDS.minLng)) *
    SVG_WIDTH;
  const y =
    ((CA_BOUNDS.maxLat - lat) / (CA_BOUNDS.maxLat - CA_BOUNDS.minLat)) *
    SVG_HEIGHT;
  return { x, y };
}

export function CaliforniaLocator({
  lat,
  lng,
  label,
  className = "",
}: {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}) {
  const point = geoToSvg(lat, lng);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        aria-label={`Map showing ${label} location in California`}
      >
        <defs>
          {/* Subtle gradient fill for the state */}
          <linearGradient id="ca-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7e5e4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d6d3d1" stopOpacity="0.4" />
          </linearGradient>
          {/* Pulse animation */}
          <radialGradient id="pulse-grad">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* California outline — simplified path */}
        <path
          d="M 30 8 L 28 12 L 24 18 L 22 24 L 20 32 L 18 38
             L 16 42 L 14 48 L 14 54 L 16 58 L 18 62 L 20 68
             L 22 74 L 24 80 L 26 86 L 28 90 L 30 96 L 30 102
             L 28 108 L 26 112 L 24 118 L 22 124 L 24 130
             L 28 136 L 32 140 L 36 144 L 40 148 L 42 152
             L 44 156 L 48 160 L 52 164 L 56 168 L 60 172
             L 64 176 L 68 178 L 72 180 L 76 184 L 80 188
             L 84 190 L 88 194 L 92 198 L 96 202 L 100 206
             L 104 210 L 108 214 L 112 218 L 116 222 L 120 224
             L 124 222 L 128 218 L 130 214 L 128 210 L 124 206
             L 120 202 L 116 198 L 112 194 L 108 190 L 106 186
             L 104 180 L 102 174 L 100 168 L 98 162 L 96 156
             L 94 148 L 92 140 L 90 132 L 88 124 L 86 116
             L 84 108 L 84 100 L 86 92 L 88 84 L 90 76
             L 92 68 L 94 60 L 96 52 L 98 44 L 100 38
             L 100 32 L 98 26 L 94 22 L 88 18 L 82 14
             L 76 12 L 70 10 L 64 8 L 58 8 L 52 8
             L 46 8 L 40 8 L 36 8 Z"
          fill="url(#ca-fill)"
          stroke="#a8a29e"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Bay Area inset hint — subtle dotted box */}
        <rect
          x="18"
          y="80"
          width="28"
          height="22"
          fill="none"
          stroke="#a8a29e"
          strokeWidth="0.4"
          strokeDasharray="2 2"
          rx="2"
          opacity="0.4"
        />

        {/* Pulsing ring */}
        <circle
          cx={point.x}
          cy={point.y}
          r="12"
          fill="url(#pulse-grad)"
          className="animate-ping"
          style={{ animationDuration: "3s" }}
        />

        {/* Location dot */}
        <circle
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#f59e0b"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Small inner dot */}
        <circle
          cx={point.x}
          cy={point.y}
          r="1.5"
          fill="#ffffff"
        />
      </svg>

      {/* Label below */}
      <div className="text-center mt-2">
        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
          {label}
        </span>
      </div>
    </div>
  );
}
