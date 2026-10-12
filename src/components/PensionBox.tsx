import React from 'react';
import { PensionPlan } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { Landmark, Sparkles, TrendingUp, Check } from 'lucide-react';

interface PensionBoxProps {
  pension: PensionPlan;
  currentAge: number;
  swr: number;
  onChange: (updated: Partial<PensionPlan>) => void;
}

export const PensionBox: React.FC<PensionBoxProps> = ({
  pension,
  currentAge,
  swr,
  onChange,
}) => {
  const annualPension = pension.monthlyPension * 12;
  const corpusReplaced = swr > 0 ? annualPension / (swr / 100) : 0;

  return (
    <div className="bento-card p-6 flex flex-col justify-between bg-white text-[#1D1D1F]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">Pension & Annuity</h2>
              <p className="text-xs text-slate-500">Guaranteed post-retirement inflows</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">INFLOW</span>
        </div>

        {/* Enable / Disable Switch */}
        <div className="bg-[#F5F5F7] p-3 rounded-2xl mb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-900 block">Include Pension / EPS</span>
            <span className="text-[10px] text-slate-500">Govt, PSU, EPS, or NPS annuity</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pension.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007AFF]"></div>
          </label>
        </div>

        {pension.enabled ? (
          <div className="space-y-3">
            {/* Monthly Pension Input */}
            <div className="bg-[#F5F5F7] p-3 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-500">
                  Monthly Pension Amount
                </label>
                <span className="text-xs font-bold text-purple-700">
                  {formatCrLakh(annualPension)} / yr
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  step={5000}
                  min={0}
                  value={pension.monthlyPension}
                  onChange={(e) =>
                    onChange({ monthlyPension: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full bg-transparent text-base font-semibold text-slate-900 tabular-numbers focus:outline-none"
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>{formatINR(pension.monthlyPension)} / month</span>
                <span>Annual: {formatINR(annualPension)}</span>
              </div>
            </div>

            {/* Start Age & Inflation Indexation */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#F5F5F7] p-3 rounded-2xl">
                <label className="text-[10px] font-medium text-slate-500 block mb-1">
                  Pension Start Age
                </label>
                <div className="flex items-baseline justify-between">
                  <input
                    type="number"
                    min={currentAge}
                    max={75}
                    value={pension.startAge}
                    onChange={(e) =>
                      onChange({
                        startAge: Math.max(currentAge, Math.min(75, Number(e.target.value) || currentAge)),
                      })
                    }
                    className="w-14 bg-transparent text-lg font-bold text-slate-900 tabular-numbers focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-medium">years</span>
                </div>
              </div>

              <div className="bg-[#F5F5F7] p-3 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-medium text-slate-500">
                    DA / Inflation Indexed
                  </label>
                  <input
                    type="checkbox"
                    checked={pension.inflationIndexed}
                    onChange={(e) => onChange({ inflationIndexed: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </div>
                <div className="text-[10px] text-purple-700 font-medium mt-1">
                  {pension.inflationIndexed ? `Indexed (+${pension.annualIndexationRate}%/yr)` : 'Fixed Annuity'}
                </div>
              </div>
            </div>

            {/* Equivalent Portfolio Replaced Badge */}
            <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100 text-xs">
              <div className="flex items-center justify-between text-purple-900 font-semibold mb-0.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Corpus Offset:
                </span>
                <span className="text-purple-800 font-bold tabular-numbers">
                  -{formatCrLakh(corpusReplaced, 2)}
                </span>
              </div>
              <p className="text-[10px] text-purple-700/80 leading-relaxed">
                Replaces {formatCrLakh(corpusReplaced, 1)} in stock/debt corpus otherwise required at {swr}% SWR.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#F5F5F7] rounded-2xl text-center text-xs text-slate-500">
            <p>No guaranteed pension modeled.</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Enable to account for Govt DA pension, EPS 95, or NPS annuities.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Guaranteed Lifelong Inflow</span>
        <span className="text-purple-700 font-medium">Reduces Target Corpus</span>
      </div>
    </div>
  );
};
