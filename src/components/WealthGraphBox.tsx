import React, { useState, useRef, useMemo } from 'react';
import { CashflowRow, FireSummary } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { LineChart, Sparkles, TrendingUp, Car, HeartHandshake } from 'lucide-react';

interface WealthGraphBoxProps {
  rows: CashflowRow[];
  summary: FireSummary;
  retirementAge: number;
}

export const WealthGraphBox: React.FC<WealthGraphBoxProps> = ({
  rows,
  summary,
  retirementAge,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG dimensions
  const width = 800;
  const height = 340;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max and Min values for scaling
  const maxBalance = useMemo(() => {
    const max = Math.max(...rows.map((r) => r.closingBalance), 10_000_000);
    return Math.ceil(max * 1.1); // 10% headroom
  }, [rows]);

  const minAge = rows[0]?.age ?? 30;
  const maxAge = rows[rows.length - 1]?.age ?? 100;
  const ageSpan = Math.max(1, maxAge - minAge);

  // Point projection
  const getX = (age: number) => padding.left + ((age - minAge) / ageSpan) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - (Math.max(0, val) / maxBalance) * chartHeight;

  // Generate SVG path points
  const points = useMemo(() => {
    return rows.map((r) => ({
      x: getX(r.age),
      y: getY(r.closingBalance),
      row: r,
    }));
  }, [rows, maxBalance, ageSpan]);

  // Construct smooth bezier path
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' };

    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      line += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const baselineY = padding.top + chartHeight;
    const area = `${line} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

    return { linePath: line, areaPath: area };
  }, [points]);

  // Handle Mouse Hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * width;

    // Find nearest point
    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoveredIndex(closestIdx);
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[Math.min(15, points.length - 1)];

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    val: maxBalance * pct,
    y: padding.top + chartHeight - pct * chartHeight,
  }));

  // X-axis ticks (every 10 years)
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let a = Math.ceil(minAge / 5) * 5; a <= maxAge; a += 10) {
      ticks.push(a);
    }
    return ticks;
  }, [minAge, maxAge]);

  const retirementX = getX(retirementAge);

  return (
    <div className="bento-card p-6 flex flex-col justify-between bg-white text-[#1D1D1F]">
      <div>
        {/* Header & Stats bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <LineChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">The Wealth Trajectory</h2>
              <p className="text-xs text-slate-500">
                Portfolio accumulation, retirement inflection & milestone stress-test
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> FIRE Target: Age {retirementAge}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Peak: {formatCrLakh(summary.peakNetWorth, 1)} (Age {summary.peakNetWorthAge})
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-blue-600 rounded" />
            <span>Net Portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-600 border border-white" />
            <span>Retirement Point</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-600 border border-white" />
            <span>Pension / Weddings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500 border border-white" />
            <span>Car / Loan Payoff</span>
          </div>
        </div>

        {/* The SVG Canvas */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[21/9] min-h-[260px] max-h-[360px] select-none"
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full cursor-crosshair overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007AFF" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#007AFF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#007AFF" stopOpacity="0.00" />
              </linearGradient>

              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#007AFF" />
                <stop offset="70%" stopColor="#0062D2" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={tick.y}
                  x2={width - padding.right}
                  y2={tick.y}
                  stroke="#E5E5EA"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono tabular-numbers"
                >
                  {formatCrLakh(tick.val, 1)}
                </text>
              </g>
            ))}

            {/* X-axis tick labels */}
            {xTicks.map((age, i) => {
              const xPos = getX(age);
              return (
                <g key={i}>
                  <line
                    x1={xPos}
                    y1={padding.top + chartHeight}
                    x2={xPos}
                    y2={padding.top + chartHeight + 4}
                    stroke="#D1D1D6"
                    strokeWidth="1"
                  />
                  <text
                    x={xPos}
                    y={padding.top + chartHeight + 16}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-medium"
                  >
                    Age {age}
                  </text>
                </g>
              );
            })}

            {/* Retirement Age Vertical Marker Line */}
            {retirementX >= padding.left && retirementX <= width - padding.right && (
              <g>
                <line
                  x1={retirementX}
                  y1={padding.top}
                  x2={retirementX}
                  y2={padding.top + chartHeight}
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={retirementX}
                  y={padding.top - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-emerald-600 font-bold"
                >
                  Retire @ {retirementAge}
                </text>
              </g>
            )}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Line stroke */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Milestone markers on curve */}
            {points.map((p, idx) => {
              const isRetirement = p.row.age === retirementAge;
              const hasCar = p.row.carCost > 0;
              const hasMarriage = p.row.marriage1Cost > 0 || p.row.marriage2Cost > 0;

              if (!isRetirement && !hasCar && !hasMarriage) return null;

              let fillColor = '#007AFF';
              let radius = 4;
              if (hasMarriage) {
                fillColor = '#9333EA'; // Purple for marriage
                radius = 5;
              } else if (hasCar) {
                fillColor = '#F59E0B'; // Amber for car
                radius = 4;
              } else if (isRetirement) {
                fillColor = '#10B981'; // Emerald for retirement
                radius = 5.5;
              }

              return (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={radius + 2}
                    fill="white"
                    stroke={fillColor}
                    strokeWidth="2"
                    filter="url(#shadow)"
                  />
                  <circle cx={p.x} cy={p.y} r={radius - 1} fill={fillColor} />
                </g>
              );
            })}

            {/* Hover Crosshair & Tooltip */}
            {activePoint && (
              <g>
                {/* Vertical Cursor */}
                <line
                  x1={activePoint.x}
                  y1={padding.top}
                  x2={activePoint.x}
                  y2={padding.top + chartHeight}
                  stroke="#1D1D1F"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.5"
                />
                {/* Highlight Point */}
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="6"
                  fill="#007AFF"
                  stroke="white"
                  strokeWidth="2.5"
                  filter="url(#shadow)"
                />
              </g>
            )}
          </svg>

          {/* Interactive HTML Floating Tooltip Box */}
          {activePoint && (
            <div
              className="absolute pointer-events-none transition-all duration-75 bg-[#1D1D1F]/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl text-xs z-20 border border-white/10"
              style={{
                left: `${Math.min(Math.max((activePoint.x / width) * 100, 15), 85)}%`,
                top: `${Math.max(10, Math.min((activePoint.y / height) * 100 - 30, 70))}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-3 font-semibold pb-1 mb-1 border-b border-white/15">
                <span className="text-white">
                  Age {activePoint.row.age} ({activePoint.row.calendarYear})
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    activePoint.row.isRetired ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {activePoint.row.isRetired ? 'Retired' : 'Working & Saving'}
                </span>
              </div>
              <div className="space-y-1 text-[11px] tabular-numbers">
                <div className="flex justify-between gap-4">
                  <span className="text-white/70">Portfolio Value:</span>
                  <span className="font-bold text-white">
                    {formatCrLakh(activePoint.row.closingBalance)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/70">Total Outflow:</span>
                  <span className="text-white/90">
                    {formatCrLakh(activePoint.row.totalOutflow)}
                  </span>
                </div>
                {activePoint.row.pensionIncome > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-purple-300">Pension Inflow:</span>
                    <span className="text-purple-300 font-bold">
                      +{formatCrLakh(activePoint.row.pensionIncome)}
                    </span>
                  </div>
                )}
                {activePoint.row.loanEmiOutflow > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-amber-300">Loan EMI:</span>
                    <span className="text-amber-300">
                      -{formatCrLakh(activePoint.row.loanEmiOutflow)}
                    </span>
                  </div>
                )}
                {activePoint.row.annualSavings > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-white/70">Savings Added:</span>
                    <span className="text-emerald-400">
                      +{formatCrLakh(activePoint.row.annualSavings)}
                    </span>
                  </div>
                )}
                {activePoint.row.milestones.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-white/15 text-amber-300 font-medium text-[10px]">
                    🎯 {activePoint.row.milestones.join(' + ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Interactive timeline: hover over any year to inspect cashflow & stress test.
        </span>
        <span className="font-mono text-xs text-slate-400">
          Engine runs Age {minAge} → {maxAge}
        </span>
      </div>
    </div>
  );
};
