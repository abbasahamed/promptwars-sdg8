import React, { useState } from 'react'
import type { WorkerProfile, DeductionItem, Industry } from '../types'
import { calculatePay, normalizePayInput } from '../utils/payCalculator'
import { translations } from '../i18n/translations'
import { getWorkers } from '../services/storageService'
import { Icon } from './Icon'
import { formatCurrency } from '../utils/formatCurrency'

interface TransparentPayProps {
  industry: Industry
}

export const TransparentPay: React.FC<TransparentPayProps> = ({ industry }) => {
  const t = translations.en
  const workers = getWorkers(industry)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || '')
  const [workerName, setWorkerName] = useState<string>(workers[0]?.name || '')
  const [payPeriod, setPayPeriod] = useState<string>('Weekly cycle: Oct 20 – Oct 26, 2026')
  const [hourlyRate, setHourlyRate] = useState<number>(workers[0]?.hourlyRate || 180)
  const [regularHours, setRegularHours] = useState<number>(workers[0]?.loggedRegularHours || 40)
  const [overtimeHours, setOvertimeHours] = useState<number>(workers[0]?.loggedOvertimeHours || 8)
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(workers[0]?.overtimeMultiplier || 1.5)
  const [deductions, setDeductions] = useState<DeductionItem[]>(workers[0]?.deductions || [])
  const [newDeductionLabel, setNewDeductionLabel] = useState<string>('')
  const [newDeductionAmount, setNewDeductionAmount] = useState<string>('')
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(true)

  const loadWorkerProfile = (worker: WorkerProfile) => {
    setSelectedWorkerId(worker.id)
    setWorkerName(worker.name)
    setHourlyRate(worker.hourlyRate)
    setRegularHours(worker.loggedRegularHours)
    setOvertimeHours(worker.loggedOvertimeHours)
    setOvertimeMultiplier(worker.overtimeMultiplier)
    setDeductions(worker.deductions || [])
  }

  const handleAddDeduction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeductionLabel.trim() || !Number.isFinite(Number(newDeductionAmount)) || Number(newDeductionAmount) <= 0) return
    setDeductions([
      ...deductions,
      {
        id: `ded-${Date.now()}`,
        label: newDeductionLabel.trim(),
        amount: Math.round(Number(newDeductionAmount) * 100) / 100,
        category: 'other',
      },
    ])
    setNewDeductionLabel('')
    setNewDeductionAmount('')
  }

  const normalizedPayInput = normalizePayInput({
    workerName,
    payPeriod,
    hourlyRate,
    regularHours,
    overtimeHours,
    overtimeMultiplier,
    deductions,
  })
  const payResult = calculatePay(normalizedPayInput)

  return (
    <div className="feature-container" id="transparent-pay-section">
      <div className="feature-header">
        <div className="title-block">
          <span className="eyebrow"><Icon name="wallet" size={15} /> {t.navPay}</span>
          <h2 className="feature-title">{t.payTitle}</h2>
          <p className="feature-subtitle">{t.paySubtitle}</p>
        </div>
        <div className="preset-picker-card">
          <label htmlFor="worker-preset-select" className="input-label">{t.loadPreset}</label>
          <select
            id="worker-preset-select"
            value={selectedWorkerId}
            onChange={(e) => {
              const worker = workers.find((item) => item.id === e.target.value)
              if (worker) loadWorkerProfile(worker)
            }}
            className="select-input"
          >
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>{worker.name} · {worker.roleTitle}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="context-line">
        <span className="context-dot" />
        <strong>{industry === 'construction' ? t.industryConstruction : t.industryCampus}</strong>
        <span>·</span>
        <span>{workers.find((worker) => worker.id === selectedWorkerId)?.worksite}</span>
      </div>

      <div className="calculator-layout pay-workspace">
        <section className="panel form-panel" aria-labelledby="pay-inputs-heading">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">01</span>
              <h3 id="pay-inputs-heading" className="panel-title">{t.shiftRatesTitle}</h3>
            </div>
            <Icon name="sliders" size={20} className="panel-icon" />
          </div>

          <div className="form-group-grid">
            <div className="form-field">
              <label htmlFor="worker-name-input" className="input-label">{t.workerName}</label>
              <input id="worker-name-input" type="text" className="text-input" value={workerName} onChange={(e) => setWorkerName(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="pay-period-input" className="input-label">{t.payPeriod}</label>
              <input id="pay-period-input" type="text" className="text-input" value={payPeriod} onChange={(e) => setPayPeriod(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="hourly-rate-input" className="input-label">{t.hourlyRate}</label>
              <input id="hourly-rate-input" type="number" min="0" step="5" className="text-input" value={hourlyRate} onChange={(e) => setHourlyRate(Math.min(1_000_000, Math.max(0, Number(e.target.value) || 0)))} max="1000000" />
            </div>
            <div className="form-field">
              <label htmlFor="regular-hours-input" className="input-label">{t.regularHours}</label>
              <input id="regular-hours-input" type="number" min="0" max="80" step="1" className="text-input" value={regularHours} onChange={(e) => setRegularHours(Math.min(80, Math.max(0, Number(e.target.value) || 0)))} />
            </div>
            <div className="form-field">
              <label htmlFor="overtime-hours-input" className="input-label">{t.overtimeHours}</label>
              <input id="overtime-hours-input" type="number" min="0" max="50" step="0.5" className="text-input" value={overtimeHours} onChange={(e) => setOvertimeHours(Math.min(50, Math.max(0, Number(e.target.value) || 0)))} />
            </div>
            <div className="form-field">
              <label htmlFor="ot-multiplier-select" className="input-label">{t.otMultiplier}</label>
              <select id="ot-multiplier-select" className="select-input" value={overtimeMultiplier} onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}>
                <option value={1.5}>1.5×</option>
                <option value={2.0}>2.0×</option>
                <option value={1.0}>1.0×</option>
              </select>
            </div>
          </div>

          <div className="deductions-container">
            <div className="deductions-header">
              <div>
                <span className="section-kicker">02</span>
                <span className="input-label font-semibold">{t.itemizedDeductions}</span>
              </div>
              <span className="deduction-count">{deductions.length} {t.recordedItems}</span>
            </div>
            <div className="deduction-tags-list">
              {deductions.map((deduction) => (
                <div key={deduction.id} className="deduction-tag">
                  <span className="deduction-name">{deduction.label}</span>
                  <span className="deduction-amt">−{formatCurrency(deduction.amount)}</span>
                  <button type="button" className="tag-remove-btn" onClick={() => setDeductions(deductions.filter((item) => item.id !== deduction.id))} title={t.removeDeduction} aria-label={`${t.removeDeduction}: ${deduction.label}`}>
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              ))}
              {deductions.length === 0 && <p className="empty-subtext">{t.noDeductions}</p>}
            </div>
            <form onSubmit={handleAddDeduction} className="add-deduction-row">
              <label className="sr-only" htmlFor="new-deduction-label">{t.deductionReason}</label>
              <input id="new-deduction-label" type="text" placeholder={t.deductionReason} className="text-input flex-2" value={newDeductionLabel} onChange={(e) => setNewDeductionLabel(e.target.value)} />
              <label className="sr-only" htmlFor="new-deduction-amount">{t.amount}</label>
              <input id="new-deduction-amount" type="number" placeholder={t.amount} className="text-input flex-1" min="0" max="1000000000" step="0.01" value={newDeductionAmount} onChange={(e) => setNewDeductionAmount(e.target.value)} />
              <button type="submit" className="secondary-btn"><Icon name="plus" size={16} /> {t.addDeduction}</button>
            </form>
          </div>
        </section>

        <section className="panel results-panel" aria-labelledby="pay-summary-heading">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">03</span>
              <h3 id="pay-summary-heading" className="panel-title">{t.summaryTitle}</h3>
            </div>
            <Icon name="receipt" size={20} className="panel-icon" />
          </div>

          <dl className="pay-breakdown">
            <div className="pay-row"><dt>{t.regularEarnings}<small>{normalizedPayInput.regularHours} hrs × {formatCurrency(normalizedPayInput.hourlyRate)}/hr</small></dt><dd>{formatCurrency(payResult.regularPay)}</dd></div>
            <div className="pay-row"><dt>{t.overtimeEarnings}<small>{normalizedPayInput.overtimeHours} hrs × {normalizedPayInput.overtimeMultiplier}×</small></dt><dd>{formatCurrency(payResult.overtimePay)}</dd></div>
            <div className="pay-row"><dt>{t.grossPay}<small>{t.beforeDeductions}</small></dt><dd>{formatCurrency(payResult.grossPay)}</dd></div>
            <div className="pay-row deduction-row"><dt>{t.totalDeductions}<small>{deductions.length} {t.approvedItems}</small></dt><dd>−{formatCurrency(payResult.totalDeductions)}</dd></div>
          </dl>

          {payResult.totalDeductions > payResult.grossPay && <div className="alert-banner alert-error" role="alert">Deductions exceed gross earnings. Net pay is shown as ₹0; verify the entered deductions.</div>}

          <div className="net-pay-banner">
            <div>
              <span className="net-pay-label">{t.netTakeHome}</span>
              <p className="net-pay-sub">{t.payableTo} {workerName || t.workerName}</p>
            </div>
            <div className="net-pay-figure">{formatCurrency(payResult.netPay)}</div>
          </div>

          <div className="formula-accordion">
            <button type="button" className="accordion-toggle" onClick={() => setShowFormulaDetails(!showFormulaDetails)} aria-expanded={showFormulaDetails}>
              <span><Icon name="activity" size={17} /> {t.formulaExplanation}</span>
              <span className="accordion-action">{showFormulaDetails ? t.hide : t.viewBreakdown} <Icon name="chevron-down" size={16} /></span>
            </button>
            {showFormulaDetails && <div className="formula-steps-list">
              {payResult.steps.map((step, idx) => (
                <div key={idx} className="step-row">
                  <span className="step-badge">{idx + 1}</span>
                  <div className="step-calc-col"><strong>{step.step}</strong><span className="step-formula">{step.formula}</span><span className="step-calc">{step.calculation}</span></div>
                  <strong className="step-result-col">{formatCurrency(step.result)}</strong>
                </div>
              ))}
            </div>}
          </div>

          <div className="notice-box" role="note">
            <div className="notice-header"><Icon name="info" size={17} /><strong>{t.payDisclaimerTitle}</strong></div>
            <p className="notice-text">{t.payDisclaimerText}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
