import type { PayCalculationInput, PayCalculationResult, FormulaStep } from '../types'

/**
 * Calculates fair pay with explicit mathematical steps and zero hidden deductions.
 * Protects against negative inputs and invalid rates.
 */
export function calculatePay(input: PayCalculationInput): PayCalculationResult {
  const hourlyRate = Math.max(0, Number(input.hourlyRate) || 0)
  const regularHours = Math.max(0, Number(input.regularHours) || 0)
  const overtimeHours = Math.max(0, Number(input.overtimeHours) || 0)
  const overtimeMultiplier = Math.max(1, Number(input.overtimeMultiplier) || 1.5)

  // Step 1: Regular Pay
  const regularPay = Math.round(regularHours * hourlyRate * 100) / 100

  // Step 2: Overtime Pay
  const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeMultiplier * 100) / 100

  // Step 3: Gross Pay
  const grossPay = Math.round((regularPay + overtimePay) * 100) / 100

  // Step 4: Deductions (validate amounts)
  const deductionsList = Array.isArray(input.deductions) ? input.deductions : []
  const totalDeductions = Math.round(
    deductionsList.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0) * 100
  ) / 100

  // Step 5: Net Take-Home (clamped at 0 to prevent negative net pay anomalies)
  const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100)

  const steps: FormulaStep[] = [
    {
      step: 'Regular Pay',
      formula: 'Regular Hours × Base Hourly Rate',
      calculation: `${regularHours} hrs × ₹${hourlyRate.toFixed(2)}/hr`,
      result: regularPay,
    },
    {
      step: 'Overtime Pay',
      formula: 'Overtime Hours × Base Rate × Overtime Multiplier',
      calculation: `${overtimeHours} hrs × ₹${hourlyRate.toFixed(2)}/hr × ${overtimeMultiplier}x`,
      result: overtimePay,
    },
    {
      step: 'Gross Earnings',
      formula: 'Regular Pay + Overtime Pay',
      calculation: `₹${regularPay.toFixed(2)} + ₹${overtimePay.toFixed(2)}`,
      result: grossPay,
    },
    {
      step: 'Total Deductions',
      formula: 'Sum of Itemized Approved Deductions',
      calculation:
        deductionsList.length > 0
          ? deductionsList.map((d) => `${d.label}: ₹${Number(d.amount).toFixed(2)}`).join(' + ')
          : '₹0.00 (No deductions applied)',
      result: totalDeductions,
    },
    {
      step: 'Net Take-Home Pay',
      formula: 'Gross Earnings - Total Deductions',
      calculation: `₹${grossPay.toFixed(2)} - ₹${totalDeductions.toFixed(2)}`,
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
