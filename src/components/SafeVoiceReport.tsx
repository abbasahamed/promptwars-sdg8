import React, { useState } from 'react'
import type { ReportCategory, ReportPriority, Industry, GrievanceReport } from '../types'
import { translations } from '../i18n/translations'
import { submitReport, getReportsForWorker } from '../services/storageService'
import { Icon } from './Icon'

interface SafeVoiceReportProps { industry: Industry }

export const SafeVoiceReport: React.FC<SafeVoiceReportProps> = ({ industry }) => {
  const t = translations.en
  const [category, setCategory] = useState<ReportCategory>('safety_hazard')
  const [priority, setPriority] = useState<ReportPriority>('high')
  const [worksite, setWorksite] = useState(industry === 'construction' ? 'Metro Tower - Sector 4 Scaffolding' : 'Science Block C - Chemical Storage')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [urgent, setUrgent] = useState(false)
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [reports, setReports] = useState<GrievanceReport[]>(() => getReportsForWorker(industry))

  const worksitePresets = industry === 'construction'
    ? ['Metro Tower - Sector 4 Scaffolding', 'Tower A - Level 6 Concrete Pour', 'Reinforcement Steel Yard', 'Temporary Power Substation 2', 'Basement Excavation Trench B']
    : ['Science Block C - Chemical Storage', 'Girls Hostel Block 3 - Corridor', 'Central Dining Hall & Kitchens', 'Auditorium Complex', 'Engineering Electrical Sub-panel']

  const getStatusBadge = (status: GrievanceReport['status']) => {
    const labels = { submitted: t.statusSubmitted, under_review: t.statusUnderReview, action_taken: t.statusActionTaken, resolved: t.statusResolved }
    return <span className={`status-pill status-${status === 'under_review' ? 'review' : status === 'action_taken' ? 'action' : status}`}>{status === 'resolved' && <Icon name="check" size={14} />} {labels[status]}</span>
  }

  const getCategoryLabel = (cat: ReportCategory) => ({ safety_hazard: t.catHazard, harassment: t.catHarassment, wage_concern: t.catWage, working_conditions: t.catConditions })[cat]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setFormError(t.requiredReportFields)
      return
    }
    setFormError(null)
    const newReport = submitReport({
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
    setSubmissionFeedback(newReport.referenceCode)
    setTitle('')
    setDescription('')
    setUrgent(false)
    setReports((current) => [newReport, ...current])
  }

  return (
    <div className="feature-container" id="safevoice-reporting-section">
      <div className="feature-header">
        <div className="title-block">
          <span className="eyebrow"><Icon name="shield" size={15} /> {t.navSafeVoice}</span>
          <h2 className="feature-title">{t.safeVoiceTitle}</h2>
          <p className="feature-subtitle">{t.safeVoiceSubtitle}</p>
        </div>
        <div className="trust-note"><Icon name="lock" size={16} /> {t.localDemoNotice}</div>
      </div>

      <div className="safevoice-layout">
        <section className="panel form-panel" aria-labelledby="new-report-heading">
          <div className="panel-heading"><div><span className="section-kicker">01</span><h3 id="new-report-heading" className="panel-title">{t.newReportTitle}</h3></div><Icon name="file" size={20} className="panel-icon" /></div>
          {submissionFeedback && <div className="alert-banner alert-success" role="status"><span><Icon name="check" size={17} /> {t.reportSuccessAlert}</span><strong className="font-mono">{submissionFeedback}</strong><button type="button" className="close-alert-btn" onClick={() => setSubmissionFeedback(null)} aria-label={t.dismiss}><Icon name="close" size={18} /></button></div>}
          {formError && <div id="report-form-error" className="alert-banner alert-error" role="alert"><Icon name="alert" size={17} /> {formError}</div>}

          <form onSubmit={handleSubmit} className="report-form" noValidate>
            <div className="form-field"><label htmlFor="report-cat-select" className="input-label">{t.reportCategory} <span aria-hidden="true">*</span></label><select id="report-cat-select" className="select-input" value={category} onChange={(e) => setCategory(e.target.value as ReportCategory)}><option value="safety_hazard">{t.catHazard}</option><option value="wage_concern">{t.catWage}</option><option value="working_conditions">{t.catConditions}</option><option value="harassment">{t.catHarassment}</option></select></div>
            <div className="form-field"><label htmlFor="report-site-select" className="input-label">{t.worksiteLocation} <span aria-hidden="true">*</span></label><select id="report-site-select" className="select-input" value={worksite} onChange={(e) => setWorksite(e.target.value)}>{worksitePresets.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select></div>
            <div className="form-field"><label htmlFor="report-title-input" className="input-label">{t.issueTitle} <span aria-hidden="true">*</span></label><input id="report-title-input" type="text" required maxLength={100} placeholder={t.issueTitlePlaceholder} className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} aria-describedby={formError ? 'report-form-error' : undefined} /></div>
            <div className="form-field"><label htmlFor="report-desc-input" className="input-label">{t.issueDescription} <span aria-hidden="true">*</span></label><textarea id="report-desc-input" required rows={5} maxLength={600} placeholder={t.issueDescriptionPlaceholder} className="textarea-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>

            <div className="privacy-card">
              <label className="checkbox-label"><input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} /><span className="checkbox-text font-semibold">{t.anonymousToggle}</span></label>
              {!isAnonymous && <div className="form-field mt-2"><label htmlFor="reporter-name-input" className="input-label">{t.reporterNameOptional}</label><input id="reporter-name-input" type="text" className="text-input" placeholder={t.namePlaceholder} value={reporterName} onChange={(e) => setReporterName(e.target.value)} /></div>}
              <p className="privacy-disclosure-text"><Icon name="info" size={15} /> {t.anonymousNotice}</p>
            </div>

            <div className="form-field-row"><label className="checkbox-label"><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} /><span className="checkbox-text warning-text">{t.urgentFlag}</span></label><div className="priority-select-wrapper"><label htmlFor="priority-select" className="input-label">{t.priority}</label><select id="priority-select" className="select-input select-sm" value={priority} onChange={(e) => setPriority(e.target.value as ReportPriority)}><option value="low">{t.priorityLow}</option><option value="medium">{t.priorityMedium}</option><option value="high">{t.priorityHigh}</option><option value="critical">{t.priorityCritical}</option></select></div></div>
            <button type="submit" className="primary-btn btn-lg w-full"><Icon name="check" size={18} /> {t.submitReportBtn}</button>
          </form>
        </section>

        <section className="panel feed-panel" aria-labelledby="my-reports-heading">
          <div className="panel-header-with-action"><div><span className="section-kicker">02</span><h3 id="my-reports-heading" className="panel-title">{t.myReportsTitle}</h3></div><span className="count-badge">{reports.length} {t.tracked}</span></div>
          <div className="reports-list">
            {reports.map((report) => <article key={report.id} className={`report-card ${report.urgent ? 'report-card-urgent' : ''}`}>
              <div className="report-card-top"><div className="ref-and-badge"><span className="ref-code font-mono">{report.referenceCode}</span>{(report.id.startsWith('rep-con-') || report.id.startsWith('rep-cmp-')) && <span className="meta-tag">Sample report</span>}{getStatusBadge(report.status)}{report.urgent && <span className="urgent-badge"><Icon name="alert" size={13} /> {t.urgent}</span>}</div><span className="report-date">{report.createdAt}</span></div>
              <h4 className="report-title">{report.title}</h4><p className="report-desc">{report.description}</p>
              <div className="report-meta"><span className="meta-tag"><Icon name="file" size={14} /> {getCategoryLabel(report.category)}</span><span className="meta-tag"><Icon name="map-pin" size={14} /> {report.worksite}</span>{report.isAnonymous ? <span className="meta-tag anonymous-tag"><Icon name="lock" size={14} /> {t.anonymousBadge}</span> : <span className="meta-tag"><Icon name="user" size={14} /> {report.reporterName || t.workerFallback}</span>}</div>
              {report.history && report.history.length > 0 && <div className="report-history"><span className="history-header">{t.updatesHistory}</span><ul className="history-list">{report.history.map((history, index) => <li key={index} className="history-item"><span className="history-bullet"><Icon name="chevron-right" size={14} /></span><div><div className="history-meta"><strong>{history.status}</strong> · {history.updatedBy} · {history.timestamp}</div><p className="history-note">{history.note}</p></div></li>)}</ul></div>}
            </article>)}
            {reports.length === 0 && <div className="empty-state"><Icon name="file" size={24} /><p>{t.noReportsYet}</p></div>}
          </div>
        </section>
      </div>
    </div>
  )
}
