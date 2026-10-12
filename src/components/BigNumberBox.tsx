import React from 'react';
import { FireProfile, FireSummary } from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { ShieldCheck, Sparkles, AlertCircle, ArrowUpRight, Landmark, CreditCard } from 'lucide-react';

interface BigNumberBoxProps {
  summary: FireSummary;
  profile: FireProfile;
}

export const BigNumberBox: React.FC<BigNumberBoxProps> = ({ summary, profile }) => {
  const isAchieved = summary.isFireAchieved;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-7 text-white transition-all duration-500 shadow-xl relative overflow-hidden flex flex-col justify-between ${
        isAchieved
          ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700'
          : 'bg-gradient-to-br from-[#007AFF] via-[#0062D2] to-[#0A4BB5]'
      }`}
    >
      {/* Decorative background glow rings */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              {isAchieved ? <Sparkles className="w-4 h-4 text-emerald-200" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-white/70 block truncate">
                BOX 03 · THE CENTRAL BENCHMARK
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {isAchieved ? 'Financial Independence Achieved' : 'The India FIRE Benchmark'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAchieved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> FIRE Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-white/90">
                <AlertCircle className="w-3.5 h-3.5 text-blue-200" /> In Accumulation
              </span>
            )}
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
          {/* Output 1: YOUR FIRE NUMBER */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between min-w-0">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/75 mb-1 flex items-center justify-between">
                <span className="truncate">Your FIRE Number</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold tracking-tight text-white tabular-numbers truncate">
                {formatCrLakh(summary.fireNumber, 2)}
              </div>
              <div className="mt-0.5 text-xs text-white/80 tabular-numbers truncate">
                {formatINR(summary.fireNumber)}
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-white/70 leading-relaxed">
              Net portfolio needed at Age {profile.targetRetirementAge} after pension offset & loan clearance.
            </p>
          </div>

          {/* Output 2: GAP TO GO */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between min-w-0">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/75 mb-1 flex items-center justify-between">
                <span className="truncate">Gap To Go</span>
                <span className="text-[10px] text-white/60 shrink-0">@ Age {profile.targetRetirementAge}</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold tracking-tight text-white tabular-numbers truncate">
                {isAchieved ? '₹0' : formatCrLakh(summary.gapToGo, 2)}
              </div>
              <div className="mt-0.5 text-xs text-white/80 tabular-numbers truncate">
                {isAchieved ? 'Surplus Portfolio' : formatINR(summary.gapToGo)}
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-white/70 leading-relaxed">
              {isAchieved
                ? `Projected portfolio of ${formatCrLakh(summary.projectedNetWorthAtRetirement, 1)} safely exceeds target.`
                : `Save ${formatCrLakh(summary.monthlySavingsNeeded, 1)}/mo additionally to retire on target.`}
            </p>
          </div>

          {/* Output 3: ESTIMATED FIRE DATE */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between min-w-0">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/75 mb-1 flex items-center justify-between">
                <span className="truncate">Estimated FIRE Date</span>
                <span className="text-[10px] text-white/60 shrink-0">Earliest Exit</span>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold tracking-tight text-white tabular-numbers truncate">
                {summary.estimatedFireAge ? `Age ${summary.estimatedFireAge}` : 'Age > 70'}
              </div>
              <div className="mt-0.5 text-xs text-white/80 tabular-numbers truncate">
                {summary.estimatedFireYear ? `Target Year ${summary.estimatedFireYear}` : 'Adjust assumptions'}
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-white/70 leading-relaxed">
              {summary.estimatedFireAge
                ? `Can exit active employment in ~${summary.yearsToFire} years without depleting before Age 100.`
                : 'Current accumulation rate lags inflation.'}
            </p>
          </div>
        </div>

        {/* Real-time Math Decomposition Pill Strip */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white/70 text-[11px]">Formula Breakdown:</span>
            <span className="text-white/90">
              Gross Base: <strong>{formatCrLakh(summary.grossFireNumber, 1)}</strong>
            </span>
            {summary.pensionCorpusOffset > 0 && (
              <span className="text-emerald-200 flex items-center gap-1 font-semibold">
                <Landmark className="w-3 h-3" /> Pension Offset: -{formatCrLakh(summary.pensionCorpusOffset, 1)}
              </span>
            )}
            {summary.loanPayoffLiability > 0 && (
              <span className="text-amber-200 flex items-center gap-1 font-semibold">
                <CreditCard className="w-3 h-3" /> Debt Payoff: +{formatCrLakh(summary.loanPayoffLiability, 1)}
              </span>
            )}
          </div>
          <div className="text-[11px] text-white/80 font-mono">
            Net FIRE Number = <strong>{formatCrLakh(summary.fireNumber, 2)}</strong>
          </div>
        </div>

        {/* Narrative Summary Bar */}
        <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-white/85 gap-2">
          <p className="font-medium text-[11.5px] leading-relaxed">
            💡 Summary: You need{' '}
            <strong className="text-white underline decoration-white/40 decoration-1 underline-offset-2">
              {formatCrLakh(summary.fireNumber, 2)}
            </strong>{' '}
            invested to retire at age {profile.targetRetirementAge} while sustaining ₹{formatCrLakh(summary.annualExpenseAtRetirement, 1)}/yr lifestyle + all family milestones.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <span>Survives to Age {summary.portfolioSurvivalAge}</span>
            <span>·</span>
            <span>Peak: {formatCrLakh(summary.peakNetWorth, 1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
