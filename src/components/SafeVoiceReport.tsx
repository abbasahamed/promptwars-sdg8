import React, { useState } from 'react'
import type { ReportCategory, ReportPriority, Industry, Language, GrievanceReport } from '../types'
import { translations } from '../i18n/translations'
import { submitReport, getReportsForWorker } from '../services/storageService'

interface SafeVoiceReportProps {
  industry: Industry
  language: Language
}

export const SafeVoiceReport: React.FC<SafeVoiceReportProps> = ({
  industry,
  language,
}) => {
  const t = translations[language]

  // Form states
  const [category, setCategory] = useState<ReportCategory>('safety_hazard')
  const [priority, setPriority] = useState<ReportPriority>('high')
  const [worksite, setWorksite] = useState<string>(
    industry === 'construction' ? 'Metro Tower - Sector 4 Scaffolding' : 'Science Block C - Chemical Storage'
  )
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reporterName, setReporterName] = useState<string>('')
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true)
  const [urgent, setUrgent] = useState<boolean>(false)
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null)

  // Report feed
  const [reports, setReports] = useState<GrievanceReport[]>(() => getReportsForWorker(industry))

  const worksitePresets =
    industry === 'construction'
      ? [
          'Metro Tower - Sector 4 Scaffolding',
          'Tower A - Level 6 Concrete Pour',
          'Reinforcement Steel Yard',
          'Temporary Power Substation 2',
          'Basement Excavation Trench B',
        ]
      : [
          'Science Block C - Chemical Storage',
          'Girls Hostel Block 3 - Corridor',
          'Central Dining Hall & Kitchens',
          'Auditorium Complex',
          'Engineering Electrical Sub-panel',
        ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    const newRep = submitReport({
      industry,
      worksite: worksite.trim() || worksitePresets[0],
      category,
      priority: urgent ? 'critical' : priority,
      title: title.trim(),
      description: description.trim(),
      isAnonymous,
      reporterName: isAnonymous ? undefined : reporterName.trim() || 'Worker',
      urgent,
    })

    setSubmissionFeedback(newRep.referenceCode)
    setTitle('')
    setDescription('')
    setUrgent(false)

    // Refresh list
    setReports(getReportsForWorker(industry))
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
    <div className="feature-container" id="safevoice-reporting-section">
      <div className="feature-header">
        <div>
          <h2 className="feature-title">🛡️ {t.safeVoiceTitle}</h2>
          <p className="feature-subtitle">{t.safeVoiceSubtitle}</p>
        </div>
      </div>

      <div className="safevoice-layout">
        {/* Left column: Incident Filing Form */}
        <div className="panel card form-panel">
          <h3 className="panel-title">📝 {t.newReportTitle}</h3>

          {submissionFeedback && (
            <div className="alert-banner alert-success" role="alert">
              <span>✅ {t.reportSuccessAlert}</span>
              <strong className="font-mono text-lg">{submissionFeedback}</strong>
              <button
                type="button"
                className="close-alert-btn"
                onClick={() => setSubmissionFeedback(null)}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-field">
              <label htmlFor="report-cat-select" className="input-label">
                {t.reportCategory} *
              </label>
              <select
                id="report-cat-select"
                className="select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
              >
                <option value="safety_hazard">⚠️ {t.catHazard}</option>
                <option value="wage_concern">💵 {t.catWage}</option>
                <option value="working_conditions">🌡️ {t.catConditions}</option>
                <option value="harassment">⚖️ {t.catHarassment}</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="report-site-select" className="input-label">
                {t.worksiteLocation} *
              </label>
              <select
                id="report-site-select"
                className="select-input"
                value={worksite}
                onChange={(e) => setWorksite(e.target.value)}
              >
                {worksitePresets.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="report-title-input" className="input-label">
                {t.issueTitle} *
              </label>
              <input
                id="report-title-input"
                type="text"
                required
                maxLength={100}
                placeholder="E.g. Loose scaffolding clamps on Level 4 after rain"
                className="text-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="report-desc-input" className="input-label">
                {t.issueDescription} *
              </label>
              <textarea
                id="report-desc-input"
                required
                rows={4}
                maxLength={600}
                placeholder="Describe what occurred, hazards observed, or wage details. Do not enter sensitive passwords or personal biometric details."
                className="textarea-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Anonymous Toggle & Privacy Notice */}
            <div className="privacy-card">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span className="checkbox-text font-semibold">{t.anonymousToggle}</span>
              </label>

              {!isAnonymous && (
                <div className="form-field mt-2">
                  <label htmlFor="reporter-name-input" className="input-label">
                    Your Name (Optional contact reference)
                  </label>
                  <input
                    id="reporter-name-input"
                    type="text"
                    className="text-input text-sm"
                    placeholder="Enter your name or leave blank"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                  />
                </div>
              )}

              <p className="privacy-disclosure-text">
                🔒 <strong>Privacy Architecture:</strong> {t.anonymousNotice}
              </p>
            </div>

            <div className="form-field-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                />
                <span className="checkbox-text text-amber font-semibold">
                  🚨 {t.urgentFlag}
                </span>
              </label>

              <div className="priority-select-wrapper">
                <label htmlFor="priority-select" className="text-xs text-secondary mr-2">
                  Priority:
                </label>
                <select
                  id="priority-select"
                  className="select-input select-sm"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ReportPriority)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <button type="submit" className="primary-btn btn-lg w-full">
              🚀 {t.submitReportBtn}
            </button>
          </form>
        </div>

        {/* Right column: Tracked Reports Feed */}
        <div className="panel card feed-panel">
          <div className="feed-header">
            <h3 className="panel-title">📋 {t.myReportsTitle}</h3>
            <span className="count-badge">{reports.length} Reports Tracked</span>
          </div>

          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-card-top">
                  <div className="ref-and-badge">
                    <span className="ref-code font-mono">{report.referenceCode}</span>
                    {getStatusBadge(report.status)}
                    {report.urgent && <span className="urgent-badge">URGENT</span>}
                  </div>
                  <span className="report-date text-xs text-secondary">{report.createdAt}</span>
                </div>

                <h4 className="report-title">{report.title}</h4>
                <p className="report-desc">{report.description}</p>

                <div className="report-meta">
                  <span className="meta-tag">🏷️ {getCategoryLabel(report.category)}</span>
                  <span className="meta-tag">📍 {report.worksite}</span>
                  {report.isAnonymous ? (
                    <span className="meta-tag anonymous-tag">🛡️ {t.anonymousBadge}</span>
                  ) : (
                    <span className="meta-tag">👤 {report.reporterName || 'Worker'}</span>
                  )}
                </div>

                {/* Audit & Action Updates */}
                {report.history && report.history.length > 0 && (
                  <div className="report-history">
                    <span className="history-header">{t.updatesHistory}:</span>
                    <ul className="history-list">
                      {report.history.map((h, i) => (
                        <li key={i} className="history-item">
                          <span className="history-bullet">•</span>
                          <div className="history-content">
                            <div className="history-meta">
                              <strong className="status-label">{h.status}</strong> by{' '}
                              <em>{h.updatedBy}</em> on {h.timestamp}
                            </div>
                            <p className="history-note">{h.note}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {reports.length === 0 && (
              <div className="empty-state">
                <p>{t.noReportsYet}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
