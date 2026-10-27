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

  for (const worker of workers) {
    const reg = Math.max(0, worker.loggedRegularHours || 0)
    const ot = Math.max(0, worker.loggedOvertimeHours || 0)
    const total = reg + ot

    if (total > thresholdHours) {
      const isCritical = total >= thresholdHours + 10
      const recommendation = getIndustryFatigueRecommendation(worker.industry, total, isCritical)

      alerts.push({
        workerId: worker.id,
        workerName: worker.name,
        industry: worker.industry,
        worksite: worker.worksite,
        totalHours: total,
        regularHours: reg,
        overtimeHours: ot,
        thresholdHours,
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
      return `Critical Fatigue (${totalHours}h logged): Mandatory 24-hour stand-down required before operating heavy equipment or high-altitude scaffolding (OSHA / SDG 8.8 safe work guidelines).`
    }
    return `Elevated Hours (${totalHours}h logged): Cap remaining shifts this week; schedule mandatory hydration and thermal rest breaks on site.`
  }

  // Campus Facilities
  if (isCritical) {
    return `Critical Shift Load (${totalHours}h logged): Reassign consecutive night sanitation / electrical maintenance duties immediately to prevent hazard fatigue.`
  }
  return `Elevated Hours (${totalHours}h logged): Enforce maximum 8-hour consecutive shift cap for hostel and campus facilities team.`
}
