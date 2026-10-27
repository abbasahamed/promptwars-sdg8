import React, { useState } from 'react'
import type { Industry, GrievanceReport, ReportStatus, ReportCategory } from '../types'
import { translations } from '../i18n/translations'
import { getWorkers, getReportsForEmployer, updateReportStatus } from '../services/storageService'
import { evaluateWorkforceFatigue } from '../utils/fatigueAlerts'
import { Icon } from './Icon'
import { isSampleReport } from '../utils/reportUtils'
import { useDialogAccessibility } from '../hooks/useDialogAccessibility'

interface EmployerDashboardProps { industry: Industry }

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ industry }) => {
  const t = translations.en
  const workers = getWorkers(industry)
  const [reports, setReports] = useState<GrievanceReport[]>(() => getReportsForEmployer(industry))
  const [fatigueThreshold, setFatigueThreshold] = useState(48)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeReport, setActiveReport] = useState<GrievanceReport | null>(null)
  const reportDialogRef = useDialogAccessibility(Boolean(activeReport), () => setActiveReport(null))
  const [selectedNewStatus, setSelectedNewStatus] = useState<ReportStatus>('under_review')
  const [resolutionNote, setResolutionNote] = useState('')
  const [operatorName, setOperatorName] = useState(industry === 'construction' ? 'Site Project Director' : 'Dean of Campus Infrastructure')
  const fatigueAlerts = evaluateWorkforceFatigue(workers, fatigueThreshold)
  const totalOvertime = workers.reduce((sum, worker) => sum + (worker.loggedOvertimeHours || 0), 0)
  const openReportsCount = reports.filter((report) => report.status !== 'resolved').length
  const filteredReports = reports.filter((report) => (categoryFilter === 'all' || report.category === categoryFilter) && (statusFilter === 'all' || report.status === statusFilter))

  const getStatusBadge = (status: GrievanceReport['status']) => {
    const labels = { submitted: t.statusSubmitted, under_review: t.statusUnderReview, action_taken: t.statusActionTaken, resolved: t.statusResolved }
    return <span className={`status-pill status-${status === 'under_review' ? 'review' : status === 'action_taken' ? 'action' : status}`}>{status === 'resolved' && <Icon name="check" size={14} />} {labels[status]}</span>
  }
  const getCategoryLabel = (category: ReportCategory) => ({ safety_hazard: t.catHazard, harassment: t.catHarassment, wage_concern: t.catWage, working_conditions: t.catConditions })[category]

  const handleSaveStatusUpdate = (event: React.FormEvent) => {
    event.preventDefault()
    if (!activeReport) return
    updateReportStatus(activeReport.id, selectedNewStatus, resolutionNote, operatorName)
    setReports(getReportsForEmployer(industry))
    setActiveReport(null)
  }

  return (
    <div className="feature-container" id="employer-insights-section">
      <div className="feature-header">
        <div className="title-block"><span className="eyebrow"><Icon name="activity" size={15} /> {t.navInsights}</span><h2 className="feature-title">{t.employerTitle}</h2><p className="feature-subtitle">{t.employerSubtitle}</p></div>
        <div className="trust-note"><Icon name="shield" size={16} /> {t.demoDataNote}</div>
      </div>
      <div className="context-line"><span className="context-dot" /><strong>{industry === 'construction' ? t.industryConstruction : t.industryCampus}</strong><span>·</span><span>{t.weeklyCycle}</span></div>

      <section className="insight-strip" aria-label={t.workforceSummary}>
        <div className="insight-item"><Icon name="people" size={20} /><div><span>{t.metricWorkers}</span><strong>{workers.length}</strong><small>{t.activeProfiles}</small></div></div>
        <div className="insight-item"><Icon name="clock" size={20} /><div><span>{t.metricOT}</span><strong>{totalOvertime}h</strong><small>{t.loggedThisCycle}</small></div></div>
        <div className={`insight-item ${openReportsCount > 0 ? 'insight-critical' : ''}`}><Icon name="alert" size={20} /><div><span>{t.metricOpenIssues}</span><strong>{openReportsCount}</strong><small>{t.unresolvedReports}</small></div></div>
        <div className={`insight-item ${fatigueAlerts.length > 0 ? 'insight-warning' : ''}`}><Icon name="activity" size={20} /><div><span>{t.metricFatigueAlerts}</span><strong>{fatigueAlerts.length}</strong><small>{t.overThreshold}</small></div></div>
      </section>

      <section className="panel" aria-labelledby="fatigue-heading">
        <div className="panel-header-with-action"><div><span className="section-kicker">01</span><h3 id="fatigue-heading" className="panel-title">{t.fatigueTitle}</h3><p className="panel-subtext">{t.fatigueDescription}</p></div><div className="threshold-control"><label htmlFor="fatigue-threshold-input" className="input-label">{t.fatigueThreshold}</label><div className="threshold-input"><input id="fatigue-threshold-input" type="number" min="40" max="70" step="2" className="number-input-sm" value={fatigueThreshold} onChange={(e) => setFatigueThreshold(Math.min(70, Math.max(40, Number(e.target.value) || 40)))} /><span>{t.hoursWeek}</span></div></div></div>
        <div className="fatigue-alerts-feed">
          {fatigueAlerts.map((alert) => <article key={alert.workerId} className={`fatigue-alert-card ${alert.severity === 'critical' ? 'severity-critical' : 'severity-warning'}`}><div className="alert-top-row"><div><strong className="alert-worker-name">{alert.workerName}</strong><span className="worksite-pill"><Icon name="map-pin" size={14} /> {alert.worksite}</span></div><div className="alert-badge-group"><span className={`severity-badge ${alert.severity === 'critical' ? 'critical-badge' : 'warning-badge'}`}>{alert.severity === 'critical' ? t.critical : t.elevatedHours}</span><span className="hours-stat">{alert.totalHours}h / {t.week}</span></div></div><div className="recommendation-box"><Icon name="wrench" size={17} /><p><strong>{t.actionRequired}</strong> {alert.recommendation}</p></div></article>)}
          {fatigueAlerts.length === 0 && <div className="empty-state-success"><Icon name="check" size={18} /> {t.noFatigueAlerts}</div>}
        </div>
      </section>

      <section className="panel" aria-labelledby="triage-heading">
        <div className="panel-header-with-action"><div><span className="section-kicker">02</span><h3 id="triage-heading" className="panel-title">{t.triageTitle}</h3><p className="panel-subtext">{t.triageDescription}</p></div><div className="filter-controls-row"><select className="select-input select-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label={t.filterCategory}><option value="all">{t.filterAll}</option><option value="safety_hazard">{t.catHazard}</option><option value="wage_concern">{t.catWage}</option><option value="working_conditions">{t.catConditions}</option><option value="harassment">{t.catHarassment}</option></select><select className="select-input select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label={t.filterStatus}><option value="all">{t.filterStatusAll}</option><option value="submitted">{t.statusSubmitted}</option><option value="under_review">{t.statusUnderReview}</option><option value="action_taken">{t.statusActionTaken}</option><option value="resolved">{t.statusResolved}</option></select></div></div>
        <div className="triage-table-wrapper"><table className="triage-table"><caption className="sr-only">{t.triageTitle}</caption><thead><tr><th>{t.refCode}</th><th>{t.worksite}</th><th>{t.reportCategory}</th><th>{t.summaryPrivacy}</th><th>{t.status}</th><th>{t.action}</th></tr></thead><tbody>
          {filteredReports.map((report) => <tr key={report.id} className={report.urgent ? 'urgent-row' : ''}><td className="font-mono text-sm font-semibold"><span className="reference-cell">{report.referenceCode}</span>{isSampleReport(report) && <span className="meta-tag">Sample</span>}{report.urgent && <span className="urgent-badge-sm">{t.urgent}</span>}</td><td className="text-sm">{report.worksite}</td><td><span className="category-pill">{getCategoryLabel(report.category)}</span></td><td><div className="triage-title-cell"><strong>{report.title}</strong><span className="reporter-privacy-sub">{report.isAnonymous ? <><Icon name="lock" size={13} /> {t.anonymousReporter}</> : <><Icon name="user" size={13} /> {report.reporterName}</>} · {report.createdAt}</span></div></td><td>{getStatusBadge(report.status)}</td><td><button type="button" className="secondary-btn btn-sm" onClick={() => { setActiveReport(report); setSelectedNewStatus(report.status === 'resolved' ? 'resolved' : 'under_review'); setResolutionNote('') }}><Icon name="wrench" size={15} /> {t.updateStatusBtn}</button></td></tr>)}
          {filteredReports.length === 0 && <tr><td colSpan={6} className="empty-table">{t.noMatchingReports}</td></tr>}
        </tbody></table></div>
      </section>

      {activeReport && (
        <div
          ref={reportDialogRef}
          tabIndex={-1}
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="manage-report-title"
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3 id="manage-report-title" className="modal-title">
                <Icon name="wrench" size={20} /> {t.manageIncident}{' '}
                <span className="font-mono">{activeReport.referenceCode}</span>
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveReport(null)}
                aria-label={t.closeModal}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="incident-summary-box">
                <h4>{activeReport.title}</h4>
                <p className="text-sm text-secondary mt-1">{activeReport.description}</p>
                <div className="incident-meta-tags mt-2">
                  <span className="meta-tag"><Icon name="map-pin" size={14} /> {activeReport.worksite}</span>
                  <span className="meta-tag">{getCategoryLabel(activeReport.category)}</span>
                  <span className="meta-tag">
                    <Icon name="lock" size={14} />{' '}
                    {activeReport.isAnonymous ? t.anonymousReporter : activeReport.reporterName}
                  </span>
                </div>
              </div>
              <form onSubmit={handleSaveStatusUpdate} className="modal-form">
                <div className="form-field">
                  <label htmlFor="new-status-select" className="input-label">{t.newStatus}</label>
                  <select
                    id="new-status-select"
                    className="select-input"
                    value={selectedNewStatus}
                    onChange={(event) => setSelectedNewStatus(event.target.value as ReportStatus)}
                  >
                    <option value="under_review">{t.statusUnderReview}</option>
                    <option value="action_taken">{t.statusActionTaken}</option>
                    <option value="resolved">{t.statusResolved}</option>
                    <option value="submitted">{t.statusSubmitted}</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="operator-name-input" className="input-label">{t.operatorName}</label>
                  <input
                    id="operator-name-input"
                    type="text"
                    required
                    className="text-input"
                    value={operatorName}
                    onChange={(event) => setOperatorName(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="resolution-note-textarea" className="input-label">{t.resolutionNotes}</label>
                  <textarea
                    id="resolution-note-textarea"
                    rows={4}
                    required
                    placeholder={t.resolutionNotePlaceholder}
                    className="textarea-input"
                    value={resolutionNote}
                    onChange={(event) => setResolutionNote(event.target.value)}
                  />
                </div>
                <div className="modal-actions-row">
                  <button type="button" className="secondary-btn" onClick={() => setActiveReport(null)}>
                    {t.closeModal}
                  </button>
                  <button type="submit" className="primary-btn">
                    <Icon name="check" size={17} /> {t.saveStatusUpdate}
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
