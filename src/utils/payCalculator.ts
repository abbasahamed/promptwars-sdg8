import type { PayCalculationInput, PayCalculationResult, FormulaStep } from '../types'
import { formatCurrency } from './formatCurrency'

/**
 * Calculates fair pay with explicit mathematical steps and zero hidden deductions.
 * Protects against negative inputs and invalid rates.
 */
export function calculatePay(input: PayCalculationInput): PayCalculationResult {
  const finiteNonNegative = (value: number, max = Number.MAX_SAFE_INTEGER) =>
    Number.isFinite(Number(value)) ? Math.min(max, Math.max(0, Number(value))) : 0
  const hourlyRate = finiteNonNegative(input.hourlyRate, 1_000_000)
  const regularHours = finiteNonNegative(input.regularHours, 80)
  const overtimeHours = finiteNonNegative(input.overtimeHours, 50)
  const overtimeMultiplier = Math.min(3, Math.max(1, finiteNonNegative(input.overtimeMultiplier, 3) || 1.5))

  // Step 1: Regular Pay
  const regularPay = Math.round(regularHours * hourlyRate * 100) / 100

  // Step 2: Overtime Pay
  const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeMultiplier * 100) / 100

  // Step 3: Gross Pay
  const grossPay = Math.round((regularPay + overtimePay) * 100) / 100

  // Step 4: Deductions (validate amounts)
  const deductionsList = Array.isArray(input.deductions) ? input.deductions : []
  const normalizedDeductions = deductionsList.map((item) => ({ ...item, amount: finiteNonNegative(item.amount, 1_000_000_000) }))
  const totalDeductions = Math.round(
    normalizedDeductions.reduce((sum, item) => sum + item.amount, 0) * 100
  ) / 100

  // Step 5: Net Take-Home (clamped at 0 to prevent negative net pay anomalies)
  const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100)

  const steps: FormulaStep[] = [
    {
      step: 'Regular Pay',
      formula: 'Regular Hours × Base Hourly Rate',
      calculation: `${regularHours} hrs × ${formatCurrency(hourlyRate)}/hr`,
      result: regularPay,
    },
    {
      step: 'Overtime Pay',
      formula: 'Overtime Hours × Base Rate × Overtime Multiplier',
      calculation: `${overtimeHours} hrs × ${formatCurrency(hourlyRate)}/hr × ${overtimeMultiplier}x`,
      result: overtimePay,
    },
    {
      step: 'Gross Earnings',
      formula: 'Regular Pay + Overtime Pay',
      calculation: `${formatCurrency(regularPay)} + ${formatCurrency(overtimePay)}`,
      result: grossPay,
    },
    {
      step: 'Total Deductions',
      formula: 'Sum of Itemized Approved Deductions',
      calculation:
        normalizedDeductions.length > 0
          ? normalizedDeductions.map((d) => `${d.label}: ${formatCurrency(d.amount)}`).join(' + ')
          : `${formatCurrency(0)} (No deductions applied)`,
      result: totalDeductions,
    },
    {
      step: 'Net Take-Home Pay',
      formula: 'Gross Earnings - Total Deductions',
      calculation: `${formatCurrency(grossPay)} - ${formatCurrency(totalDeductions)}`,
      result: netPay,
    },
  ]

  return {
    regularPay,
    overtimePay,
    grossPay,
    totalDeductions,
    netPay,
    steps,
    currency: '₹',
    disclaimer:
      'Statutory Payroll Notice: This calculation is for transparent wage visibility and demonstration under UN SDG 8.3/8.5. Actual statutory deductions (PF, ESI, TDS) depend on verified contract terms.',
  }
}
