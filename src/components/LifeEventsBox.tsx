import React from 'react';
import { LifeEvents } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { HeartHandshake, Car, ShieldPlus, Sparkles } from 'lucide-react';

interface LifeEventsBoxProps {
  events: LifeEvents;
  currentAge: number;
  onChange: (updated: Partial<LifeEvents>) => void;
}

export const LifeEventsBox: React.FC<LifeEventsBoxProps> = ({ events, currentAge, onChange }) => {
  return (
    <div className="bento-card p-6 flex flex-col justify-between bg-white text-[#1D1D1F]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">Life Event Outlays</h2>
              <p className="text-xs text-slate-500">Major Indian family lump sums & cycles</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">BOX 04</span>
        </div>

        <div className="space-y-4">
          {/* Child 1 Marriage */}
          <div className="bg-[#F5F5F7] p-3.5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={events.child1Enabled}
                  onChange={(e) => onChange({ child1Enabled: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                Child 1 Marriage Outlay
              </label>
              <span className="text-xs font-bold text-slate-700">
                {events.child1Enabled ? formatCrLakh(events.child1MarriageCost) : 'Disabled'}
              </span>
            </div>

            {events.child1Enabled && (
              <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Budget Today (₹)</span>
                  <input
                    type="number"
                    step={100000}
                    value={events.child1MarriageCost}
                    onChange={(e) =>
                      onChange({ child1MarriageCost: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full bg-white px-2 py-1 rounded-lg text-xs font-semibold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formatINR(events.child1MarriageCost)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">At Your Age</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={currentAge}
                      max={80}
                      value={events.child1MarriageAge}
                      onChange={(e) =>
                        onChange({ child1MarriageAge: Math.max(currentAge, Number(e.target.value) || currentAge) })
                      }
                      className="w-full bg-white px-2 py-1 rounded-lg text-xs font-semibold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">y</span>
                  </div>
                  <span className="text-[10px] text-blue-600 mt-0.5 block">
                    in {Math.max(0, events.child1MarriageAge - currentAge)} years
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Child 2 Marriage */}
          <div className="bg-[#F5F5F7] p-3.5 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={events.child2Enabled}
                  onChange={(e) => onChange({ child2Enabled: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                Child 2 Marriage Outlay
              </label>
              <span className="text-xs font-bold text-slate-700">
                {events.child2Enabled ? formatCrLakh(events.child2MarriageCost) : 'Disabled'}
              </span>
            </div>

            {events.child2Enabled && (
              <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">Budget Today (₹)</span>
                  <input
                    type="number"
                    step={100000}
                    value={events.child2MarriageCost}
                    onChange={(e) =>
                      onChange({ child2MarriageCost: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full bg-white px-2 py-1 rounded-lg text-xs font-semibold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formatINR(events.child2MarriageCost)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5">At Your Age</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={currentAge}
                      max={85}
                      value={events.child2MarriageAge}
                      onChange={(e) =>
                        onChange({ child2MarriageAge: Math.max(currentAge, Number(e.target.value) || currentAge) })
                      }
                      className="w-full bg-white px-2 py-1 rounded-lg text-xs font-semibold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">y</span>
                  </div>
                  <span className="text-[10px] text-blue-600 mt-0.5 block">
                    in {Math.max(0, events.child2MarriageAge - currentAge)} years
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* New Car Upgrade (Fixed every 7 years) */}
          <div className="bg-[#F5F5F7] p-3.5 rounded-2xl">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-600" /> New Car Replacement
              </label>
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Every 7 Years
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Cost of vehicle today (compounds with lifestyle inflation at each cycle)
            </p>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-slate-400 font-medium shrink-0">₹</span>
              <input
                type="number"
                step={100000}
                value={events.carCost}
                onChange={(e) => onChange({ carCost: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full bg-white px-2.5 py-1.5 rounded-xl text-sm font-semibold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none min-w-0"
              />
              <span className="text-xs text-slate-700 font-semibold whitespace-nowrap shrink-0">
                {formatCrLakh(events.carCost)}
              </span>
            </div>
          </div>

          {/* Health Insurance Premium */}
          <div className="bg-[#F5F5F7] p-3.5 rounded-2xl">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldPlus className="w-3.5 h-3.5 text-red-500" /> Annual Health Insurance
              </label>
              <span className="text-xs font-semibold text-slate-700">
                {formatINR(events.annualHealthInsurance)} / yr
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Base comprehensive medical policy (grows at 12% medical inflation)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">₹</span>
              <input
                type="number"
                step={5000}
                value={events.annualHealthInsurance}
                onChange={(e) =>
                  onChange({ annualHealthInsurance: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-white px-2.5 py-1.5 rounded-xl text-sm font-semibold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Recurring triggers</span>
        <span className="flex items-center gap-1 text-slate-600">
          <Sparkles className="w-3 h-3 text-amber-500" /> Inflation-adjusted outlays
        </span>
      </div>
    </div>
  );
};
