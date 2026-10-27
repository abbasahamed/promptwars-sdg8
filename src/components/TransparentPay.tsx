import React, { useState } from 'react'
import type { WorkerProfile, DeductionItem, Language, Industry } from '../types'
import { calculatePay } from '../utils/payCalculator'
import { translations } from '../i18n/translations'
import { getWorkers } from '../services/storageService'

interface TransparentPayProps {
  industry: Industry
  language: Language
  onHoursUpdated?: (workerId: string, reg: number, ot: number) => void
}

export const TransparentPay: React.FC<TransparentPayProps> = ({
  industry,
  language,
}) => {
  const t = translations[language]
  const workers = getWorkers(industry)

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || '')
  const [workerName, setWorkerName] = useState<string>(workers[0]?.name || '')
  const [payPeriod, setPayPeriod] = useState<string>('Weekly Cycle: Oct 20 - Oct 26, 2026')
  const [hourlyRate, setHourlyRate] = useState<number>(workers[0]?.hourlyRate || 180)
  const [regularHours, setRegularHours] = useState<number>(workers[0]?.loggedRegularHours || 40)
  const [overtimeHours, setOvertimeHours] = useState<number>(workers[0]?.loggedOvertimeHours || 8)
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(workers[0]?.overtimeMultiplier || 1.5)
  const [deductions, setDeductions] = useState<DeductionItem[]>(workers[0]?.deductions || [])

  // Custom deduction modal / inline state
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

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const w = workers.find((item) => item.id === e.target.value)
    if (w) {
      loadWorkerProfile(w)
    }
  }

  const handleAddDeduction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeductionLabel.trim() || Number(newDeductionAmount) <= 0) return

    const newItem: DeductionItem = {
      id: `ded-${Date.now()}`,
      label: newDeductionLabel.trim(),
      amount: Math.round(Number(newDeductionAmount) * 100) / 100,
      category: 'other',
    }

    setDeductions([...deductions, newItem])
    setNewDeductionLabel('')
    setNewDeductionAmount('')
  }

  const handleRemoveDeduction = (id: string) => {
    setDeductions(deductions.filter((d) => d.id !== id))
  }

  // Calculate live pay results
  const payResult = calculatePay({
    workerName,
    payPeriod,
    hourlyRate,
    regularHours,
    overtimeHours,
    overtimeMultiplier,
    deductions,
  })

  return (
    <div className="feature-container" id="transparent-pay-section">
      <div className="feature-header">
        <div>
          <h2 className="feature-title">💰 {t.payTitle}</h2>
          <p className="feature-subtitle">{t.paySubtitle}</p>
        </div>
        <div className="preset-picker-card">
          <label htmlFor="worker-preset-select" className="input-label">
            {t.loadPreset}:
          </label>
          <select
            id="worker-preset-select"
            value={selectedWorkerId}
            onChange={handleSelectPreset}
            className="select-input"
          >
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.roleTitle} - {w.worksite})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="calculator-layout">
        {/* Input Parameters Form */}
        <div className="panel card form-panel">
          <h3 className="panel-title">⚙️ Shift Parameters & Agreed Rates</h3>

          <div className="form-group-grid">
            <div className="form-field">
              <label htmlFor="worker-name-input" className="input-label">
                {t.workerName}
              </label>
              <input
                id="worker-name-input"
                type="text"
                className="text-input"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="pay-period-input" className="input-label">
                {t.payPeriod}
              </label>
              <input
                id="pay-period-input"
                type="text"
                className="text-input"
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="hourly-rate-input" className="input-label">
                {t.hourlyRate}
              </label>
              <input
                id="hourly-rate-input"
                type="number"
                min="0"
                step="5"
                className="text-input"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div className="form-field">
              <label htmlFor="regular-hours-input" className="input-label">
                {t.regularHours}
              </label>
              <input
                id="regular-hours-input"
                type="number"
                min="0"
                max="80"
                step="1"
                className="text-input"
                value={regularHours}
                onChange={(e) => setRegularHours(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div className="form-field">
              <label htmlFor="overtime-hours-input" className="input-label">
                {t.overtimeHours}
              </label>
              <input
                id="overtime-hours-input"
                type="number"
                min="0"
                max="50"
                step="0.5"
                className="text-input"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div className="form-field">
              <label htmlFor="ot-multiplier-select" className="input-label">
                {t.otMultiplier}
              </label>
              <select
                id="ot-multiplier-select"
                className="select-input"
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
              >
                <option value={1.5}>1.5× (Standard Shift Overtime)</option>
                <option value={2.0}>2.0× (Weekend / Statutory Holiday)</option>
                <option value={1.0}>1.0× (Straight Rate)</option>
              </select>
            </div>
          </div>

          {/* Itemized Deductions Section */}
          <div className="deductions-container">
            <div className="deductions-header">
              <span className="input-label font-semibold">{t.itemizedDeductions}</span>
              <span className="deduction-count">({deductions.length} recorded)</span>
            </div>

            <div className="deduction-tags-list">
              {deductions.map((d) => (
                <div key={d.id} className="deduction-tag">
                  <span className="deduction-name">{d.label}</span>
                  <span className="deduction-amt">₹{d.amount.toFixed(2)}</span>
                  <button
                    type="button"
                    className="tag-remove-btn"
                    onClick={() => handleRemoveDeduction(d.id)}
                    title="Remove deduction"
                    aria-label={`Remove deduction ${d.label}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {deductions.length === 0 && (
                <p className="empty-subtext">No deductions recorded. All earnings pass to gross pay.</p>
              )}
            </div>

            {/* Add Custom Deduction Form */}
            <form onSubmit={handleAddDeduction} className="add-deduction-row">
              <input
                type="text"
                placeholder="Deduction reason (e.g. Advance repayment)"
                className="text-input text-sm flex-2"
                value={newDeductionLabel}
                onChange={(e) => setNewDeductionLabel(e.target.value)}
              />
              <input
                type="number"
                placeholder="₹ Amount"
                className="text-input text-sm flex-1"
                min="0"
                step="10"
                value={newDeductionAmount}
                onChange={(e) => setNewDeductionAmount(e.target.value)}
              />
              <button type="submit" className="primary-btn btn-sm">
                {t.addDeduction}
              </button>
            </form>
          </div>
        </div>

        {/* Real-time Calculation Summary & Formula Breakdown */}
        <div className="panel card results-panel">
          <h3 className="panel-title">🧾 Transparent Pay Summary</h3>

          <div className="metrics-summary-grid">
            <div className="metric-box">
              <span className="metric-label">{t.regularEarnings}</span>
              <span className="metric-val text-primary">₹{payResult.regularPay.toFixed(2)}</span>
              <span className="metric-sub">{regularHours} hrs @ ₹{hourlyRate}/hr</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">{t.overtimeEarnings}</span>
              <span className="metric-val text-amber">₹{payResult.overtimePay.toFixed(2)}</span>
              <span className="metric-sub">{overtimeHours} hrs @ {overtimeMultiplier}×</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">{t.grossPay}</span>
              <span className="metric-val text-indigo">₹{payResult.grossPay.toFixed(2)}</span>
              <span className="metric-sub">Before deductions</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">{t.totalDeductions}</span>
              <span className="metric-val text-rose">-₹{payResult.totalDeductions.toFixed(2)}</span>
              <span className="metric-sub">{deductions.length} approved items</span>
            </div>
          </div>

          {/* Highlight Net Take-Home Pay */}
          <div className="net-pay-banner">
            <div>
              <span className="net-pay-label">{t.netTakeHome}</span>
              <p className="net-pay-sub">Payable directly to {workerName}</p>
            </div>
            <div className="net-pay-figure">
              ₹{payResult.netPay.toFixed(2)}
            </div>
          </div>

          {/* Transparent Mathematical Formula Breakdown */}
          <div className="formula-accordion">
            <button
              type="button"
              className="accordion-toggle"
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            >
              <span>📐 {t.formulaExplanation}</span>
              <span>{showFormulaDetails ? '▲ Hide' : '▼ View Breakdown'}</span>
            </button>

            {showFormulaDetails && (
              <div className="formula-steps-list">
                {payResult.steps.map((step, idx) => (
                  <div key={idx} className="step-row">
                    <div className="step-name-col">
                      <span className="step-badge">{idx + 1}</span>
                      <span className="step-name">{step.step}</span>
                    </div>
                    <div className="step-calc-col">
                      <span className="step-formula font-mono">{step.formula}</span>
                      <span className="step-calc font-mono">{step.calculation}</span>
                    </div>
                    <div className="step-result-col font-mono font-semibold">
                      = ₹{step.result.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clear Statutory Disclaimer */}
          <div className="notice-box">
            <div className="notice-header">
              <span>⚠️</span>
              <strong>{t.payDisclaimerTitle}</strong>
            </div>
            <p className="notice-text">{t.payDisclaimerText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
