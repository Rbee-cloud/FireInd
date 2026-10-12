import React from 'react';
import { RiskShield } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RiskShieldBoxProps {
  shield: RiskShield;
  annualExpenses: number;
  onChange: (updated: Partial<RiskShield>) => void;
}

export const RiskShieldBox: React.FC<RiskShieldBoxProps> = ({
  shield,
  annualExpenses,
  onChange,
}) => {
  const emergencyAmount = annualExpenses; // 12-Month buffer = 1 full year living expenses
  const recommendedTermCover = annualExpenses * 20; // 20x annual living expenses standard

  const checkedCount = [
    shield.emergencyBuffer,
    shield.superTopup,
    shield.termInsurance,
    shield.highInterestDebt,
  ].filter(Boolean).length;

  const isFullyShielded = checkedCount === 4;

  return (
    <div className="bento-card p-6 flex flex-col justify-between bg-white text-[#1D1D1F]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isFullyShielded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">Risk Shield Checklist</h2>
              <p className="text-xs text-slate-500">Essential defenses before FIRE</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {checkedCount}/4 Protected
          </span>
        </div>

        <div className="space-y-3">
          {/* Item 1: 12-Month Emergency Buffer */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F5F7] hover:bg-slate-100/80 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={shield.emergencyBuffer}
              onChange={(e) => onChange({ emergencyBuffer: e.target.checked })}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>12-Month Emergency Buffer</span>
                <span className="text-emerald-700 font-bold tabular-numbers">
                  {formatCrLakh(emergencyAmount, 1)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target: {formatINR(emergencyAmount)} in Liquid Funds & Arbitrage
              </p>
            </div>
          </label>

          {/* Item 2: Private Super Top-up Insurance */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F5F7] hover:bg-slate-100/80 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={shield.superTopup}
              onChange={(e) => onChange({ superTopup: e.target.checked })}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>Private Super Top-up</span>
                <span className="text-blue-700 font-medium">₹50L - ₹1 Cr</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Deductible ₹5L–₹10L with non-corporate lifelong renewal
              </p>
            </div>
          </label>

          {/* Item 3: Term Insurance Active */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F5F7] hover:bg-slate-100/80 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={shield.termInsurance}
              onChange={(e) => onChange({ termInsurance: e.target.checked })}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>Active Term Insurance</span>
                <span className="text-blue-700 font-bold tabular-numbers">
                  {formatCrLakh(recommendedTermCover, 1)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pure protection cover (20× annual expenses) till retirement
              </p>
            </div>
          </label>

          {/* Item 4: High-Interest Debt Zeroed */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F5F7] hover:bg-slate-100/80 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={shield.highInterestDebt}
              onChange={(e) => onChange({ highInterestDebt: e.target.checked })}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>High-Interest Debt Zeroed</span>
                <span className="text-emerald-700 font-medium">₹0 Debt</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                No credit card revolvers, personal loans, or high-APR EMIs
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {isFullyShielded ? (
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All risk defenses verified
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-600 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Complete shields before early exit
          </span>
        )}
        <span className="text-slate-400 font-mono text-[11px]">BOX 06</span>
      </div>
    </div>
  );
};
