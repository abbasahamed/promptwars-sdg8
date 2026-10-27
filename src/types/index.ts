export type Industry = 'construction' | 'campus'
export type Role = 'worker' | 'employer'

export interface DeductionItem {
  id: string
  label: string
  amount: number
  category: 'safety_equipment' | 'uniform' | 'meals' | 'advance_recovery' | 'statutory_tax' | 'other'
}

export interface WorkerProfile {
  id: string
  name: string
  roleTitle: string
  industry: Industry
  worksite: string
  hourlyRate: number
  standardWeeklyHours: number
  loggedRegularHours: number
  loggedOvertimeHours: number
  overtimeMultiplier: number
  deductions: DeductionItem[]
}

export interface PayCalculationInput {
  workerId?: string
  workerName: string
  payPeriod: string
  hourlyRate: number
  regularHours: number
  overtimeHours: number
  overtimeMultiplier: number
  deductions: DeductionItem[]
}

export interface FormulaStep {
  step: string
  formula: string
  calculation: string
  result: number
}

export interface PayCalculationResult {
  regularPay: number
  overtimePay: number
  grossPay: number
  totalDeductions: number
  netPay: number
  steps: FormulaStep[]
  currency: string
  disclaimer: string
}

export type ReportCategory = 'safety_hazard' | 'harassment' | 'wage_concern' | 'working_conditions'
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical'
export type ReportStatus = 'submitted' | 'under_review' | 'action_taken' | 'resolved'

export interface ReportStatusUpdate {
  timestamp: string
  status: ReportStatus
  note: string
  updatedBy: string
}

export interface GrievanceReport {
  id: string
  referenceCode: string
  industry: Industry
  worksite: string
  category: ReportCategory
  priority: ReportPriority
  title: string
  description: string
  isAnonymous: boolean
  reporterName?: string
  reporterRole?: string
  createdAt: string
  status: ReportStatus
  history: ReportStatusUpdate[]
  urgent: boolean
}

export interface FatigueAlert {
  workerId: string
  workerName: string
  industry: Industry
  worksite: string
  totalHours: number
  regularHours: number
  overtimeHours: number
  thresholdHours: number
  severity: 'warning' | 'critical'
  recommendation: string
}
