import React from 'react';
import { FireProfile } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { User, Calendar, Wallet, TrendingUp, PiggyBank } from 'lucide-react';

interface ProfileBoxProps {
  profile: FireProfile;
  onChange: (updated: Partial<FireProfile>) => void;
}

export const ProfileBox: React.FC<ProfileBoxProps> = ({ profile, onChange }) => {
  return (
    <div className="bento-card p-5 sm:p-6 flex flex-col justify-between bg-white text-[#1D1D1F] overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold tracking-tight text-slate-900 truncate">The Profile</h2>
              <p className="text-xs text-slate-500 truncate">Personal accumulation base</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono shrink-0">BOX 01</span>
        </div>

        <div className="space-y-3.5">
          {/* Ages Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#F5F5F7] p-3 rounded-2xl min-w-0">
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1 truncate">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" /> Current Age
              </label>
              <div className="flex items-baseline justify-between gap-1">
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={profile.currentAge}
                  onChange={(e) =>
                    onChange({ currentAge: Math.max(18, Math.min(80, Number(e.target.value) || 18)) })
                  }
                  className="w-full bg-transparent text-xl font-bold tracking-tight text-slate-900 tabular-numbers focus:outline-none"
                />
                <span className="text-xs text-slate-500 font-medium shrink-0">yrs</span>
              </div>
            </div>

            <div className="bg-[#F5F5F7] p-3 rounded-2xl min-w-0">
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1 truncate">
                <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" /> Target FIRE Age
              </label>
              <div className="flex items-baseline justify-between gap-1">
                <input
                  type="number"
                  min={profile.currentAge}
                  max={90}
                  value={profile.targetRetirementAge}
                  onChange={(e) =>
                    onChange({
                      targetRetirementAge: Math.max(
                        profile.currentAge,
                        Math.min(90, Number(e.target.value) || profile.currentAge)
                      ),
                    })
                  }
                  className="w-full bg-transparent text-xl font-bold tracking-tight text-slate-900 tabular-numbers focus:outline-none"
                />
                <span className="text-xs text-blue-600 font-semibold shrink-0">
                  +{Math.max(0, profile.targetRetirementAge - profile.currentAge)}y
                </span>
              </div>
            </div>
          </div>

          {/* Current Annual Expenses */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <Wallet className="w-3 h-3 text-slate-400 shrink-0" /> Annual Living Expenses
              </label>
              <span className="text-xs font-semibold text-slate-800 shrink-0 tabular-numbers">
                {formatCrLakh(profile.annualExpenses)} / yr
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-400 font-medium">₹</span>
              <input
                type="number"
                step={50000}
                value={profile.annualExpenses}
                onChange={(e) => onChange({ annualExpenses: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full bg-transparent text-base font-semibold text-slate-900 tabular-numbers focus:outline-none min-w-0"
              />
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
              <span>≈ {formatINR(Math.round(profile.annualExpenses / 12))}/mo</span>
              <span className="tabular-numbers">{formatINR(profile.annualExpenses)}</span>
            </div>
          </div>

          {/* Current Investable Net Worth */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <PiggyBank className="w-3 h-3 text-slate-400 shrink-0" /> Current Investable Net Worth
              </label>
              <span className="text-xs font-semibold text-emerald-700 shrink-0 tabular-numbers">
                {formatCrLakh(profile.currentNetWorth)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-400 font-medium">₹</span>
              <input
                type="number"
                step={100000}
                value={profile.currentNetWorth}
                onChange={(e) => onChange({ currentNetWorth: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full bg-transparent text-base font-semibold text-slate-900 tabular-numbers focus:outline-none min-w-0"
              />
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
              <span>Equity, Debt, MFs & PF</span>
              <span className="tabular-numbers">{formatINR(profile.currentNetWorth)}</span>
            </div>
          </div>

          {/* Annual Savings Contribution */}
          <div className="bg-[#F5F5F7] p-3 rounded-2xl min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1 truncate">
                <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" /> Annual Savings (SIPs)
              </label>
              <span className="text-xs font-semibold text-blue-700 shrink-0 tabular-numbers">
                {formatCrLakh(profile.annualSavings)} / yr
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-400 font-medium">₹</span>
              <input
                type="number"
                step={50000}
                value={profile.annualSavings}
                onChange={(e) => onChange({ annualSavings: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full bg-transparent text-base font-semibold text-slate-900 tabular-numbers focus:outline-none min-w-0"
              />
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
              <span>≈ {formatINR(Math.round(profile.annualSavings / 12))}/mo added</span>
              <span className="tabular-numbers">{formatINR(profile.annualSavings)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
