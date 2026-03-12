interface DataPoint {
  label: string; // short date label e.g. "12 Mar"
  score: number; // 0-100
}

interface ScoreChartProps {
  data: DataPoint[];
  url: string;
}

export default function ScoreChart({ data, url }: ScoreChartProps) {
  if (data.length < 2) return null;

  const W = 480;
  const H = 100;
  const PAD = { top: 12, right: 12, bottom: 24, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const minScore = Math.max(0, Math.min(...data.map((d) => d.score)) - 10);
  const maxScore = Math.min(100, Math.max(...data.map((d) => d.score)) + 10);
  const range = maxScore - minScore || 1;

  const xStep = innerW / (data.length - 1);
  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (s: number) => PAD.top + innerH - ((s - minScore) / range) * innerH;

  const points = data.map((d, i) => `${toX(i)},${toY(d.score)}`).join(' ');
  const first = data[0].score;
  const last = data[data.length - 1].score;
  const trending = last > first ? 'up' : last < first ? 'down' : 'flat';
  const lineColor = trending === 'up' ? '#00E96A' : trending === 'down' ? '#FF4D4D' : '#8FA88F';

  // Area fill path
  const areaPath = [
    `M ${toX(0)},${toY(data[0].score)}`,
    ...data.slice(1).map((d, i) => `L ${toX(i + 1)},${toY(d.score)}`),
    `L ${toX(data.length - 1)},${PAD.top + innerH}`,
    `L ${toX(0)},${PAD.top + innerH}`,
    'Z',
  ].join(' ');

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="corner-mark border border-border bg-surface px-6 pt-5 pb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary">
          Compliance score
        </p>
        <span className="font-mono text-xs text-muted truncate max-w-[200px]">{displayUrl}</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 100 }}
        aria-label={`Compliance score trend for ${displayUrl}`}
        role="img"
      >
        {/* Grid lines */}
        {[0, 50, 100].map((tick) => {
          const y = toY(Math.max(minScore, Math.min(maxScore, tick)));
          return (
            <line
              key={tick}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={lineColor} fillOpacity="0.06" />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={toX(i)}
            cy={toY(d.score)}
            r="3"
            fill={lineColor}
          />
        ))}

        {/* X axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={toX(i)}
            y={H - 4}
            textAnchor="middle"
            fontSize="8"
            fill="var(--color-muted)"
            fontFamily="monospace"
          >
            {d.label}
          </text>
        ))}

        {/* Y axis labels */}
        {[minScore, maxScore].map((tick) => (
          <text
            key={tick}
            x={PAD.left - 4}
            y={toY(tick) + 3}
            textAnchor="end"
            fontSize="8"
            fill="var(--color-muted)"
            fontFamily="monospace"
          >
            {Math.round(tick)}
          </text>
        ))}
      </svg>

      <div className="flex items-center gap-2 mt-1">
        <span className="font-mono text-xs text-secondary">
          {trending === 'up' && <span className="text-green">+{last - first}pts</span>}
          {trending === 'down' && <span className="text-fail">{last - first}pts</span>}
          {trending === 'flat' && <span className="text-secondary">no change</span>}
          {' '}over {data.length} scans
        </span>
      </div>
    </div>
  );
}
