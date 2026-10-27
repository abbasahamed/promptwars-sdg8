import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SEED_REPORTS } from '../data/seedData'
import type { GrievanceReport, WorkerProfile } from '../types'
import { getReportsForEmployer, submitReport, updateReportStatus } from '../services/storageService'
import { evaluateWorkforceFatigue } from '../utils/fatigueAlerts'
import { formatCurrency } from '../utils/formatCurrency'
import { calculatePay } from '../utils/payCalculator'

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
})

describe('fatigue thresholds', () => {
  it('does not alert at the exact threshold, warns at threshold plus one, and is critical at threshold plus ten', () => {
    expect(evaluateWorkforceFatigue([worker({ loggedRegularHours: 48 })], 48)).toHaveLength(0)
    expect(evaluateWorkforceFatigue([worker({ loggedRegularHours: 49 })], 48)[0]?.severity).toBe('warning')
    expect(evaluateWorkforceFatigue([worker({ loggedRegularHours: 58 })], 48)[0]?.severity).toBe('critical')
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
    submitReport(report({ isAnonymous: true, reporterName: undefined }))
    const employerReports = getReportsForEmployer()
    const anonymousReports = employerReports.filter((item) => item.isAnonymous)

    expect(anonymousReports.length).toBeGreaterThan(0)
    expect(anonymousReports).toHaveLength(SEED_REPORTS.filter((item) => item.isAnonymous).length + 1)
    expect(anonymousReports.every((item) => item.reporterName === '[Protected - Anonymous Report]')).toBe(true)
    expect(anonymousReports.every((item) => item.reporterRole === undefined)).toBe(true)
  })

  it('appends a status update to report history', () => {
    const created = submitReport(report())
    const before = created.history.length
    const updated = updateReportStatus(created.id, 'under_review', 'Review started', 'Test Manager')

    expect(updated).not.toBeNull()
    expect(updated?.history).toHaveLength(before + 1)
    expect(updated?.history.at(-1)).toMatchObject({
      status: 'under_review',
      note: 'Review started',
      updatedBy: 'Test Manager',
    })
  })
})
