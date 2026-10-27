import React, { useState } from 'react'
import type { Industry, Language, GrievanceReport, ReportStatus, ReportCategory } from '../types'
import { translations } from '../i18n/translations'
import { getWorkers, getReportsForEmployer, updateReportStatus } from '../services/storageService'
import { evaluateWorkforceFatigue } from '../utils/fatigueAlerts'

interface EmployerDashboardProps {
  industry: Industry
  language: Language
  onDataChanged?: () => void
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  industry,
  language,
}) => {
  const t = translations[language]

  // Data
  const workers = getWorkers(industry)
  const [reports, setReports] = useState<GrievanceReport[]>(() => getReportsForEmployer(industry))
  const [fatigueThreshold, setFatigueThreshold] = useState<number>(48)

  // Filtering
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Status Update Modal state
  const [activeReport, setActiveReport] = useState<GrievanceReport | null>(null)
  const [selectedNewStatus, setSelectedNewStatus] = useState<ReportStatus>('under_review')
  const [resolutionNote, setResolutionNote] = useState<string>('')
  const [operatorName, setOperatorName] = useState<string>(
    industry === 'construction' ? 'Site Project Director' : 'Dean of Campus Infrastructure'
  )

  // Evaluate Fatigue Warnings
  const fatigueAlerts = evaluateWorkforceFatigue(workers, fatigueThreshold)

  // Metrics
  const totalWorkers = workers.length
  const totalOvertime = workers.reduce((sum, w) => sum + (w.loggedOvertimeHours || 0), 0)
  const openReportsCount = reports.filter((r) => r.status !== 'resolved').length

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesCat = categoryFilter === 'all' || r.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesCat && matchesStatus
  })

  const handleOpenStatusModal = (report: GrievanceReport) => {
    setActiveReport(report)
    setSelectedNewStatus(report.status === 'resolved' ? 'resolved' : 'under_review')
    setResolutionNote('')
  }

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeReport) return

    updateReportStatus(activeReport.id, selectedNewStatus, resolutionNote, operatorName)

    // Refresh reports list
    const updatedList = getReportsForEmployer(industry)
    setReports(updatedList)
    setActiveReport(null)
  }

  const getStatusBadge = (status: GrievanceReport['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="status-pill status-submitted">{t.statusSubmitted}</span>
      case 'under_review':
        return <span className="status-pill status-review">{t.statusUnderReview}</span>
      case 'action_taken':
        return <span className="status-pill status-action">{t.statusActionTaken}</span>
      case 'resolved':
        return <span className="status-pill status-resolved">✓ {t.statusResolved}</span>
      default:
        return null
    }
  }

  const getCategoryLabel = (cat: ReportCategory) => {
    switch (cat) {
      case 'safety_hazard':
        return t.catHazard
      case 'harassment':
        return t.catHarassment
      case 'wage_concern':
        return t.catWage
      case 'working_conditions':
        return t.catConditions
    }
  }

  return (
    <div className="feature-container" id="employer-insights-section">
      <div className="feature-header">
        <div>
          <h2 className="feature-title">🏢 {t.employerTitle}</h2>
          <p className="feature-subtitle">{t.employerSubtitle}</p>
        </div>
        <div className="compliance-shield-badge">
          <span>🛡️ {t.verifiedTag}</span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="metrics-dashboard-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-blue-subtle">👷</div>
          <div>
            <span className="kpi-label">{t.metricWorkers}</span>
            <div className="kpi-value text-primary">{totalWorkers} Personnel</div>
            <span className="kpi-sub">{industry === 'construction' ? 'Across 4 Active Sectors' : 'Across Campus Hostels & Facilities'}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-amber-subtle">⏱️</div>
          <div>
            <span className="kpi-label">{t.metricOT}</span>
            <div className="kpi-value text-amber">{totalOvertime} Hours</div>
            <span className="kpi-sub">Total logged this weekly cycle</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-rose-subtle">🚨</div>
          <div>
            <span className="kpi-label">{t.metricOpenIssues}</span>
            <div className="kpi-value text-rose">{openReportsCount} Pending</div>
            <span className="kpi-sub">Grievance & hazard tickets</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-purple-subtle">💤</div>
          <div>
            <span className="kpi-label">{t.metricFatigueAlerts}</span>
            <div className="kpi-value text-purple">{fatigueAlerts.length} Flagged</div>
            <span className="kpi-sub">Exceeding safe weekly shift hours</span>
          </div>
        </div>
      </div>

      {/* Section 1: Worker Fatigue & Excessive Hours Monitor */}
      <div className="panel card mt-4">
        <div className="panel-header-with-action">
          <div>
            <h3 className="panel-title">💤 {t.fatigueTitle}</h3>
            <p className="panel-subtext">{t.fatigueDescription}</p>
          </div>

          <div className="threshold-control">
            <label htmlFor="fatigue-threshold-input" className="text-sm font-semibold">
              {t.fatigueThreshold}:
            </label>
            <input
              id="fatigue-threshold-input"
              type="number"
              min="40"
              max="70"
              step="2"
              className="number-input-sm"
              value={fatigueThreshold}
              onChange={(e) => setFatigueThreshold(Math.max(40, Number(e.target.value)))}
            />
            <span className="text-xs text-secondary">hrs/week</span>
          </div>
        </div>

        <div className="fatigue-alerts-feed">
          {fatigueAlerts.map((alert) => (
            <div
              key={alert.workerId}
              className={`fatigue-alert-card ${
                alert.severity === 'critical' ? 'severity-critical' : 'severity-warning'
              }`}
            >
              <div className="alert-top-row">
                <div className="alert-worker-info">
                  <span className="font-semibold text-lg">{alert.workerName}</span>
                  <span className="worksite-pill">📍 {alert.worksite}</span>
                </div>
                <div className="alert-badge-group">
                  <span
                    className={`severity-badge ${
                      alert.severity === 'critical' ? 'critical-badge' : 'warning-badge'
                    }`}
                  >
                    {alert.severity === 'critical' ? '🚨 CRITICAL FATIGUE' : '⚠️ ELEVATED HOURS'}
                  </span>
                  <span className="hours-stat font-mono">
                    {alert.totalHours}h / week ({alert.regularHours}h reg + {alert.overtimeHours}h OT)
                  </span>
                </div>
              </div>

              <div className="recommendation-box">
                <span className="recommendation-icon">📋</span>
                <p className="recommendation-text">
                  <strong>Action Required:</strong> {alert.recommendation}
                </p>
              </div>
            </div>
          ))}

          {fatigueAlerts.length === 0 && (
            <div className="empty-state-success">
              <span>✅ {t.noFatigueAlerts}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: SafeVoice Triage Center */}
      <div className="panel card mt-4">
        <div className="panel-header-with-action">
          <div>
            <h3 className="panel-title">🛡️ {t.triageTitle}</h3>
            <p className="panel-subtext">
              Direct audit trail and status management. Anonymous worker reports withhold identity in compliance with privacy protocols.
            </p>
          </div>

          <div className="filter-controls-row">
            <select
              className="select-input select-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by incident category"
            >
              <option value="all">Filter: {t.filterAll}</option>
              <option value="safety_hazard">⚠️ Safety Hazard</option>
              <option value="wage_concern">💵 Wage Concern</option>
              <option value="working_conditions">🌡️ Working Conditions</option>
              <option value="harassment">⚖️ Harassment</option>
            </select>

            <select
              className="select-input select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">Status: {t.filterStatusAll}</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="action_taken">Action Taken</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="triage-table-wrapper">
          <table className="triage-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Worksite</th>
                <th>Category</th>
                <th>Summary & Privacy</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className={report.urgent ? 'urgent-row' : ''}>
                  <td className="font-mono text-sm font-semibold">
                    {report.referenceCode}
                    {report.urgent && <span className="urgent-badge-sm">URGENT</span>}
                  </td>
                  <td className="text-sm">{report.worksite}</td>
                  <td>
                    <span className="category-pill">{getCategoryLabel(report.category)}</span>
                  </td>
                  <td>
                    <div className="triage-title-cell">
                      <strong>{report.title}</strong>
                      <span className="reporter-privacy-sub">
                        {report.isAnonymous ? (
                          <span className="text-amber">🛡️ {report.reporterName}</span>
                        ) : (
                          <span>👤 {report.reporterName}</span>
                        )}
                        {' • '}
                        {report.createdAt}
                      </span>
                    </div>
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <button
                      type="button"
                      className="primary-btn btn-sm"
                      onClick={() => handleOpenStatusModal(report)}
                    >
                      {t.updateStatusBtn}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-secondary">
                    No reports match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Status Update & Resolution */}
      {activeReport && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">
                ⚙️ Manage Incident: <span className="font-mono">{activeReport.referenceCode}</span>
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveReport(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="incident-summary-box">
                <h4>{activeReport.title}</h4>
                <p className="text-sm text-secondary mt-1">{activeReport.description}</p>
                <div className="incident-meta-tags mt-2">
                  <span className="meta-tag">📍 {activeReport.worksite}</span>
                  <span className="meta-tag">🏷️ {getCategoryLabel(activeReport.category)}</span>
                  <span className="meta-tag">
                    {activeReport.isAnonymous ? '🛡️ Anonymous Reporter' : `👤 ${activeReport.reporterName}`}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveStatusUpdate} className="modal-form">
                <div className="form-field">
                  <label htmlFor="new-status-select" className="input-label font-semibold">
                    Set New Status:
                  </label>
                  <select
                    id="new-status-select"
                    className="select-input"
                    value={selectedNewStatus}
                    onChange={(e) => setSelectedNewStatus(e.target.value as ReportStatus)}
                  >
                    <option value="under_review">🔍 Under Review (Investigation Initiated)</option>
                    <option value="action_taken">🛠️ Action Taken (Corrective Measures Deployed)</option>
                    <option value="resolved">✓ Resolved (Closed with Verification)</option>
                    <option value="submitted">📥 Submitted (Re-open)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="operator-name-input" className="input-label">
                    Authorized Officer / Manager Name:
                  </label>
                  <input
                    id="operator-name-input"
                    type="text"
                    required
                    className="text-input"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="resolution-note-textarea" className="input-label">
                    Resolution / Corrective Action Notes:
                  </label>
                  <textarea
                    id="resolution-note-textarea"
                    rows={3}
                    required
                    placeholder="Enter verifiable corrective action (e.g. Scaffolding clamps retorqued; water dispenser restocked; overtime variance credited)."
                    className="textarea-input"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setActiveReport(null)}
                  >
                    {t.closeModal}
                  </button>
                  <button type="submit" className="primary-btn">
                    💾 {t.saveStatusUpdate}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
