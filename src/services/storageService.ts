import type { WorkerProfile, GrievanceReport, Industry, ReportStatus, ReportStatusUpdate } from '../types'
import { SEED_WORKERS, SEED_REPORTS } from '../data/seedData'

const STORAGE_KEYS = {
  WORKERS: 'fairshift_workers_v1',
  REPORTS: 'fairshift_reports_v1',
  INITIALIZED: 'fairshift_initialized_v1',
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
  }
}

/**
 * Retrieves all workers for an industry context.
 */
export function getWorkers(industry?: Industry): WorkerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKERS)
    const list: WorkerProfile[] = raw ? JSON.parse(raw) : SEED_WORKERS
    return industry ? list.filter((w) => w.industry === industry) : list
  } catch {
    return industry ? SEED_WORKERS.filter((w) => w.industry === industry) : SEED_WORKERS
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
  }
}

/**
 * Retrieves reports filtered for the WORKER perspective.
 * If workerName is supplied, highlights their submitted reports.
 */
export function getReportsForWorker(industry?: Industry, workerName?: string): GrievanceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : SEED_REPORTS
    let filtered = industry ? list.filter((r) => r.industry === industry) : list

    if (workerName && workerName.trim().length > 0) {
      const trimmed = workerName.trim().toLowerCase()
      // Return reports filed by this worker or marked with this workerName
      filtered = filtered.filter((r) => r.reporterName?.toLowerCase() === trimmed)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return SEED_REPORTS
  }
}

/**
 * Retrieves reports for the EMPLOYER perspective.
 * CRITICAL PRIVACY ARCHITECTURE:
 * Any report flagged with isAnonymous: true has its reporterName and reporterRole
 * explicitly redacted so it cannot be viewed by ordinary employer view.
 */
export function getReportsForEmployer(industry?: Industry): GrievanceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS)
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : SEED_REPORTS
    const filtered = industry ? list.filter((r) => r.industry === industry) : list

    // Sanitize anonymous identity
    const sanitized = filtered.map((rep) => {
      if (rep.isAnonymous) {
        return {
          ...rep,
          reporterName: '[Protected - Anonymous Report]',
          reporterRole: undefined,
        }
      }
      return rep
    })

    return sanitized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return SEED_REPORTS.map((r) => (r.isAnonymous ? { ...r, reporterName: '[Protected - Anonymous Report]' } : r))
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
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : SEED_REPORTS
    list.unshift(newReport)
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list))
  } catch (err) {
    console.error('Failed to persist report:', err)
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
    const list: GrievanceReport[] = raw ? JSON.parse(raw) : SEED_REPORTS
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
    return null
  }
}
