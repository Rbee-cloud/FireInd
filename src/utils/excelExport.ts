import * as XLSX from 'xlsx';
import {
  CashflowRow,
  FireProfile,
  FireSummary,
  LifeEvents,
  LoanPlan,
  MacroAssumptions,
  PensionPlan,
} from '../types/fire';

export function exportFireWorkbook(
  profile: FireProfile,
  macro: MacroAssumptions,
  events: LifeEvents,
  pension: PensionPlan,
  loan: LoanPlan,
  summary: FireSummary,
  rows: CashflowRow[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet 1: DASHBOARD
  const dashboardData = [
    ['INDIA FIRE BENTO-PLANNER', '', '', '', ''],
    ['Canvas Architecture & Financial Independence Model', '', '', '', ''],
    ['', '', '', '', ''],
    ['--- BOX 1: THE PROFILE ---', '', '', '--- BOX 2: MACRO ASSUMPTIONS ---', ''],
    ['Current Age', profile.currentAge, '', 'Safe Withdrawal Rate (SWR)', `${macro.safeWithdrawalRate}%`],
    ['Target Retirement Age', profile.targetRetirementAge, '', 'Lifestyle Inflation', `${macro.lifestyleInflation}%`],
    ['Current Annual Expenses (₹)', profile.annualExpenses, '', 'Medical Inflation', `${macro.medicalInflation}%`],
    ['Current Investable Net Worth (₹)', profile.currentNetWorth, '', 'Expected Portfolio Return', `${macro.portfolioReturn}%`],
    ['Annual Savings Contribution (₹)', profile.annualSavings, '', 'LTCG Tax Rate', `${macro.ltcgTaxRate}%`],
    ['', '', '', 'Risk Profile', macro.riskProfile.toUpperCase()],
    ['', '', '', '', ''],
    ['--- BOX 3: THE BIG NUMBER ---', '', '', '--- BOX 6: RISK SHIELD ---', ''],
    ['YOUR FIRE NUMBER (Net Corpus Needed)', summary.fireNumber, '', '12-Month Emergency Buffer', 'Checked (₹' + (profile.annualExpenses).toLocaleString('en-IN') + ')'],
    ['Gross Base Corpus (Without Pension)', summary.grossFireNumber, '', 'Private Super Top-up Insurance', 'Checked (₹1 Cr Cover)'],
    ['Pension Corpus Offset (Saved)', summary.pensionCorpusOffset, '', 'Active Pure Term Insurance', 'Checked (20x Expenses)'],
    ['Loan Payoff Liability (Added)', summary.loanPayoffLiability, '', 'High-Interest Debt Zeroed', 'Cleared'],
    ['Projected Corpus at Retirement', summary.projectedNetWorthAtRetirement, '', 'Portfolio Survival Age', `Age ${summary.portfolioSurvivalAge}`],
    ['GAP TO GO', summary.gapToGo, '', 'Peak Projected Net Worth', summary.peakNetWorth],
    ['ESTIMATED FIRE AGE', summary.estimatedFireAge ?? 'Requires adjustment', '', 'Peak Net Worth Age', summary.peakNetWorthAge],
    ['ESTIMATED FIRE YEAR', summary.estimatedFireYear ?? 'N/A', '', '', ''],
    ['STATUS', summary.isFireAchieved ? 'FIRE ACHIEVED / READY' : 'ACCUMULATION IN PROGRESS', '', '', ''],
    ['', '', '', '', ''],
    ['--- PENSION & LOANS ---', '', '', '--- BOX 4: LIFE EVENT OUTLAYS ---', ''],
    ['Pension Enabled', pension.enabled ? 'YES' : 'NO', '', 'Child 1 Marriage Cost (₹)', events.child1MarriageCost],
    ['Monthly Pension (₹)', pension.monthlyPension, '', 'Child 1 Marriage Age', events.child1MarriageAge],
    ['Pension Start Age', pension.startAge, '', 'Child 2 Marriage Cost (₹)', events.child2MarriageCost],
    ['Pension Inflation Indexed', pension.inflationIndexed ? 'YES' : 'NO', '', 'Child 2 Marriage Age', events.child2MarriageAge],
    ['Loan Active', loan.enabled ? 'YES' : 'NO', '', 'New Car Cost (₹)', events.carCost],
    ['Loan Outstanding Principal (₹)', loan.totalOutstandingPrincipal, '', 'Car Upgrade Frequency', `Every ${events.carFrequencyYears} Years`],
    ['Annual Loan EMI (₹)', loan.annualEmi, '', 'Annual Health Insurance (₹)', events.annualHealthInsurance],
    ['Remaining Loan Tenure (Years)', loan.remainingYears, '', '', ''],
  ];

  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardData);

  wsDashboard['!cols'] = [
    { wch: 34 },
    { wch: 20 },
    { wch: 6 },
    { wch: 32 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(wb, wsDashboard, 'BENTO_DASHBOARD');

  // 2. Sheet 2: CALCULATIONS (Year-by-Year Cashflow Engine)
  const calcHeaders = [
    'Age',
    'Calendar Year',
    'Status',
    'Opening Balance (₹)',
    'Annual Savings (₹)',
    'Baseline Expense (₹)',
    'Health Insurance (₹)',
    'Car Upgrade Outlay (₹)',
    'Marriage 1 Outlay (₹)',
    'Marriage 2 Outlay (₹)',
    'Loan EMI Outflow (₹)',
    'Pension Income (₹)',
    'Total Outflow (₹)',
    'Net Outflow (₹)',
    'Portfolio Growth (₹)',
    'Closing Balance (₹)',
    'Withdrawal Rate (%)',
    'Milestones Triggered',
  ];

  const calcRows = rows.map((r) => [
    r.age,
    r.calendarYear,
    r.isRetired ? 'RETIRED' : 'ACCUMULATING',
    Math.round(r.openingBalance),
    Math.round(r.annualSavings),
    Math.round(r.baselineExpense),
    Math.round(r.healthInsurance),
    Math.round(r.carCost),
    Math.round(r.marriage1Cost),
    Math.round(r.marriage2Cost),
    Math.round(r.loanEmiOutflow),
    Math.round(r.pensionIncome),
    Math.round(r.totalOutflow),
    Math.round(r.netOutflow),
    Math.round(r.portfolioGrowth),
    Math.round(r.closingBalance),
    `${r.withdrawalRate.toFixed(2)}%`,
    r.milestones.join(', ') || '-',
  ]);

  const wsCalculations = XLSX.utils.aoa_to_sheet([calcHeaders, ...calcRows]);

  wsCalculations['!cols'] = [
    { wch: 8 },
    { wch: 14 },
    { wch: 16 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
    { wch: 20 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 22 },
    { wch: 18 },
    { wch: 28 },
  ];

  XLSX.utils.book_append_sheet(wb, wsCalculations, 'CALCULATIONS');

  XLSX.writeFile(wb, 'India_FIRE_Bento_Planner.xlsx');
}
