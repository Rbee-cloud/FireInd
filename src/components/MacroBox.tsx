import React from 'react';
import { MacroAssumptions, RiskProfile } from '../types/fire';
import { RISK_PRESETS } from '../utils/engine';
import { SlidersHorizontal, ShieldAlert, Percent, Activity } from 'lucide-react';

interface MacroBoxProps {
  macro: MacroAssumptions;
  onChange: (updated: Partial<MacroAssumptions>) => void;
}

export const MacroBox: React.FC<MacroBoxProps> = ({ macro, onChange }) => {
  const handleProfileSelect = (profile: RiskProfile) => {
    const preset = RISK_PRESETS[profile];
    onChange({
      riskProfile: profile,
      safeWithdrawalRate: preset.safeWithdrawalRate,
      lifestyleInflation: preset.lifestyleInflation,
      medicalInflation: preset.medicalInflation,
      portfolioReturn: preset.portfolioReturn,
      ltcgTaxRate: preset.ltcgTaxRate,
    });
  };

  return (
    <div className="bento-card p-6 flex flex-col justify-between bg-white text-[#1D1D1F]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">Macro Assumptions</h2>
              <p className="text-xs text-slate-500">Economic & portfolio parameters</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">BOX 02</span>
        </div>

        {/* Risk Profile Segmented Control */}
        <div className="mb-4">
          <label className="text-[11px] font-medium text-slate-500 block mb-1.5">
            Risk Profile Model
          </label>
          <div className="flex p-1 bg-[#F5F5F7] rounded-xl gap-1">
            {(['conservative', 'moderate', 'aggressive'] as RiskProfile[]).map((mode) => {
              const active = macro.riskProfile === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleProfileSelect(mode)}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all capitalize whitespace-nowrap ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3.5">
          {/* SWR */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <Percent className="w-3 h-3 text-slate-400 shrink-0" /> Safe Withdrawal Rate (SWR)
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">India standard 3.0%–3.3%</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                step={0.1}
                min={2.0}
                max={6.0}
                value={macro.safeWithdrawalRate}
                onChange={(e) =>
                  onChange({ safeWithdrawalRate: Number(e.target.value) || 3.2 })
                }
                className="w-14 text-right bg-white px-2 py-1 rounded-lg text-sm font-bold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 font-medium">%</span>
            </div>
          </div>

          {/* Lifestyle Inflation */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <Activity className="w-3 h-3 text-slate-400 shrink-0" /> Lifestyle Inflation
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Long-term urban CPI index</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                step={0.1}
                min={3.0}
                max={12.0}
                value={macro.lifestyleInflation}
                onChange={(e) =>
                  onChange({ lifestyleInflation: Number(e.target.value) || 6.5 })
                }
                className="w-14 text-right bg-white px-2 py-1 rounded-lg text-sm font-bold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 font-medium">%</span>
            </div>
          </div>

          {/* Medical Inflation */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <ShieldAlert className="w-3 h-3 text-red-500 shrink-0" /> Medical Inflation
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Healthcare premium surge</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                step={0.5}
                min={8.0}
                max={20.0}
                value={macro.medicalInflation}
                onChange={(e) =>
                  onChange({ medicalInflation: Number(e.target.value) || 12.0 })
                }
                className="w-14 text-right bg-white px-2 py-1 rounded-lg text-sm font-bold text-red-700 tabular-numbers border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <span className="text-xs text-slate-600 font-medium">%</span>
            </div>
          </div>

          {/* Expected Portfolio Return */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <Percent className="w-3 h-3 text-emerald-600 shrink-0" /> Expected Return (CAGR)
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Blended equity/debt post-tax</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                step={0.1}
                min={4.0}
                max={15.0}
                value={macro.portfolioReturn}
                onChange={(e) =>
                  onChange({ portfolioReturn: Number(e.target.value) || 7.5 })
                }
                className="w-14 text-right bg-white px-2 py-1 rounded-lg text-sm font-bold text-emerald-800 tabular-numbers border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600 font-medium">%</span>
            </div>
          </div>

          {/* LTCG Tax Rate */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <Percent className="w-3 h-3 text-slate-400 shrink-0" /> LTCG Tax Drag
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Finance Act 2024 (12.5% rate)</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                step={0.5}
                min={0}
                max={25.0}
                value={macro.ltcgTaxRate}
                onChange={(e) =>
                  onChange({ ltcgTaxRate: Number(e.target.value) || 12.5 })
                }
                className="w-14 text-right bg-white px-2 py-1 rounded-lg text-sm font-bold text-slate-900 tabular-numbers border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 font-medium">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
