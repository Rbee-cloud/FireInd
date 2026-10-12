import React from 'react';
import {
  CashflowRow,
  FireProfile,
  FireSummary,
  LifeEvents,
  LoanPlan,
  MacroAssumptions,
  PensionPlan,
  RiskShield,
} from '../types/fire';
import { ProfileBox } from './ProfileBox';
import { MacroBox } from './MacroBox';
import { BigNumberBox } from './BigNumberBox';
import { LifeEventsBox } from './LifeEventsBox';
import { WealthGraphBox } from './WealthGraphBox';
import { RiskShieldBox } from './RiskShieldBox';
import { PensionBox } from './PensionBox';
import { LoanBox } from './LoanBox';
import { ARCHETYPES } from '../utils/engine';
import { Printer, Layers } from 'lucide-react';

interface BentoDashboardProps {
  profile: FireProfile;
  macro: MacroAssumptions;
  events: LifeEvents;
  pension: PensionPlan;
  loan: LoanPlan;
  shield: RiskShield;
  summary: FireSummary;
  rows: CashflowRow[];
  onProfileChange: (p: Partial<FireProfile>) => void;
  onMacroChange: (m: Partial<MacroAssumptions>) => void;
  onEventsChange: (e: Partial<LifeEvents>) => void;
  onPensionChange: (pen: Partial<PensionPlan>) => void;
  onLoanChange: (l: Partial<LoanPlan>) => void;
  onShieldChange: (s: Partial<RiskShield>) => void;
  onApplyArchetype: (archetypeId: string) => void;
  onSwitchToCalculations: () => void;
  onOpenPdfReport: () => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  profile,
  macro,
  events,
  pension,
  loan,
  shield,
  summary,
  rows,
  onProfileChange,
  onMacroChange,
  onEventsChange,
  onPensionChange,
  onLoanChange,
  onShieldChange,
  onApplyArchetype,
  onSwitchToCalculations,
  onOpenPdfReport,
}) => {
  return (
    <div className="space-y-6">
      {/* Archetype Quick Selector Bar & PDF Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quick Personas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ARCHETYPES.map((arch) => (
              <button
                key={arch.id}
                onClick={() => onApplyArchetype(arch.id)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-95"
              >
                {arch.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPdfReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate PDF Audit Report</span>
          </button>

          <button
            onClick={onSwitchToCalculations}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 group transition-colors"
          >
            <span>70-Year Ledger Table</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Main Bento Canvas Layout */}
      {/* Row 1: Top Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Box 1: The Profile (Top Left) */}
        <div className="lg:col-span-3 flex flex-col">
          <ProfileBox profile={profile} onChange={onProfileChange} />
        </div>

        {/* Box 3: The "Big Number" (Center Top - Wide Rectangle) */}
        <div className="lg:col-span-6 flex flex-col">
          <BigNumberBox summary={summary} profile={profile} />
        </div>

        {/* Box 2: Macro Assumptions (Top Right) */}
        <div className="lg:col-span-3 flex flex-col">
          <MacroBox macro={macro} onChange={onMacroChange} />
        </div>
      </div>

      {/* Row 2: Debt Liabilities vs Pension Inflows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Loans & Liabilities Box */}
        <div className="lg:col-span-6 flex flex-col">
          <LoanBox
            loan={loan}
            currentAge={profile.currentAge}
            targetRetirementAge={profile.targetRetirementAge}
            onChange={onLoanChange}
          />
        </div>

        {/* Pension & Annuity Box */}
        <div className="lg:col-span-6 flex flex-col">
          <PensionBox
            pension={pension}
            currentAge={profile.currentAge}
            swr={macro.safeWithdrawalRate}
            onChange={onPensionChange}
          />
        </div>
      </div>

      {/* Row 3: Life Event Outlays & Visual Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Box 4: Life Event Outlays (Middle Left) */}
        <div id="life-events" className="lg:col-span-4 flex flex-col">
          <LifeEventsBox
            events={events}
            currentAge={profile.currentAge}
            onChange={onEventsChange}
          />
        </div>

        {/* Box 5: The Wealth Graph (Center Large) */}
        <div className="lg:col-span-8 flex flex-col">
          <WealthGraphBox
            rows={rows}
            summary={summary}
            retirementAge={profile.targetRetirementAge}
          />
        </div>
      </div>

      {/* Row 4: Risk Shield & Strategic Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Box 6: Risk Shield Checklist */}
        <div id="risk-shield" className="lg:col-span-4 flex flex-col">
          <RiskShieldBox
            shield={shield}
            annualExpenses={profile.annualExpenses}
            onChange={onShieldChange}
          />
        </div>

        {/* Strategic Indian FIRE Principles Bento Card */}
        <div className="lg:col-span-8 bento-card p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Indian FIRE Reality Architecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Integrating Pensions, Debt Clearance & Milestone Outlays
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">BENTO ENGINE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl">
                <div className="font-semibold text-slate-900 mb-1">
                  1. Pension as a Corpus Multiplier
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Every ₹10,000/mo of lifelong pension replaces ~₹37.5 Lakhs in stock/debt corpus required at 3.2% SWR, significantly lowering your FIRE hurdle.
                </p>
              </div>

              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl">
                <div className="font-semibold text-slate-900 mb-1">
                  2. Debt Zeroing Pre-Retirement
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Entering early retirement with ongoing EMIs introduces severe sequence-of-returns risk. Remaining debt is factored directly into the target corpus.
                </p>
              </div>

              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl">
                <div className="font-semibold text-slate-900 mb-1">
                  3. Lumpy Family Milestones
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Children's weddings and 7-year car refresh cycles represent discrete multi-lakh hits modeled as explicit timeline triggers.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Formula standard: Finance Act 2024 LTCG & CPI Index</span>
            <button
              onClick={onSwitchToCalculations}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Full 70-Year Ledger Table →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
