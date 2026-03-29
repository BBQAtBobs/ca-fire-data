/**
 * Signature California locator graphic.
 *
 * A large, warm, stylized state silhouette with a prominent
 * location marker. Designed as the visual anchor of department
 * profile pages — immediately orients the user geographically
 * and adds identity and polish to every profile.
 *
 * Uses simplified California boundary coordinates with
 * Mercator projection. Cartographically approximate.
 */

// California bounding box
const CA = {
  minLat: 32.53,
  maxLat: 42.01,
  minLng: -124.48,
  maxLng: -114.13,
};

// SVG viewBox dimensions — tall to match CA's shape
const W = 220;
const H = 310;
const PAD = 16;

function geo(lat: number, lng: number): { x: number; y: number } {
  const x =
    PAD + ((lng - CA.minLng) / (CA.maxLng - CA.minLng)) * (W - PAD * 2);
  const y =
    PAD + ((CA.maxLat - lat) / (CA.maxLat - CA.minLat)) * (H - PAD * 2);
  return { x, y };
}

// Simplified California outline — key coastal and border points
const CA_OUTLINE_POINTS: [number, number][] = [
  [42.0, -124.2],
  [41.99, -123.5],
  [41.99, -122.5],
  [41.99, -121.5],
  [41.99, -120.0],
  [39.0, -120.0],
  [38.5, -120.0],
  [38.0, -119.5],
  [37.5, -118.5],
  [36.5, -117.8],
  [36.0, -117.0],
  [35.5, -116.0],
  [35.0, -115.5],
  [34.5, -115.0],
  [34.0, -114.6],
  [33.5, -114.5],
  [33.0, -114.6],
  [32.72, -114.72],
  [32.54, -117.12],
  [32.8, -117.25],
  [33.0, -117.3],
  [33.2, -117.4],
  [33.4, -117.6],
  [33.7, -118.0],
  [33.75, -118.3],
  [33.9, -118.45],
  [34.0, -118.5],
  [34.05, -118.8],
  [34.15, -119.2],
  [34.3, -119.3],
  [34.4, -119.7],
  [34.45, -120.0],
  [34.5, -120.5],
  [34.9, -120.6],
  [35.2, -120.85],
  [35.4, -120.9],
  [35.65, -121.15],
  [36.0, -121.5],
  [36.3, -121.8],
  [36.6, -121.9],
  [36.8, -121.8],
  [37.0, -122.1],
  [37.2, -122.3],
  [37.5, -122.4],
  [37.6, -122.5],
  [37.75, -122.5],
  [37.8, -122.48],
  [37.85, -122.5],
  [38.0, -122.7],
  [38.3, -123.0],
  [38.5, -123.1],
  [38.8, -123.4],
  [39.0, -123.6],
  [39.3, -123.7],
  [39.8, -123.8],
  [40.0, -124.0],
  [40.3, -124.3],
  [40.8, -124.2],
  [41.0, -124.1],
  [41.5, -124.1],
  [41.75, -124.2],
  [42.0, -124.2],
];

const outlinePath =
  CA_OUTLINE_POINTS.map((p, i) => {
    const { x, y } = geo(p[0], p[1]);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";

export function CaliforniaLocator({
  lat,
  lng,
  label,
  className = "",
  size = "default",
}: {
  lat: number;
  lng: number;
  label: string;
  className?: string;
  size?: "default" | "large";
}) {
  const point = geo(lat, lng);
  const id = `loc-${label.replace(/\s/g, "")}`;

  // Determine label placement — offset to avoid going off-edge
  const labelRight = point.x < W * 0.6;
  const labelX = labelRight ? point.x + 14 : point.x - 14;
  const textAnchor = labelRight ? "start" : "end";

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`w-full h-auto ${size === "large" ? "max-w-[280px]" : "max-w-[200px]"}`}
        role="img"
        aria-label={`Map showing ${label} location in California`}
      >
        <defs>
          {/* Warm gradient fill for the state */}
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#fde68a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0.3" />
          </linearGradient>

          {/* Warm glow around location */}
          <radialGradient id={`${id}-glow`}>
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Subtle shadow for depth */}
          <filter id={`${id}-shadow`}>
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="2"
              floodColor="#78716c"
              floodOpacity="0.12"
            />
          </filter>

          {/* Pulse animation for the marker ring */}
          <style>{`
            @keyframes ${id}-pulse {
              0%, 100% { opacity: 0.4; r: 12; }
              50% { opacity: 0.15; r: 18; }
            }
          `}</style>
        </defs>

        {/* State outline — warm amber fill */}
        <path
          d={outlinePath}
          fill={`url(#${id}-fill)`}
          stroke="#d6d3d1"
          strokeWidth="1"
          strokeLinejoin="round"
          filter={`url(#${id}-shadow)`}
        />

        {/* Interior detail lines — subtle topographic feel */}
        <path
          d={outlinePath}
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="0.3"
          strokeDasharray="4 6"
          strokeLinejoin="round"
          transform="translate(1.5, 1.5) scale(0.985)"
        />

        {/* Warm glow at location */}
        <circle
          cx={point.x}
          cy={point.y}
          r="28"
          fill={`url(#${id}-glow)`}
        />

        {/* Animated pulse ring */}
        <circle
          cx={point.x}
          cy={point.y}
          r="12"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1"
          opacity="0.4"
          style={{ animation: `${id}-pulse 3s ease-in-out infinite` }}
        />

        {/* Outer marker ring */}
        <circle
          cx={point.x}
          cy={point.y}
          r="8"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Inner marker dot */}
        <circle
          cx={point.x}
          cy={point.y}
          r="4.5"
          fill="#f59e0b"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Location label */}
        <text
          x={labelX}
          y={point.y + 1}
          textAnchor={textAnchor}
          className="fill-stone-500"
          fontSize="9"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.03em"
        >
          {label}
        </text>

        {/* Thin connector line from dot to label */}
        <line
          x1={point.x + (labelRight ? 7 : -7)}
          y1={point.y}
          x2={labelRight ? labelX - 3 : labelX + 3}
          y2={point.y}
          stroke="#a8a29e"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
