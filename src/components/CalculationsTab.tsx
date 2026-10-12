import React, { useState } from 'react';
import {
  CashflowRow,
  FireProfile,
  FireSummary,
  LifeEvents,
  LoanPlan,
  MacroAssumptions,
  PensionPlan,
} from '../types/fire';
import { formatCrLakh, formatINR } from '../utils/formatters';
import { exportFireWorkbook } from '../utils/excelExport';
import { Table, Download, FileSpreadsheet, Search, Filter, Code, Printer } from 'lucide-react';

interface CalculationsTabProps {
  rows: CashflowRow[];
  profile: FireProfile;
  macro: MacroAssumptions;
  events: LifeEvents;
  pension: PensionPlan;
  loan: LoanPlan;
  summary: FireSummary;
  onOpenPdfReport: () => void;
}

export const CalculationsTab: React.FC<CalculationsTabProps> = ({
  rows,
  profile,
  macro,
  events,
  pension,
  loan,
  summary,
  onOpenPdfReport,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'milestones' | 'retired' | 'working'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormulaMode, setShowFormulaMode] = useState(false);

  const filteredRows = rows.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAge = r.age.toString().includes(q);
      const matchYear = r.calendarYear.toString().includes(q);
      const matchMilestone = r.milestones.some((m) => m.toLowerCase().includes(q));
      if (!matchAge && !matchYear && !matchMilestone) return false;
    }

    if (filterMode === 'milestones') {
      return r.milestones.length > 0;
    }
    if (filterMode === 'retired') {
      return r.isRetired;
    }
    if (filterMode === 'working') {
      return !r.isRetired;
    }
    return true;
  });

  const handleExport = () => {
    exportFireWorkbook(profile, macro, events, pension, loan, summary, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bento-card p-5 sm:p-6 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  The Calculation Engine (Backload)
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  SHEET: CALCULATIONS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Year-by-year cashflow simulation from Age {profile.currentAge} to 100 with pension offsets, loan EMIs & inflation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPdfReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all border border-blue-200/80"
            >
              <Printer className="w-3.5 h-3.5" />
              Download / Print PDF Report
            </button>

            <button
              onClick={() => setShowFormulaMode(!showFormulaMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                showFormulaMode
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              {showFormulaMode ? 'Showing Excel Formulas' : 'Show Excel Formulas'}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#1D1D1F] hover:bg-black text-white transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Download .XLSX
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex p-1 bg-[#F5F5F7] rounded-xl gap-1">
              {(
                [
                  { id: 'all', label: 'All Years (71)' },
                  { id: 'milestones', label: 'Milestones Only' },
                  { id: 'working', label: 'Working Phase' },
                  { id: 'retired', label: 'Retired Phase' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    filterMode === f.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search age, year, milestone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#F5F5F7] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
            />
          </div>
        </div>
      </div>

      {/* Spreadsheet Table View */}
      <div className="bento-card overflow-hidden bg-white border border-slate-200/60">
        <div className="overflow-x-auto max-h-[640px] relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F5F5F7] sticky top-0 z-20 text-[11px] font-semibold text-slate-700 tracking-tight border-b border-slate-200 shadow-sm">
              <tr>
                <th className="py-3 px-3 text-center">Age</th>
                <th className="py-3 px-2.5 text-center">Year</th>
                <th className="py-3 px-3">Phase</th>
                <th className="py-3 px-3 text-right">Opening Bal</th>
                <th className="py-3 px-3 text-right">Annual SIP</th>
                <th className="py-3 px-3 text-right">Living Exp</th>
                <th className="py-3 px-3 text-right">Health Ins</th>
                <th className="py-3 px-2.5 text-right">Car (7y)</th>
                <th className="py-3 px-2.5 text-right">Weddings</th>
                <th className="py-3 px-3 text-right text-amber-700">Loan EMI</th>
                <th className="py-3 px-3 text-right text-purple-700">Pension (+)</th>
                <th className="py-3 px-3 text-right font-bold text-slate-900">Net Outflow</th>
                <th className="py-3 px-3 text-right text-emerald-700">Growth</th>
                <th className="py-3 px-3.5 text-right bg-slate-100/70 font-bold">Closing Bal</th>
                <th className="py-3 px-2.5 text-center">SWR %</th>
                <th className="py-3 px-3">Milestones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-numbers">
              {filteredRows.map((row) => {
                const isRetirementYear = row.age === profile.targetRetirementAge;
                const isDepleted = row.closingBalance === 0;

                return (
                  <tr
                    key={row.age}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      isRetirementYear
                        ? 'bg-emerald-50/70 font-medium'
                        : isDepleted
                        ? 'bg-red-50/50'
                        : row.isRetired
                        ? 'bg-slate-50/40'
                        : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {row.age}
                    </td>

                    <td className="py-2.5 px-2.5 text-center text-slate-500 font-mono text-[11px]">
                      {row.calendarYear}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {row.isRetired ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          Retired
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          Working
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {showFormulaMode ? (
                        <span className="font-mono text-[10px] text-blue-600">
                          {row.yearIndex === 0 ? '=$B$5' : `=N${row.age - 1}`}
                        </span>
                      ) : (
                        formatINR(row.openingBalance)
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right text-emerald-700">
                      {row.annualSavings > 0 ? formatINR(row.annualSavings) : '-'}
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-800">
                      {formatINR(row.baselineExpense)}
                    </td>

                    <td className="py-2.5 px-3 text-right text-red-600">
                      {formatINR(row.healthInsurance)}
                    </td>

                    <td className="py-2.5 px-2.5 text-right text-amber-700">
                      {row.carCost > 0 ? formatINR(row.carCost) : '-'}
                    </td>

                    <td className="py-2.5 px-2.5 text-right text-purple-700">
                      {row.marriage1Cost + row.marriage2Cost > 0
                        ? formatINR(row.marriage1Cost + row.marriage2Cost)
                        : '-'}
                    </td>

                    {/* Loan EMI */}
                    <td className="py-2.5 px-3 text-right text-amber-700 font-medium">
                      {row.loanEmiOutflow > 0 ? formatINR(row.loanEmiOutflow) : '-'}
                    </td>

                    {/* Pension Inflow */}
                    <td className="py-2.5 px-3 text-right text-purple-700 font-bold">
                      {row.pensionIncome > 0 ? `+${formatINR(row.pensionIncome)}` : '-'}
                    </td>

                    {/* Net Outflow */}
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatINR(row.netOutflow)}
                    </td>

                    {/* Portfolio Growth */}
                    <td className="py-2.5 px-3 text-right text-emerald-700">
                      {formatINR(row.portfolioGrowth)}
                    </td>

                    {/* Closing Balance */}
                    <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 bg-slate-50/50">
                      <span className={row.closingBalance === 0 ? 'text-red-600 font-bold' : ''}>
                        {formatCrLakh(row.closingBalance, 2)}
                      </span>
                    </td>

                    {/* Withdrawal % */}
                    <td className="py-2.5 px-2.5 text-center text-slate-600 font-mono text-[11px]">
                      {row.withdrawalRate > 0 ? `${row.withdrawalRate.toFixed(2)}%` : '-'}
                    </td>

                    {/* Milestones */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {row.milestones.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.milestones.map((m, mi) => (
                            <span
                              key={mi}
                              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                m.includes('Retirement')
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : m.includes('Pension')
                                  ? 'bg-purple-100 text-purple-800 font-bold'
                                  : m.includes('Loan')
                                  ? 'bg-amber-100 text-amber-800 font-bold'
                                  : m.includes('Marriage')
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#F5F5F7] border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-4">
            <span>
              Showing <strong>{filteredRows.length}</strong> of {rows.length} simulated ledger years
            </span>
            <span>·</span>
            <span>
              Retirement Target: <strong>Age {profile.targetRetirementAge}</strong>
            </span>
            <span>·</span>
            <span>
              Horizon: <strong>Age {summary.portfolioSurvivalAge}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPdfReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-xs shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> PDF Audit Report
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-medium text-xs shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel (.xlsx)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
