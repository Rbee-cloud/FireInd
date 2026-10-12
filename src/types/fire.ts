export interface FireProfile {
  currentAge: number;
  targetRetirementAge: number;
  annualExpenses: number; // in INR
  currentNetWorth: number; // in INR
  annualSavings: number; // in INR
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface MacroAssumptions {
  riskProfile: RiskProfile;
  safeWithdrawalRate: number; // percentage e.g. 3.2
  lifestyleInflation: number; // percentage e.g. 6.5
  medicalInflation: number; // percentage e.g. 12.0
  portfolioReturn: number; // percentage e.g. 7.5
  ltcgTaxRate: number; // percentage e.g. 12.5
}

export interface PensionPlan {
  enabled: boolean;
  monthlyPension: number; // in INR (e.g. ₹35,000 / mo)
  startAge: number; // Age at which pension kicks in (e.g. 58 or 60 or retirement age)
  inflationIndexed: boolean; // Does pension grow with inflation/DA
  annualIndexationRate: number; // percentage e.g. 5.0%
}

export interface LoanPlan {
  enabled: boolean;
  totalOutstandingPrincipal: number; // in INR (e.g. Home loan ₹35,00,000)
  annualEmi: number; // in INR (e.g. ₹4,80,000 / yr = ₹40k/mo)
  remainingYears: number; // e.g. 8 years left
  payoffAtRetirement: boolean; // Lump-sum payoff at retirement if not cleared earlier
}

export interface LifeEvents {
  child1MarriageCost: number; // in INR
  child1MarriageAge: number;
  child1Enabled: boolean;
  child2MarriageCost: number; // in INR
  child2MarriageAge: number;
  child2Enabled: boolean;
  carCost: number; // in INR (recurs every 7 years)
  carFrequencyYears: number; // 7 years
  annualHealthInsurance: number; // in INR
}

export interface RiskShield {
  emergencyBuffer: boolean;
  superTopup: boolean;
  termInsurance: boolean;
  highInterestDebt: boolean;
}

export interface CashflowRow {
  yearIndex: number;
  calendarYear: number;
  age: number;
  isRetired: boolean;
  openingBalance: number;
  annualSavings: number;
  baselineExpense: number;
  healthInsurance: number;
  carCost: number;
  marriage1Cost: number;
  marriage2Cost: number;
  loanEmiOutflow: number;
  pensionIncome: number;
  totalOutflow: number;
  netOutflow: number; // totalOutflow - pensionIncome
  portfolioGrowth: number;
  closingBalance: number;
  milestones: string[];
  withdrawalRate: number; // percentage of closing or opening balance
}

export interface FireSummary {
  fireNumber: number; // Net total corpus needed at target retirement age (in INR)
  grossFireNumber: number; // Before pension offset & loan
  pensionCorpusOffset: number; // How much corpus the pension effectively replaces
  loanPayoffLiability: number; // Outstanding loan liability at or during retirement
  projectedNetWorthAtRetirement: number;
  gapToGo: number; // in INR (0 if surplus)
  isFireAchieved: boolean;
  estimatedFireAge: number | null; // Age at which portfolio >= needed
  estimatedFireYear: number | null;
  yearsToFire: number;
  portfolioSurvivalAge: number; // age until which money lasts (up to 100)
  peakNetWorth: number;
  peakNetWorthAge: number;
  annualExpenseAtRetirement: number;
  annualPensionAtRetirement: number;
  netAnnualExpenseAtRetirement: number;
  monthlyExpenseAtRetirement: number;
  monthlySavingsNeeded: number;
}
