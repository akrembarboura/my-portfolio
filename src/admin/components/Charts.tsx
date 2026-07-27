import type { ChartPoint } from '../types';

interface BarChartProps {
  data: ChartPoint[];
  height?: number;
}

interface LineChartProps {
  data: ChartPoint[];
  height?: number;
}

export function BarChart({ data, height = 220 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
      <div className="flex h-full items-end gap-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gold-500 transition-all hover:bg-gold-600"
                style={{ height: `${barHeight}%` }}
                title={`${item.label}: ${item.value}`}
              />
              <span className="truncate text-xs text-stone-500 dark:text-stone-400">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LineChart({ data, height = 220 }: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const width = 100;
  const plotHeight = height - 20;

  const points = data.map((item, index) => {
    const x = data.length > 1 ? (index / (data.length - 1)) * width : width / 2;
    const y = plotHeight - (item.value / maxValue) * plotHeight;
    return { x, y, label: item.label };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,${plotHeight} ${polylinePoints} ${width},${plotHeight}`;

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#lineGradient)" />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill="#f59e0b" />
        ))}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - 4}
            textAnchor="middle"
            fontSize="6"
            className="fill-stone-500 dark:fill-stone-400"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
