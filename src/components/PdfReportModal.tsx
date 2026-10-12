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
import { formatCrLakh, formatINR } from '../utils/formatters';
import { Printer, Download, X, ShieldCheck, Landmark, CreditCard, Sparkles, FileSpreadsheet } from 'lucide-react';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FireProfile;
  macro: MacroAssumptions;
  events: LifeEvents;
  pension: PensionPlan;
  loan: LoanPlan;
  shield: RiskShield;
  summary: FireSummary;
  rows: CashflowRow[];
  onExportExcel: () => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  macro,
  events,
  pension,
  loan,
  shield,
  summary,
  rows,
  onExportExcel,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Sample milestone rows for the report audit
  const sampleAges = [
    profile.currentAge,
    profile.currentAge + 1,
    profile.currentAge + (loan.enabled ? loan.remainingYears : 5),
    profile.targetRetirementAge,
    profile.targetRetirementAge + 5,
    pension.enabled ? pension.startAge : profile.targetRetirementAge + 10,
    70,
    80,
    90,
    100,
  ];

  const uniqueAges = Array.from(new Set(sampleAges)).sort((a, b) => a - b);
  const auditRows = rows.filter((r) => uniqueAges.includes(r.age));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200/80 my-8 print:my-0 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Executive FIRE Report
            </span>
            <span className="text-xs text-slate-500">· Ready for PDF Export</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 text-[#1D1D1F] space-y-8 print:p-6 print:text-black">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                Confidential Wealth Architecture
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                India Financial Independence (FIRE) Audit
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · Standard Cashflow Engine
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  summary.isFireAchieved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}
              >
                {summary.isFireAchieved ? 'FIRE Achieved' : 'In Accumulation'}
              </span>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                Horizon: Age {profile.currentAge} → {summary.portfolioSurvivalAge}
              </div>
            </div>
          </div>

          {/* Central Benchmark Card */}
          <div className="bg-[#F5F5F7] p-6 rounded-3xl border border-slate-200/60 print:bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-b md:border-b-0 md:border-r border-slate-200/80 pb-4 md:pb-0 md:pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Target FIRE Number (Corpus Needed)
                </span>
                <div className="text-3xl font-extrabold text-slate-900 tabular-numbers">
                  {formatCrLakh(summary.fireNumber, 2)}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  {formatINR(summary.fireNumber)}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  At Age {profile.targetRetirementAge} to support ₹{formatCrLakh(summary.annualExpenseAtRetirement, 1)}/yr living.
                </p>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-slate-200/80 pb-4 md:pb-0 md:pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Corpus Gap To Go
                </span>
                <div
                  className={`text-3xl font-extrabold tabular-numbers ${
                    summary.isFireAchieved ? 'text-emerald-700' : 'text-blue-700'
                  }`}
                >
                  {summary.isFireAchieved ? '₹0 (Surplus)' : formatCrLakh(summary.gapToGo, 2)}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  {summary.isFireAchieved ? 'Corpus Secure' : formatINR(summary.gapToGo)}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {summary.isFireAchieved
                    ? `Surplus portfolio of ${formatCrLakh(summary.projectedNetWorthAtRetirement, 1)}.`
                    : `Additional SIP needed: ${formatCrLakh(summary.monthlySavingsNeeded, 1)}/mo.`}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Estimated Earliest Exit
                </span>
                <div className="text-3xl font-extrabold text-slate-900 tabular-numbers">
                  {summary.estimatedFireAge ? `Age ${summary.estimatedFireAge}` : 'Age > 70'}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  {summary.estimatedFireYear ? `Target Year ${summary.estimatedFireYear}` : 'Adjust inputs'}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {summary.estimatedFireAge
                    ? `Full financial independence in ~${summary.yearsToFire} years.`
                    : 'Requires increased savings or reduced burn rate.'}
                </p>
              </div>
            </div>

            {/* Formula Decomposition Strip */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span>Gross Needed: <strong>{formatCrLakh(summary.grossFireNumber, 1)}</strong></span>
                {summary.pensionCorpusOffset > 0 && (
                  <span className="text-purple-700 font-semibold">
                    Pension Replaces: -{formatCrLakh(summary.pensionCorpusOffset, 1)}
                  </span>
                )}
                {summary.loanPayoffLiability > 0 && (
                  <span className="text-amber-700 font-semibold">
                    Debt Payoff: +{formatCrLakh(summary.loanPayoffLiability, 1)}
                  </span>
                )}
              </div>
              <div className="font-bold text-slate-900">
                Net Needed = {formatCrLakh(summary.fireNumber, 2)}
              </div>
            </div>
          </div>

          {/* 4 Pillars Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Profile */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-2">Profile</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between"><span>Current Age:</span> <strong className="text-slate-900">{profile.currentAge}</strong></div>
                <div className="flex justify-between"><span>Retire Target:</span> <strong className="text-slate-900">{profile.targetRetirementAge}</strong></div>
                <div className="flex justify-between"><span>Annual Exp:</span> <strong className="text-slate-900">{formatCrLakh(profile.annualExpenses, 1)}</strong></div>
                <div className="flex justify-between"><span>Net Worth:</span> <strong className="text-slate-900">{formatCrLakh(profile.currentNetWorth, 1)}</strong></div>
                <div className="flex justify-between"><span>Annual SIP:</span> <strong className="text-slate-900">{formatCrLakh(profile.annualSavings, 1)}</strong></div>
              </div>
            </div>

            {/* Macro */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-2">Macro Assumptions</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between"><span>SWR:</span> <strong className="text-slate-900">{macro.safeWithdrawalRate}%</strong></div>
                <div className="flex justify-between"><span>Lifestyle Inf:</span> <strong className="text-slate-900">{macro.lifestyleInflation}%</strong></div>
                <div className="flex justify-between"><span>Medical Inf:</span> <strong className="text-slate-900">{macro.medicalInflation}%</strong></div>
                <div className="flex justify-between"><span>Return:</span> <strong className="text-slate-900">{macro.portfolioReturn}%</strong></div>
                <div className="flex justify-between"><span>LTCG Tax:</span> <strong className="text-slate-900">{macro.ltcgTaxRate}%</strong></div>
              </div>
            </div>

            {/* Pension */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-2">Pension Inflow</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between"><span>Status:</span> <strong className="text-slate-900">{pension.enabled ? 'Active' : 'None'}</strong></div>
                {pension.enabled && (
                  <>
                    <div className="flex justify-between"><span>Monthly:</span> <strong className="text-slate-900">{formatINR(pension.monthlyPension)}</strong></div>
                    <div className="flex justify-between"><span>Starts:</span> <strong className="text-slate-900">Age {pension.startAge}</strong></div>
                    <div className="flex justify-between"><span>Indexed:</span> <strong className="text-slate-900">{pension.inflationIndexed ? 'Yes' : 'No'}</strong></div>
                    <div className="flex justify-between"><span>Replaces:</span> <strong className="text-purple-700">{formatCrLakh(summary.pensionCorpusOffset, 1)}</strong></div>
                  </>
                )}
              </div>
            </div>

            {/* Loans */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-2">Loans & Liabilities</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between"><span>Status:</span> <strong className="text-slate-900">{loan.enabled ? 'Active Debt' : 'Debt-Free'}</strong></div>
                {loan.enabled && (
                  <>
                    <div className="flex justify-between"><span>Principal:</span> <strong className="text-slate-900">{formatCrLakh(loan.totalOutstandingPrincipal, 1)}</strong></div>
                    <div className="flex justify-between"><span>Annual EMI:</span> <strong className="text-slate-900">{formatCrLakh(loan.annualEmi, 1)}</strong></div>
                    <div className="flex justify-between"><span>Remaining:</span> <strong className="text-slate-900">{loan.remainingYears} yrs</strong></div>
                    <div className="flex justify-between"><span>Ends At:</span> <strong className="text-slate-900">Age {profile.currentAge + loan.remainingYears}</strong></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Life Events & Risk Shield */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-2">Life Event Outlays</span>
              <ul className="space-y-1 text-slate-600">
                <li>Child 1 Marriage: {events.child1Enabled ? `${formatCrLakh(events.child1MarriageCost)} @ Age ${events.child1MarriageAge}` : 'Disabled'}</li>
                <li>Child 2 Marriage: {events.child2Enabled ? `${formatCrLakh(events.child2MarriageCost)} @ Age ${events.child2MarriageAge}` : 'Disabled'}</li>
                <li>Car Upgrade: {formatCrLakh(events.carCost)} every {events.carFrequencyYears} years</li>
                <li>Health Insurance: {formatINR(events.annualHealthInsurance)}/yr (12% compounding)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-900 block mb-2">Risk Shield Verification</span>
              <ul className="space-y-1 text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className={shield.emergencyBuffer ? 'text-emerald-600' : 'text-slate-300'}>✓</span> 12-Month Emergency Buffer: {formatCrLakh(profile.annualExpenses, 1)}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={shield.superTopup ? 'text-emerald-600' : 'text-slate-300'}>✓</span> Private Super Top-up: ₹1 Crore Lifelong Policy
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={shield.termInsurance ? 'text-emerald-600' : 'text-slate-300'}>✓</span> Pure Term Insurance: {formatCrLakh(profile.annualExpenses * 20, 1)}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={shield.highInterestDebt ? 'text-emerald-600' : 'text-slate-300'}>✓</span> High-Interest Debt: Cleared
                </li>
              </ul>
            </div>
          </div>

          {/* 10-Year Milestone Forecast Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Milestone Cashflow Projection Sample
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Extracted from 70-Year Ledger
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Age</th>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Living Exp</th>
                    <th className="py-2 px-3 text-right">Pension Inflow</th>
                    <th className="py-2 px-3 text-right">Net Outflow</th>
                    <th className="py-2 px-3 text-right font-bold">Closing Balance</th>
                    <th className="py-2 px-3">Milestone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-numbers">
                  {auditRows.map((r) => (
                    <tr key={r.age} className={r.age === profile.targetRetirementAge ? 'bg-emerald-50/80 font-bold' : ''}>
                      <td className="py-2 px-3 font-semibold text-slate-900">{r.age}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">{r.calendarYear}</td>
                      <td className="py-2 px-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.isRetired ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {r.isRetired ? 'Retired' : 'Working'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-800">{formatCrLakh(r.baselineExpense + r.healthInsurance, 1)}</td>
                      <td className="py-2 px-3 text-right text-purple-700">{r.pensionIncome > 0 ? `+${formatCrLakh(r.pensionIncome, 1)}` : '-'}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-900">{formatCrLakh(r.netOutflow, 1)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{formatCrLakh(r.closingBalance, 2)}</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px]">{r.milestones.join(', ') || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Notes & Sign-off */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
            <div>
              <span>India FIRE Bento-Planner · Financial Independence Blueprint</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Model assumptions: SWR {macro.safeWithdrawalRate}%, Inflation {macro.lifestyleInflation}%, Return {macro.portfolioReturn}%, LTCG {macro.ltcgTaxRate}%.
              </p>
            </div>
            <div className="text-right font-mono">
              CONFIDENTIAL & PERSONAL REPORT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
