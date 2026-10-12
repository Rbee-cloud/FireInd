import React, { useState, useMemo } from 'react';
import {
  FireProfile,
  LifeEvents,
  LoanPlan,
  MacroAssumptions,
  PensionPlan,
  RiskProfile,
  RiskShield,
} from './types/fire';
import { ARCHETYPES, runFireSimulation } from './utils/engine';
import { exportFireWorkbook } from './utils/excelExport';
import { Header } from './components/Header';
import { BentoDashboard } from './components/BentoDashboard';
import { CalculationsTab } from './components/CalculationsTab';
import { PdfReportModal } from './components/PdfReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'bento' | 'calculations'>('bento');
  const [isPdfReportOpen, setIsPdfReportOpen] = useState(false);

  // Initial State matching realistic Indian FIRE scenario
  const [profile, setProfile] = useState<FireProfile>({
    currentAge: 30,
    targetRetirementAge: 45,
    annualExpenses: 12_00_000, // ₹12 Lakhs / yr (₹1L/month)
    currentNetWorth: 60_00_000, // ₹60 Lakhs
    annualSavings: 15_00_000, // ₹15 Lakhs / yr
  });

  const [macro, setMacro] = useState<MacroAssumptions>({
    riskProfile: 'moderate' as RiskProfile,
    safeWithdrawalRate: 3.2, // Default: 3.2%
    lifestyleInflation: 6.5, // Default: 6.5%
    medicalInflation: 12.0, // Default: 12%
    portfolioReturn: 7.5, // Default: 7.5%
    ltcgTaxRate: 12.5, // Default: 12.5%
  });

  // Pension Plan State
  const [pension, setPension] = useState<PensionPlan>({
    enabled: true,
    monthlyPension: 35_000, // ₹35,000 / month
    startAge: 58,
    inflationIndexed: true,
    annualIndexationRate: 4.0,
  });

  // Loan & Debt Plan State
  const [loan, setLoan] = useState<LoanPlan>({
    enabled: true,
    totalOutstandingPrincipal: 30_00_000, // ₹30 Lakhs outstanding home loan
    annualEmi: 4_20_000, // ₹35k/month
    remainingYears: 7,
    payoffAtRetirement: true,
  });

  const [events, setEvents] = useState<LifeEvents>({
    child1MarriageCost: 25_00_000, // ₹25 Lakhs
    child1MarriageAge: 52,
    child1Enabled: true,
    child2MarriageCost: 25_00_000, // ₹25 Lakhs
    child2MarriageAge: 56,
    child2Enabled: true,
    carCost: 15_00_000, // ₹15 Lakhs every 7 years
    carFrequencyYears: 7,
    annualHealthInsurance: 35_000, // ₹35k/year compounding at 12%
  });

  const [shield, setShield] = useState<RiskShield>({
    emergencyBuffer: true,
    superTopup: true,
    termInsurance: true,
    highInterestDebt: true,
  });

  // Calculate live results via simulation engine
  const { rows, summary } = useMemo(() => {
    return runFireSimulation(profile, macro, events, pension, loan);
  }, [profile, macro, events, pension, loan]);

  const handleProfileChange = (p: Partial<FireProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  };

  const handleMacroChange = (m: Partial<MacroAssumptions>) => {
    setMacro((prev) => ({ ...prev, ...m }));
  };

  const handleEventsChange = (e: Partial<LifeEvents>) => {
    setEvents((prev) => ({ ...prev, ...e }));
  };

  const handlePensionChange = (pen: Partial<PensionPlan>) => {
    setPension((prev) => ({ ...prev, ...pen }));
  };

  const handleLoanChange = (l: Partial<LoanPlan>) => {
    setLoan((prev) => ({ ...prev, ...l }));
  };

  const handleShieldChange = (s: Partial<RiskShield>) => {
    setShield((prev) => ({ ...prev, ...s }));
  };

  const handleApplyArchetype = (archetypeId: string) => {
    const arch = ARCHETYPES.find((a) => a.id === archetypeId);
    if (!arch) return;
    setProfile(arch.profile);
    setMacro(arch.macro);
    setEvents(arch.events);
    if (arch.pension) setPension(arch.pension);
    if (arch.loan) setLoan(arch.loan);
  };

  const handleExportExcel = () => {
    exportFireWorkbook(profile, macro, events, pension, loan, summary, rows);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Apple-like Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportExcel={handleExportExcel}
        onOpenPdfReport={() => setIsPdfReportOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'bento' ? (
          <BentoDashboard
            profile={profile}
            macro={macro}
            events={events}
            pension={pension}
            loan={loan}
            shield={shield}
            summary={summary}
            rows={rows}
            onProfileChange={handleProfileChange}
            onMacroChange={handleMacroChange}
            onEventsChange={handleEventsChange}
            onPensionChange={handlePensionChange}
            onLoanChange={handleLoanChange}
            onShieldChange={handleShieldChange}
            onApplyArchetype={handleApplyArchetype}
            onSwitchToCalculations={() => setActiveTab('calculations')}
            onOpenPdfReport={() => setIsPdfReportOpen(true)}
          />
        ) : (
          <CalculationsTab
            rows={rows}
            profile={profile}
            macro={macro}
            events={events}
            pension={pension}
            loan={loan}
            summary={summary}
            onOpenPdfReport={() => setIsPdfReportOpen(true)}
          />
        )}
      </main>

      {/* PDF Executive Report Modal */}
      <PdfReportModal
        isOpen={isPdfReportOpen}
        onClose={() => setIsPdfReportOpen(false)}
        profile={profile}
        macro={macro}
        events={events}
        pension={pension}
        loan={loan}
        shield={shield}
        summary={summary}
        rows={rows}
        onExportExcel={handleExportExcel}
      />

      {/* Apple-styled Subtle Footer */}
      <footer className="mt-auto border-t border-black/5 bg-[#F5F5F7] py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">India FIRE Bento-Planner</span>
            <span>·</span>
            <span>Spreadsheet Canvas Architecture & Cashflow Simulator</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pensions & Debt Integrated</span>
            <span>·</span>
            <span>Separated UI & Engine</span>
            <span>·</span>
            <span>Export: .PDF & .XLSX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
