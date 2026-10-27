import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SEED_REPORTS, SEED_WORKERS } from '../data/seedData'
import type { GrievanceReport, WorkerProfile } from '../types'
import { getReportsForEmployer, getReportsForWorker, submitReport, updateReportStatus } from '../services/storageService'
import { evaluateWorkforceFatigue } from '../utils/fatigueAlerts'
import { formatCurrency } from '../utils/formatCurrency'
import { calculatePay, normalizePayInput } from '../utils/payCalculator'
import { isSampleReport } from '../utils/reportUtils'

function createLocalStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, String(value)),
  }
}

function worker(overrides: Partial<WorkerProfile> = {}): WorkerProfile {
  return {
    id: 'worker-test',
    name: 'Test Worker',
    roleTitle: 'Test Role',
    industry: 'construction',
    worksite: 'Test Worksite',
    hourlyRate: 100,
    standardWeeklyHours: 40,
    loggedRegularHours: 40,
    loggedOvertimeHours: 0,
    overtimeMultiplier: 1.5,
    deductions: [],
    ...overrides,
  }
}

function report(overrides: Partial<GrievanceReport> = {}): Omit<GrievanceReport, 'id' | 'referenceCode' | 'createdAt' | 'status' | 'history'> {
  return {
    industry: 'construction',
    worksite: 'Test Worksite',
    category: 'safety_hazard',
    priority: 'high',
    title: 'Test concern',
    description: 'A test concern for the local demo.',
    isAnonymous: false,
    reporterName: 'Test Worker',
    reporterRole: 'Test Role',
    urgent: false,
    ...overrides,
  }
}

describe('pay calculations', () => {
  it('calculates normal regular, overtime, gross, deductions, and net pay', () => {
    const result = calculatePay({
      workerName: 'Test Worker',
      payPeriod: 'Test period',
      hourlyRate: 180,
      regularHours: 40,
      overtimeHours: 10,
      overtimeMultiplier: 1.5,
      deductions: [{ id: 'deduction', label: 'Safety Kit', amount: 200, category: 'other' }],
    })

    expect(result.regularPay).toBe(7200)
    expect(result.overtimePay).toBe(2700)
    expect(result.grossPay).toBe(9900)
    expect(result.totalDeductions).toBe(200)
    expect(result.netPay).toBe(9700)
  })

  it('normalizes negative and NaN inputs to safe numeric values', () => {
    const result = calculatePay({
      workerName: 'Test Worker',
      payPeriod: 'Test period',
      hourlyRate: Number.NaN,
      regularHours: -10,
      overtimeHours: Number.NaN,
      overtimeMultiplier: Number.NaN,
      deductions: [{ id: 'bad', label: 'Invalid', amount: Number.NaN, category: 'other' }],
    })

    expect(result.regularPay).toBe(0)
    expect(result.overtimePay).toBe(0)
    expect(result.totalDeductions).toBe(0)
    expect(result.netPay).toBe(0)
  })

  it('clamps the overtime multiplier to at least 1', () => {
    const result = calculatePay({
      workerName: 'Test Worker',
      payPeriod: 'Test period',
      hourlyRate: 100,
      regularHours: 0,
      overtimeHours: 4,
      overtimeMultiplier: 0.5,
      deductions: [],
    })

    expect(result.overtimePay).toBe(400)
  })

  it('clamps net pay at zero when deductions exceed gross pay', () => {
    const result = calculatePay({
      workerName: 'Test Worker',
      payPeriod: 'Test period',
      hourlyRate: 100,
      regularHours: 10,
      overtimeHours: 0,
      overtimeMultiplier: 1.5,
      deductions: [{ id: 'large', label: 'Large deduction', amount: 5000, category: 'other' }],
    })

    expect(result.grossPay).toBe(1000)
    expect(result.totalDeductions).toBe(5000)
    expect(result.netPay).toBe(0)
  })

  it('uses bounded inputs consistently in the calculation and formula breakdown', () => {
    const normalized = normalizePayInput({
      workerName: 'Test Worker',
      payPeriod: 'Test period',
      hourlyRate: 1_500_000,
      regularHours: 100,
      overtimeHours: 60,
      overtimeMultiplier: 4,
      deductions: [{ id: 'bad', label: 'Invalid', amount: -10, category: 'other' }],
    })
    const result = calculatePay(normalized)

    expect(normalized).toMatchObject({ hourlyRate: 1_000_000, regularHours: 80, overtimeHours: 50, overtimeMultiplier: 3 })
    expect(normalized.deductions[0]?.amount).toBe(0)
    expect(result.regularPay).toBe(80_000_000)
    expect(result.overtimePay).toBe(150_000_000)
    expect(result.steps[0]?.calculation).toContain('80 hrs')
    expect(result.steps[1]?.calculation).toContain('50 hrs')
  })
})

describe('fatigue thresholds', () => {
  it('does not alert at the exact threshold, warns at threshold plus one, and is critical at threshold plus ten', () => {
    expect(evaluateWorkforceFatigue([worker({ loggedRegularHours: 48 })], 48)).toHaveLength(0)
    expect(evaluateWorkforceFatigue([worker({ loggedRegularHours: 49 })], 48)[0]?.severity).toBe('warning')
    expect(evaluateWorkforceFatigue([worker({ loggedRegularHours: 58 })], 48)[0]?.severity).toBe('critical')
  })

  it('treats non-finite hours as zero and bounds an invalid threshold', () => {
    const alerts = evaluateWorkforceFatigue([worker({ loggedRegularHours: Number.POSITIVE_INFINITY, loggedOvertimeHours: 50 })], Number.NaN)
    expect(alerts[0]?.regularHours).toBe(0)
    expect(alerts[0]?.totalHours).toBe(50)
    expect(alerts[0]?.thresholdHours).toBe(48)
  })

  it('gives different, sector-specific guidance for construction and campus work', () => {
    const construction = evaluateWorkforceFatigue(
      [worker({ industry: 'construction', loggedRegularHours: 50 })],
      48,
    )[0]
    const campus = evaluateWorkforceFatigue(
      [worker({ industry: 'campus', loggedRegularHours: 50 })],
      48,
    )[0]

    expect(construction?.recommendation).toContain('hydration and heat-rest breaks')
    expect(campus?.recommendation).toContain('campus shifts')
    expect(construction?.recommendation).not.toBe(campus?.recommendation)
  })
})

describe('industry sample data', () => {
  it('includes distinct worker and safety/wage report examples for both industries', () => {
    for (const industry of ['construction', 'campus'] as const) {
      expect(SEED_WORKERS.some((item) => item.industry === industry)).toBe(true)
      expect(SEED_REPORTS.some((item) => item.industry === industry && item.category === 'safety_hazard')).toBe(true)
      expect(SEED_REPORTS.some((item) => item.industry === industry && item.category === 'wage_concern')).toBe(true)
    }
  })
})

describe('currency formatting', () => {
  it('formats Indian currency with grouped digits and decimals', () => {
    expect(formatCurrency(1234567.89)).toBe('₹12,34,567.89')
  })

  it('formats NaN as zero currency', () => {
    expect(formatCurrency(Number.NaN)).toBe('₹0.00')
  })
})

describe('localStorage report service', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorage())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stores anonymous reports without reporterName and uses the industry prefix', () => {
    const construction = submitReport(report({ isAnonymous: true, reporterName: undefined }))
    const campus = submitReport(report({ industry: 'campus', isAnonymous: true, reporterName: undefined }))
    const stored = JSON.parse(localStorage.getItem('fairshift_reports_v1') || '[]') as GrievanceReport[]

    expect(construction.referenceCode).toMatch(/^FS-CON-/)
    expect(campus.referenceCode).toMatch(/^FS-CMP-/)
    expect(stored.find((item) => item.id === construction.id)).not.toHaveProperty('reporterName')
    expect(stored.find((item) => item.id === campus.id)).not.toHaveProperty('reporterName')
  })

  it('redacts every anonymous report in the employer view, including seed reports', () => {
    submitReport(report({ reporterId: 'worker-test', isAnonymous: true, reporterName: undefined }))
    const employerReports = getReportsForEmployer()
    const anonymousReports = employerReports.filter((item) => item.isAnonymous)

    expect(anonymousReports.length).toBeGreaterThan(0)
    expect(anonymousReports).toHaveLength(SEED_REPORTS.filter((item) => item.isAnonymous).length + 1)
    expect(anonymousReports.every((item) => item.reporterName === '[Protected - Anonymous Report]')).toBe(true)
    expect(anonymousReports.every((item) => item.reporterRole === undefined)).toBe(true)
    expect(anonymousReports.every((item) => item.reporterId === undefined)).toBe(true)
  })

  it('returns only sample reports and the selected worker profile reports', () => {
    const selected = submitReport(report({ reporterId: 'worker-one', isAnonymous: true, reporterName: undefined, title: 'Selected profile report' }))
    submitReport(report({ reporterId: 'worker-two', title: 'Different profile report' }))

    const selectedReports = getReportsForWorker('construction', 'worker-one')
    expect(selectedReports.some((item) => item.id === selected.id)).toBe(true)
    expect(selectedReports.some((item) => item.title === 'Different profile report')).toBe(false)
    expect(selectedReports.filter(isSampleReport)).toHaveLength(SEED_REPORTS.filter((item) => item.industry === 'construction').length)
  })

  it('appends a status update to report history', () => {
    const created = submitReport(report({ reporterId: 'worker-test' }))
    const before = created.history.length
    const updated = updateReportStatus(created.id, 'under_review', 'Review started', 'Test Manager')

    expect(updated).not.toBeNull()
    expect(updated?.history).toHaveLength(before + 1)
    expect(updated?.history.at(-1)).toMatchObject({
      status: 'under_review',
      note: 'Review started',
      updatedBy: 'Test Manager',
    })
    expect(getReportsForWorker('construction', 'worker-test').find((item) => item.id === created.id)?.status).toBe('under_review')
  })
})
