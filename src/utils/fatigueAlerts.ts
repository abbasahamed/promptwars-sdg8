import type { WorkerProfile, FatigueAlert, Industry } from '../types'

/**
 * Evaluates weekly worker hours against safe labor standards (UN SDG 8.8).
 * Flags personnel working excessive overtime to prevent worksite accidents and burnout.
 */
export function evaluateWorkforceFatigue(
  workers: WorkerProfile[],
  thresholdHours: number = 48
): FatigueAlert[] {
  const alerts: FatigueAlert[] = []
  const effectiveThreshold = Number.isFinite(thresholdHours)
    ? Math.min(168, Math.max(0, thresholdHours))
    : 48

  for (const worker of workers) {
    const reg = Number.isFinite(worker.loggedRegularHours)
      ? Math.min(168, Math.max(0, worker.loggedRegularHours))
      : 0
    const ot = Number.isFinite(worker.loggedOvertimeHours)
      ? Math.min(168, Math.max(0, worker.loggedOvertimeHours))
      : 0
    const total = reg + ot

    if (total > effectiveThreshold) {
      const isCritical = total >= effectiveThreshold + 10
      const recommendation = getIndustryFatigueRecommendation(worker.industry, total, isCritical)

      alerts.push({
        workerId: worker.id,
        workerName: worker.name,
        industry: worker.industry,
        worksite: worker.worksite,
        totalHours: total,
        regularHours: reg,
        overtimeHours: ot,
        thresholdHours: effectiveThreshold,
        severity: isCritical ? 'critical' : 'warning',
        recommendation,
      })
    }
  }

  // Sort alerts descending by total hours
  return alerts.sort((a, b) => b.totalHours - a.totalHours)
}

function getIndustryFatigueRecommendation(
  industry: Industry,
  totalHours: number,
  isCritical: boolean
): string {
  if (industry === 'construction') {
    if (isCritical) {
      return `Critical hours (${totalHours}h logged): Review the schedule and arrange adequate rest before high-risk equipment or scaffolding work.`
    }
    return `Elevated hours (${totalHours}h logged): Review the remaining shift plan and schedule hydration and heat-rest breaks on site.`
  }

  // Campus Facilities
  if (isCritical) {
    return `Critical hours (${totalHours}h logged): Review consecutive night sanitation or electrical maintenance shifts and arrange adequate rest.`
  }
  return `Elevated hours (${totalHours}h logged): Review consecutive campus shifts and plan adequate recovery time between duties.`
}
