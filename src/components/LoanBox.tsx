import React from 'react';
import { LoanPlan } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { CreditCard, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';

interface LoanBoxProps {
  loan: LoanPlan;
  currentAge: number;
  targetRetirementAge: number;
  onChange: (updated: Partial<LoanPlan>) => void;
}

export const LoanBox: React.FC<LoanBoxProps> = ({
  loan,
  currentAge,
  targetRetirementAge,
  onChange,
}) => {
  const loanEndAge = currentAge + loan.remainingYears;
  const overlapsRetirement = loan.enabled && loanEndAge > targetRetirementAge;
  const yearsAfterRetirement = Math.max(0, loanEndAge - targetRetirementAge);
  const remainingLiabilityAtRetire = yearsAfterRetirement * loan.annualEmi;

  return (
    <div className="bento-card p-6 flex flex-col justify-between bg-white text-[#1D1D1F]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">Loans & Debt Payoff</h2>
              <p className="text-xs text-slate-500">Liabilities required before early retirement</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">LIABILITY</span>
        </div>

        {/* Enable / Disable Switch */}
        <div className="bg-[#F5F5F7] p-3 rounded-2xl mb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-900 block">Outstanding Loan / EMI</span>
            <span className="text-[10px] text-slate-500">Home loan, vehicle loan, or debt</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={loan.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007AFF]"></div>
          </label>
        </div>

        {loan.enabled ? (
          <div className="space-y-3">
            {/* Outstanding Principal */}
            <div className="bg-[#F5F5F7] p-3 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-500">
                  Total Outstanding Principal
                </label>
                <span className="text-xs font-bold text-amber-700">
                  {formatCrLakh(loan.totalOutstandingPrincipal)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  step={100000}
                  min={0}
                  value={loan.totalOutstandingPrincipal}
                  onChange={(e) =>
                    onChange({
                      totalOutstandingPrincipal: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-transparent text-base font-semibold text-slate-900 tabular-numbers focus:outline-none"
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>Principal to clear</span>
                <span>{formatINR(loan.totalOutstandingPrincipal)}</span>
              </div>
            </div>

            {/* Annual EMI & Remaining Years */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#F5F5F7] p-3 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-medium text-slate-500">
                    Annual EMI Outflow
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    step={25000}
                    min={0}
                    value={loan.annualEmi}
                    onChange={(e) =>
                      onChange({ annualEmi: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full bg-transparent text-sm font-bold text-slate-900 tabular-numbers focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ≈ {formatINR(Math.round(loan.annualEmi / 12))}/mo
                </span>
              </div>

              <div className="bg-[#F5F5F7] p-3 rounded-2xl">
                <label className="text-[10px] font-medium text-slate-500 block mb-1">
                  Remaining Tenure
                </label>
                <div className="flex items-baseline justify-between">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={loan.remainingYears}
                    onChange={(e) =>
                      onChange({ remainingYears: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-14 bg-transparent text-lg font-bold text-slate-900 tabular-numbers focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-medium">years</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Ends at Age {loanEndAge}
                </span>
              </div>
            </div>

            {/* Status regarding Retirement Age */}
            {overlapsRetirement ? (
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs">
                <div className="flex items-center justify-between text-amber-900 font-semibold mb-0.5">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Retirement Debt Drag:
                  </span>
                  <span className="text-amber-800 font-bold tabular-numbers">
                    +{formatCrLakh(remainingLiabilityAtRetire, 1)}
                  </span>
                </div>
                <p className="text-[10px] text-amber-800/80 leading-relaxed">
                  Loan extends {yearsAfterRetirement} years past retirement age {targetRetirementAge}. This liability is automatically added to your required FIRE corpus so you are debt-free.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-900">
                    Debt-Free Before Retirement
                  </div>
                  <p className="text-[10px] text-emerald-700/80 leading-relaxed mt-0.5">
                    Loan finishes at Age {loanEndAge}, well before your retirement at Age {targetRetirementAge}. Zero ongoing debt in retirement.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-[#F5F5F7] rounded-2xl text-center text-xs text-slate-500">
            <p className="text-emerald-700 font-medium">100% Debt-Free</p>
            <p className="text-[10px] text-slate-400 mt-1">
              No outstanding loans modeled. Zero EMI liability added to FIRE corpus.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Principal & EMI Schedule</span>
        <span className="text-amber-700 font-medium">Impacts FIRE Number</span>
      </div>
    </div>
  );
};
