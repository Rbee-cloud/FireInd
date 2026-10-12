import {
  CashflowRow,
  FireProfile,
  FireSummary,
  LifeEvents,
  LoanPlan,
  MacroAssumptions,
  PensionPlan,
  RiskProfile,
} from '../types/fire';

export const RISK_PRESETS: Record<
  RiskProfile,
  {
    safeWithdrawalRate: number;
    lifestyleInflation: number;
    medicalInflation: number;
    portfolioReturn: number;
    ltcgTaxRate: number;
    label: string;
    description: string;
  }
> = {
  conservative: {
    safeWithdrawalRate: 2.8,
    lifestyleInflation: 7.0,
    medicalInflation: 12.0,
    portfolioReturn: 7.0,
    ltcgTaxRate: 12.5,
    label: 'Conservative',
    description: 'Higher inflation buffer, conservative 2.8% SWR',
  },
  moderate: {
    safeWithdrawalRate: 3.2,
    lifestyleInflation: 6.5,
    medicalInflation: 12.0,
    portfolioReturn: 7.5,
    ltcgTaxRate: 12.5,
    label: 'Moderate (Standard India)',
    description: 'Standard 3.2% SWR balanced for Indian equity/debt mix',
  },
  aggressive: {
    safeWithdrawalRate: 3.8,
    lifestyleInflation: 6.0,
    medicalInflation: 11.0,
    portfolioReturn: 8.5,
    ltcgTaxRate: 12.5,
    label: 'Aggressive',
    description: 'Growth-oriented equity portfolio with 3.8% SWR',
  },
};

export const ARCHETYPES = [
  {
    id: 'bengaluru-tech',
    name: 'Techie in Bengaluru',
    subtitle: 'Age 29 · Home Loan & NPS',
    profile: {
      currentAge: 29,
      targetRetirementAge: 43,
      annualExpenses: 15_00_000,
      currentNetWorth: 85_00_000,
      annualSavings: 24_00_000,
    },
    macro: {
      riskProfile: 'moderate' as RiskProfile,
      safeWithdrawalRate: 3.2,
      lifestyleInflation: 6.5,
      medicalInflation: 12.0,
      portfolioReturn: 8.0,
      ltcgTaxRate: 12.5,
    },
    pension: {
      enabled: true,
      monthlyPension: 30_000, // NPS annuity starting at 60
      startAge: 60,
      inflationIndexed: false,
      annualIndexationRate: 0,
    },
    loan: {
      enabled: true,
      totalOutstandingPrincipal: 45_00_000, // Home loan
      annualEmi: 4_80_000, // ₹40k/mo
      remainingYears: 10,
      payoffAtRetirement: true,
    },
    events: {
      child1MarriageCost: 30_00_000,
      child1MarriageAge: 54,
      child1Enabled: true,
      child2MarriageCost: 30_00_000,
      child2MarriageAge: 57,
      child2Enabled: false,
      carCost: 18_00_000,
      carFrequencyYears: 7,
      annualHealthInsurance: 40_000,
    },
  },
  {
    id: 'mumbai-corp',
    name: 'Corporate Mid-Career',
    subtitle: 'Age 36 · Family milestones',
    profile: {
      currentAge: 36,
      targetRetirementAge: 48,
      annualExpenses: 22_00_000,
      currentNetWorth: 1_90_00_000,
      annualSavings: 30_00_000,
    },
    macro: {
      riskProfile: 'moderate' as RiskProfile,
      safeWithdrawalRate: 3.2,
      lifestyleInflation: 6.5,
      medicalInflation: 12.0,
      portfolioReturn: 7.5,
      ltcgTaxRate: 12.5,
    },
    pension: {
      enabled: true,
      monthlyPension: 50_000, // Corporate EPS & annuity
      startAge: 58,
      inflationIndexed: true,
      annualIndexationRate: 4.0,
    },
    loan: {
      enabled: true,
      totalOutstandingPrincipal: 28_00_000,
      annualEmi: 4_20_000, // ₹35k/mo
      remainingYears: 6,
      payoffAtRetirement: true,
    },
    events: {
      child1MarriageCost: 40_00_000,
      child1MarriageAge: 56,
      child1Enabled: true,
      child2MarriageCost: 40_00_000,
      child2MarriageAge: 60,
      child2Enabled: true,
      carCost: 25_00_000,
      carFrequencyYears: 7,
      annualHealthInsurance: 60_000,
    },
  },
  {
    id: 'gov-defence',
    name: 'Govt / Defence Officer',
    subtitle: 'Age 34 · High Pension Security',
    profile: {
      currentAge: 34,
      targetRetirementAge: 46,
      annualExpenses: 14_00_000,
      currentNetWorth: 70_00_000,
      annualSavings: 18_00_000,
    },
    macro: {
      riskProfile: 'conservative' as RiskProfile,
      safeWithdrawalRate: 3.0,
      lifestyleInflation: 6.0,
      medicalInflation: 12.0,
      portfolioReturn: 7.2,
      ltcgTaxRate: 12.5,
    },
    pension: {
      enabled: true,
      monthlyPension: 75_000, // DA-indexed defined benefit pension
      startAge: 46,
      inflationIndexed: true,
      annualIndexationRate: 5.5,
    },
    loan: {
      enabled: false,
      totalOutstandingPrincipal: 0,
      annualEmi: 0,
      remainingYears: 0,
      payoffAtRetirement: false,
    },
    events: {
      child1MarriageCost: 25_00_000,
      child1MarriageAge: 56,
      child1Enabled: true,
      child2MarriageCost: 25_00_000,
      child2MarriageAge: 60,
      child2Enabled: false,
      carCost: 15_00_000,
      carFrequencyYears: 7,
      annualHealthInsurance: 20_000, // CGHS / ECHS covered
    },
  },
  {
    id: 'lean-fire',
    name: 'Lean FIRE Minimalist',
    subtitle: 'Age 27 · Debt-free frugality',
    profile: {
      currentAge: 27,
      targetRetirementAge: 38,
      annualExpenses: 7_50_000,
      currentNetWorth: 45_00_000,
      annualSavings: 14_00_000,
    },
    macro: {
      riskProfile: 'conservative' as RiskProfile,
      safeWithdrawalRate: 3.0,
      lifestyleInflation: 6.0,
      medicalInflation: 11.0,
      portfolioReturn: 7.2,
      ltcgTaxRate: 12.5,
    },
    pension: {
      enabled: false,
      monthlyPension: 0,
      startAge: 60,
      inflationIndexed: false,
      annualIndexationRate: 0,
    },
    loan: {
      enabled: false,
      totalOutstandingPrincipal: 0,
      annualEmi: 0,
      remainingYears: 0,
      payoffAtRetirement: false,
    },
    events: {
      child1MarriageCost: 15_00_000,
      child1MarriageAge: 52,
      child1Enabled: false,
      child2MarriageCost: 15_00_000,
      child2MarriageAge: 56,
      child2Enabled: false,
      carCost: 10_00_000,
      carFrequencyYears: 7,
      annualHealthInsurance: 25_000,
    },
  },
  {
    id: 'fat-fire',
    name: 'Fat FIRE / Luxury',
    subtitle: 'Age 33 · High comfort',
    profile: {
      currentAge: 33,
      targetRetirementAge: 50,
      annualExpenses: 36_00_000,
      currentNetWorth: 3_20_00_000,
      annualSavings: 50_00_000,
    },
    macro: {
      riskProfile: 'aggressive' as RiskProfile,
      safeWithdrawalRate: 3.5,
      lifestyleInflation: 7.0,
      medicalInflation: 12.0,
      portfolioReturn: 8.5,
      ltcgTaxRate: 12.5,
    },
    pension: {
      enabled: true,
      monthlyPension: 80_000,
      startAge: 55,
      inflationIndexed: true,
      annualIndexationRate: 4.5,
    },
    loan: {
      enabled: true,
      totalOutstandingPrincipal: 60_00_000,
      annualEmi: 7_20_000,
      remainingYears: 8,
      payoffAtRetirement: true,
    },
    events: {
      child1MarriageCost: 60_00_000,
      child1MarriageAge: 58,
      child1Enabled: true,
      child2MarriageCost: 60_00_000,
      child2MarriageAge: 62,
      child2Enabled: true,
      carCost: 40_00_000,
      carFrequencyYears: 7,
      annualHealthInsurance: 80_000,
    },
  },
];

export function runFireSimulation(
  profile: FireProfile,
  macro: MacroAssumptions,
  events: LifeEvents,
  pension: PensionPlan,
  loan: LoanPlan
): { rows: CashflowRow[]; summary: FireSummary } {
  const currentYear = new Date().getFullYear();
  const maxAge = 100;
  const startAge = Math.max(18, Math.min(80, profile.currentAge));
  const retirementAge = Math.max(startAge, Math.min(90, profile.targetRetirementAge));

  const rows: CashflowRow[] = [];
  let runningOpeningBalance = profile.currentNetWorth;
  let runningBaselineExpense = profile.annualExpenses;
  let runningHealthInsurance = events.annualHealthInsurance;

  const lifestyleInfRate = macro.lifestyleInflation / 100;
  const medicalInfRate = macro.medicalInflation / 100;
  const returnRate = macro.portfolioReturn / 100;
  const swrRate = macro.safeWithdrawalRate / 100;

  let peakNetWorth = runningOpeningBalance;
  let peakNetWorthAge = startAge;
  let portfolioSurvivalAge = maxAge;
  let firstFireAge: number | null = null;

  const loanEndAge = startAge + (loan.enabled ? loan.remainingYears : 0);

  for (let age = startAge; age <= maxAge; age++) {
    const yearIndex = age - startAge;
    const calendarYear = currentYear + yearIndex;
    const isRetired = age >= retirementAge;

    // Baseline Expenses compounding
    const baselineExpense =
      yearIndex === 0
        ? runningBaselineExpense
        : runningBaselineExpense * Math.pow(1 + lifestyleInfRate, yearIndex);

    // Health Insurance compounding
    const healthInsurance =
      yearIndex === 0
        ? runningHealthInsurance
        : runningHealthInsurance * Math.pow(1 + medicalInfRate, yearIndex);

    // Car Trigger: Every 7 years (after start age)
    const isCarYear = yearIndex > 0 && yearIndex % events.carFrequencyYears === 0;
    const carCost = isCarYear ? events.carCost * Math.pow(1 + lifestyleInfRate, yearIndex) : 0;

    // Marriage Triggers
    const isMarriage1 = events.child1Enabled && age === events.child1MarriageAge;
    const marriage1Cost = isMarriage1
      ? events.child1MarriageCost * Math.pow(1 + lifestyleInfRate, yearIndex)
      : 0;

    const isMarriage2 = events.child2Enabled && age === events.child2MarriageAge;
    const marriage2Cost = isMarriage2
      ? events.child2MarriageCost * Math.pow(1 + lifestyleInfRate, yearIndex)
      : 0;

    // Loan EMI Outflow
    const isLoanActive = loan.enabled && age < loanEndAge;
    const loanEmiOutflow = isLoanActive ? loan.annualEmi : 0;

    // Pension Income
    let pensionIncome = 0;
    if (pension.enabled && age >= pension.startAge) {
      const baseAnnualPension = pension.monthlyPension * 12;
      if (pension.inflationIndexed) {
        const indexYears = age - pension.startAge;
        const indexRate = pension.annualIndexationRate / 100;
        pensionIncome = baseAnnualPension * Math.pow(1 + indexRate, indexYears);
      } else {
        pensionIncome = baseAnnualPension;
      }
    }

    const totalOutflow =
      baselineExpense + healthInsurance + carCost + marriage1Cost + marriage2Cost + loanEmiOutflow;
    const netOutflow = Math.max(0, totalOutflow - pensionIncome);

    // Annual Savings (stops when retired)
    const annualSavings = isRetired ? 0 : profile.annualSavings;

    // Portfolio Growth = (Opening Balance + Annual Savings) * Return
    const investableBase = Math.max(0, runningOpeningBalance + annualSavings);
    const portfolioGrowth = investableBase * returnRate;

    // Closing Balance = Opening + Savings + Growth - Net Outflow
    let closingBalance = investableBase + portfolioGrowth - netOutflow;
    if (closingBalance < 0) {
      closingBalance = 0;
      if (portfolioSurvivalAge === maxAge) {
        portfolioSurvivalAge = age;
      }
    }

    if (closingBalance > peakNetWorth) {
      peakNetWorth = closingBalance;
      peakNetWorthAge = age;
    }

    // Milestones tracking
    const milestones: string[] = [];
    if (age === retirementAge) milestones.push('Retirement Point');
    if (loan.enabled && age === loanEndAge - 1) milestones.push('Loan Fully Paid Off');
    if (pension.enabled && age === pension.startAge) milestones.push('Pension Inflow Begins');
    if (isCarYear) milestones.push('Car Upgrade');
    if (isMarriage1) milestones.push('Child 1 Marriage');
    if (isMarriage2) milestones.push('Child 2 Marriage');

    // Withdrawal rate (% of portfolio)
    const withdrawalRate =
      investableBase > 0 ? (netOutflow / (investableBase + portfolioGrowth)) * 100 : 0;

    rows.push({
      yearIndex,
      calendarYear,
      age,
      isRetired,
      openingBalance: runningOpeningBalance,
      annualSavings,
      baselineExpense,
      healthInsurance,
      carCost,
      marriage1Cost,
      marriage2Cost,
      loanEmiOutflow,
      pensionIncome,
      totalOutflow,
      netOutflow,
      portfolioGrowth,
      closingBalance,
      milestones,
      withdrawalRate,
    });

    runningOpeningBalance = closingBalance;
  }

  // Calculate The "FIRE NUMBER" at Target Retirement Age
  const retirementRow = rows.find((r) => r.age === retirementAge) || rows[0];
  const annualExpenseAtRetirement =
    retirementRow ? retirementRow.baselineExpense + retirementRow.healthInsurance : profile.annualExpenses;
  const monthlyExpenseAtRetirement = annualExpenseAtRetirement / 12;

  // Pension at retirement age
  let annualPensionAtRetirement = 0;
  if (pension.enabled && retirementAge >= pension.startAge) {
    const baseAnnualPension = pension.monthlyPension * 12;
    if (pension.inflationIndexed) {
      const indexYears = retirementAge - pension.startAge;
      const indexRate = pension.annualIndexationRate / 100;
      annualPensionAtRetirement = baseAnnualPension * Math.pow(1 + indexRate, indexYears);
    } else {
      annualPensionAtRetirement = baseAnnualPension;
    }
  } else if (pension.enabled && retirementAge < pension.startAge) {
    // If pension starts later (e.g. age 60 when retiring at 45), calculate future pension present value
    annualPensionAtRetirement = pension.monthlyPension * 12;
  }

  // Net annual living expense needed from portfolio after pension
  const netAnnualExpenseAtRetirement = Math.max(
    0,
    annualExpenseAtRetirement - (retirementAge >= pension.startAge ? annualPensionAtRetirement : 0)
  );

  // Gross corpus required without pension
  const grossSwrCorpus = swrRate > 0 ? annualExpenseAtRetirement / swrRate : 0;

  // Effective pension corpus offset (how much money the pension replaces)
  const pensionCorpusOffset =
    pension.enabled && swrRate > 0
      ? (pension.monthlyPension * 12) / swrRate
      : 0;

  // Future lumpy event obligations reserve at retirement age
  let futureEventsReserve = 0;
  for (let age = retirementAge; age <= maxAge; age++) {
    const idx = age - startAge;
    const row = rows[idx];
    if (row) {
      const lumpSum = row.carCost + row.marriage1Cost + row.marriage2Cost;
      if (lumpSum > 0) {
        const yearsAfterRetirement = age - retirementAge;
        const discountFactor = Math.pow(1 + returnRate, yearsAfterRetirement);
        futureEventsReserve += lumpSum / (discountFactor > 0 ? discountFactor : 1);
      }
    }
  }

  // Remaining loan liability if retiring before loan is cleared
  let loanPayoffLiability = 0;
  if (loan.enabled && retirementAge < loanEndAge) {
    const remainingYearsAtRetire = loanEndAge - retirementAge;
    // Sum remaining EMIs or payoff
    loanPayoffLiability = remainingYearsAtRetire * loan.annualEmi;
  }

  // Base SWR Corpus adjusted for net expense after pension
  const netSwrCorpus = swrRate > 0 ? netAnnualExpenseAtRetirement / swrRate : 0;

  // Final Net FIRE Number
  // Net Base Corpus + reserve for future life events + loan liability
  const fireNumber = Math.round(
    netSwrCorpus + futureEventsReserve * 0.7 + loanPayoffLiability
  );
  const grossFireNumber = Math.round(grossSwrCorpus + futureEventsReserve * 0.7 + loanPayoffLiability);

  // Projected Net Worth at Retirement Age
  const projectedNetWorthAtRetirement = retirementRow ? retirementRow.closingBalance : 0;

  // Gap to Go
  const gapToGo = Math.max(0, fireNumber - projectedNetWorthAtRetirement);
  const isFireAchieved = gapToGo === 0 && projectedNetWorthAtRetirement >= fireNumber;

  // Find exact Estimated FIRE age
  for (let testAge = startAge; testAge <= maxAge; testAge++) {
    const testRow = rows.find((r) => r.age === testAge);
    if (!testRow) continue;
    const expAtTestAge = testRow.baselineExpense + testRow.healthInsurance;
    const penAtTestAge = testRow.pensionIncome;
    const netExpAtTestAge = Math.max(0, expAtTestAge - penAtTestAge);
    const requiredAtTestAge = swrRate > 0 ? netExpAtTestAge / swrRate : 0;
    if (testRow.closingBalance >= requiredAtTestAge) {
      firstFireAge = testAge;
      break;
    }
  }

  const estimatedFireAge = firstFireAge;
  const estimatedFireYear = estimatedFireAge !== null ? currentYear + (estimatedFireAge - startAge) : null;
  const yearsToFire = estimatedFireAge !== null ? Math.max(0, estimatedFireAge - startAge) : 0;

  const yearsToRetire = Math.max(1, retirementAge - startAge);
  const monthsToRetire = yearsToRetire * 12;
  const monthlySavingsNeeded = gapToGo > 0 ? Math.round(gapToGo / monthsToRetire) : 0;

  const summary: FireSummary = {
    fireNumber,
    grossFireNumber,
    pensionCorpusOffset: Math.round(pensionCorpusOffset),
    loanPayoffLiability: Math.round(loanPayoffLiability),
    projectedNetWorthAtRetirement,
    gapToGo,
    isFireAchieved,
    estimatedFireAge,
    estimatedFireYear,
    yearsToFire,
    portfolioSurvivalAge,
    peakNetWorth,
    peakNetWorthAge,
    annualExpenseAtRetirement,
    annualPensionAtRetirement,
    netAnnualExpenseAtRetirement,
    monthlyExpenseAtRetirement,
    monthlySavingsNeeded,
  };

  return { rows, summary };
}
