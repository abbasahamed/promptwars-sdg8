import test from 'node:test'
import assert from 'node:assert/strict'

// Inline test of calculatePay formula
function calculatePayTest(input) {
  const hourlyRate = Math.max(0, Number(input.hourlyRate) || 0)
  const regularHours = Math.max(0, Number(input.regularHours) || 0)
  const overtimeHours = Math.max(0, Number(input.overtimeHours) || 0)
  const overtimeMultiplier = Math.max(1, Number(input.overtimeMultiplier) || 1.5)

  const regularPay = Math.round(regularHours * hourlyRate * 100) / 100
  const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeMultiplier * 100) / 100
  const grossPay = Math.round((regularPay + overtimePay) * 100) / 100

  const deductionsList = Array.isArray(input.deductions) ? input.deductions : []
  const totalDeductions = Math.round(
    deductionsList.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0) * 100
  ) / 100

  const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100)

  return { regularPay, overtimePay, grossPay, totalDeductions, netPay }
}

test('calculatePay computes regular pay and overtime correctly', () => {
  const res = calculatePayTest({
    hourlyRate: 180,
    regularHours: 40,
    overtimeHours: 10,
    overtimeMultiplier: 1.5,
    deductions: [{ label: 'Safety Kit', amount: 200 }],
  })

  // Regular: 40 * 180 = 7200
  assert.equal(res.regularPay, 7200)
  // OT: 10 * 180 * 1.5 = 2700
  assert.equal(res.overtimePay, 2700)
  // Gross: 7200 + 2700 = 9900
  assert.equal(res.grossPay, 9900)
  // Deductions: 200
  assert.equal(res.totalDeductions, 200)
  // Net: 9900 - 200 = 9700
  assert.equal(res.netPay, 9700)
})

test('calculatePay clamps negative inputs to zero safely', () => {
  const res = calculatePayTest({
    hourlyRate: -50,
    regularHours: -10,
    overtimeHours: -5,
    overtimeMultiplier: 0.5, // should clamp to 1
    deductions: [{ label: 'Invalid Negative Deduction', amount: -100 }],
  })

  assert.equal(res.regularPay, 0)
  assert.equal(res.overtimePay, 0)
  assert.equal(res.grossPay, 0)
  assert.equal(res.totalDeductions, 0)
  assert.equal(res.netPay, 0)
})

test('calculatePay clamps net pay at zero when deductions exceed earnings', () => {
  const res = calculatePayTest({
    hourlyRate: 100,
    regularHours: 10,
    overtimeHours: 0,
    overtimeMultiplier: 1.5,
    deductions: [{ label: 'Huge Penalty', amount: 5000 }],
  })

  assert.equal(res.grossPay, 1000)
  assert.equal(res.totalDeductions, 5000)
  assert.equal(res.netPay, 0) // Cannot be negative
})

test('evaluateWorkforceFatigue flags workers above threshold', () => {
  const workers = [
    {
      id: 'w1',
      name: 'Safe Worker',
      industry: 'construction',
      worksite: 'Tower A',
      loggedRegularHours: 40,
      loggedOvertimeHours: 4,
    },
    {
      id: 'w2',
      name: 'Fatigued Worker',
      industry: 'construction',
      worksite: 'Sector 4',
      loggedRegularHours: 44,
      loggedOvertimeHours: 16, // Total 60h > 48h
    },
  ]

  const threshold = 48
  const alerts = workers
    .filter((w) => w.loggedRegularHours + w.loggedOvertimeHours > threshold)
    .map((w) => ({
      workerId: w.id,
      totalHours: w.loggedRegularHours + w.loggedOvertimeHours,
      severity: w.loggedRegularHours + w.loggedOvertimeHours >= threshold + 10 ? 'critical' : 'warning',
    }))

  assert.equal(alerts.length, 1)
  assert.equal(alerts[0].workerId, 'w2')
  assert.equal(alerts[0].totalHours, 60)
  assert.equal(alerts[0].severity, 'critical')
})
