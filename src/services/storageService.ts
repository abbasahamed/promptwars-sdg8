import type { WorkerProfile, GrievanceReport, Industry, ReportStatus, ReportStatusUpdate } from '../types'
import { SEED_WORKERS, SEED_REPORTS } from '../data/seedData'
import { isSampleReport } from '../utils/reportUtils'

let memoryWorkers: WorkerProfile[] | null = null
let memoryReports: GrievanceReport[] | null = null

const STORAGE_KEYS = {
  WORKERS: 'fairshift_workers_v1',
  REPORTS: 'fairshift_reports_v1',
  INITIALIZED: 'fairshift_initialized_v1',
}

function cloneWorkers(): typeof SEED_WORKERS {
  return SEED_WORKERS.map((worker) => ({
    ...worker,
    deductions: worker.deductions.map((deduction) => ({ ...deduction })),
  }))
}

function cloneReports(): typeof SEED_REPORTS {
  return SEED_REPORTS.map((report) => ({
    ...report,
    history: report.history.map((entry) => ({ ...entry })),
  }))
}

/**
 * Ensures demo datasets are seeded on initial application visit.
 */
export function initializeStorage(): void {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
    if (!isInit) {
      resetToDefaultSeed()
    }
  } catch (err) {
    console.warn('localStorage access failed, continuing in memory fallback mode:', err)
  }
}

/**
 * Resets all workers and reports back to original seed data.
 */
export function resetToDefaultSeed(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(SEED_WORKERS))
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  } catch (err) {
    console.error('Failed to reset storage:', err)
    memoryWorkers = cloneWorkers()
    memoryReports = cloneReports()
  }
}

/**
 * Retrieves all workers for an industry context.
 */
export function getWorkers(industry?: Industry): WorkerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKERS)
    const list: WorkerProfile[] = raw ? JSON.parse(raw) : cloneWorkers()
    return industry ? list.filter((w) => w.industry === industry) : list
  } catch {
    const list = memoryWorkers ?? cloneWorkers()
    return industry ? list.filter((w) => w.industry === industry) : list.map((worker) => ({ ...worker, deductions: worker.deductions.map((item) => ({ ...item })) }))
  }
}

/**
 * Updates a specific worker's logged hours or details.
 */
export function saveWorker(updatedWorker: WorkerProfile): void {
  try {
    const all = getWorkers()
    const index = all.findIndex((w) => w.id === updatedWorker.id)
    if (index >= 0) {
      all[index] = updatedWorker
    } else {
      all.push(updatedWorker)
    }
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(all))
  } catch (err) {
    console.error('Failed to save worker:', err)
    const all = memoryWorkers ?? cloneWorkers()
    const index = all.findIndex((worker) => worker.id === updatedWorker.id)
    if (index >= 0) all[index] = updatedWorker
    else all.push(updatedWorker)
    memoryWorkers = all
  }
}

/**
 * Retrieves reports filtered for the WORKER perspective.
 * If workerName is supplied, highlights their submitted reports.
 */
export function getReportsForWorker(industry?: Industry, workerId?: string): GrievanceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : cloneReports()
    const filtered = list.filter((r) => {
      if (industry && r.industry !== industry) return false
      return isSampleReport(r) || (Boolean(workerId) && r.reporterId === workerId)
    })

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return (memoryReports ?? cloneReports()).filter((r) => (!industry || r.industry === industry) && (isSampleReport(r) || Boolean(workerId) && r.reporterId === workerId))
  }
}

/**
 * Retrieves reports for the EMPLOYER perspective.
 * CRITICAL PRIVACY ARCHITECTURE:
 * Anonymous identity fields are omitted from the employer-facing view. This is
 * UI filtering only; browser localStorage is not a secure privacy boundary.
 */
export function getReportsForEmployer(industry?: Industry): GrievanceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : cloneReports()
    const filtered = industry ? list.filter((r) => r.industry === industry) : list

    // Sanitize anonymous identity
    const sanitized = filtered.map((rep) => {
      if (rep.isAnonymous) {
        return {
          ...rep,
          reporterName: '[Protected - Anonymous Report]',
          reporterRole: undefined,
          reporterId: undefined,
        }
      }
      return rep
    })

    return sanitized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return (memoryReports ?? cloneReports()).filter((report) => !industry || report.industry === industry).map((r) => (r.isAnonymous ? { ...r, reporterName: '[Protected - Anonymous Report]', reporterRole: undefined, reporterId: undefined } : { ...r }))
  }
}

/**
 * Submits a new SafeVoice grievance report.
 */
export function submitReport(
  reportData: Omit<GrievanceReport, 'id' | 'referenceCode' | 'createdAt' | 'status' | 'history'>
): GrievanceReport {
  const prefix = reportData.industry === 'construction' ? 'FS-CON' : 'FS-CMP'
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16)

  const newReport: GrievanceReport = {
    ...reportData,
    id: `rep-${Date.now()}-${randomSuffix}`,
    referenceCode: `${prefix}-${randomSuffix}`,
    createdAt: nowStr,
    status: 'submitted',
    history: [
      {
        timestamp: nowStr,
        status: 'submitted',
        note: reportData.isAnonymous
          ? 'Grievance submitted with Anonymous Demo Privacy toggle enabled.'
          : `Grievance submitted by ${reportData.reporterName || 'Worker'}.`,
        updatedBy: 'Worker Interface',
      },
    ],
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : cloneReports()
    list.unshift(newReport)
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list))
  } catch (err) {
    console.error('Failed to persist report:', err)
    memoryReports = [newReport, ...(memoryReports ?? cloneReports())]
  }

  return newReport
}

/**
 * Updates status of a grievance report (Employer action).
 */
export function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  note: string,
  updatedBy: string
): GrievanceReport | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : cloneReports()
    const item = list.find((r) => r.id === reportId)

    if (!item) return null

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16)
    const updateEntry: ReportStatusUpdate = {
      timestamp: nowStr,
      status: newStatus,
      note: note.trim() || `Status updated to ${newStatus}`,
      updatedBy: updatedBy || 'Operations Lead',
    }

    item.status = newStatus
    if (!item.history) item.history = []
    item.history.push(updateEntry)

    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list))
    return item
  } catch (err) {
    console.error('Failed to update report status:', err)
    const list = memoryReports ?? cloneReports()
    const item = list.find((report) => report.id === reportId)
    if (!item) return null
    item.status = newStatus
    item.history.push({ timestamp: new Date().toISOString(), status: newStatus, note: note.trim() || `Status updated to ${newStatus}`, updatedBy: updatedBy || 'Operations Lead' })
    memoryReports = list
    return item
  }
}
