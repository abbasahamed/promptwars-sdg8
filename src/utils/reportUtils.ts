import type { GrievanceReport } from '../types'

/** Sample reports use stable seed IDs; submitted reports use generated IDs. */
export function isSampleReport(report: Pick<GrievanceReport, 'id'>): boolean {
  return report.id.startsWith('rep-con-') || report.id.startsWith('rep-cmp-')
}
