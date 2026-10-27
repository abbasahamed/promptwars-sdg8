import React from 'react'
import type { Language } from '../types'
import { translations } from '../i18n/translations'

interface IndustryAdoptionModalProps {
  language: Language
  onClose: () => void
}

export const IndustryAdoptionModal: React.FC<IndustryAdoptionModalProps> = ({
  language,
  onClose,
}) => {
  const t = translations[language]

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card adoption-modal-card">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">🌐 {t.crossTitle}</h3>
            <p className="text-xs text-secondary mt-1">{t.crossSubtitle}</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <div className="modal-body adoption-body">
          <div className="adoption-columns-grid">
            {/* Construction Blueprint */}
            <div className="industry-col-card">
              <div className="col-header">
                <span className="col-icon">🏗️</span>
                <div>
                  <h4 className="col-title">Construction Sites</h4>
                  <span className="col-tag">Civil Engineering & Infrastructure</span>
                </div>
              </div>

              <div className="col-section">
                <h5>Operational Challenges</h5>
                <ul className="bullet-list">
                  <li>Opaque subcontractor wage cuts and unrecorded night concrete pours.</li>
                  <li>Scaffolding collapses, crane rig hazards, and severe heat exhaustion.</li>
                  <li>Migrant workforce with high illiteracy and fear of reporting hazards.</li>
                </ul>
              </div>

              <div className="col-section">
                <h5>FairShift Deployment Model</h5>
                <ul className="bullet-list">
                  <li>
                    <strong>On-Site QR Kiosks:</strong> Audio/Tamil-assisted SafeVoice terminals at timecard gates.
                  </li>
                  <li>
                    <strong>Transparent Pay Slips:</strong> Digital SMS/app proof of regular hours, night OT multiplier, and uniform deposits.
                  </li>
                  <li>
                    <strong>Fatigue Caps (SDG 8.8):</strong> Automated triggers enforcing mandatory rest before heavy machinery operations.
                  </li>
                </ul>
              </div>
            </div>

            {/* Campus Facilities Blueprint */}
            <div className="industry-col-card">
              <div className="col-header">
                <span className="col-icon">🎓</span>
                <div>
                  <h4 className="col-title">College & Campus Facilities</h4>
                  <span className="col-tag">Institutions & Universities</span>
                </div>
              </div>

              <div className="col-section">
                <h5>Operational Challenges</h5>
                <ul className="bullet-list">
                  <li>Housekeeping and sanitation workers face delayed event allowances.</li>
                  <li>Exposed electrical panels and hazardous chemical storage in basements.</li>
                  <li>Fragmented facilities contractors with zero centralized grievance audit.</li>
                </ul>
              </div>

              <div className="col-section">
                <h5>FairShift Deployment Model</h5>
                <ul className="bullet-list">
                  <li>
                    <strong>Campus Administrative Audits:</strong> Direct oversight by university facility deans over contractor rolls.
                  </li>
                  <li>
                    <strong>Whistleblower Anonymity:</strong> Cleaners and mess workers report safety risks without fear of termination.
                  </li>
                  <li>
                    <strong>Shift Fairness:</strong> Real-time tracking of consecutive night sanitation shifts to prevent burnout.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* SDG 8 Alignment Matrix */}
          <div className="sdg-matrix-card mt-4">
            <h4 className="matrix-title">🎯 UN SDG 8 Targets Alignment Matrix</h4>
            <div className="matrix-table-wrap">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>SDG 8 Target</th>
                    <th>Target Description</th>
                    <th>FairShift Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-primary">Target 8.3</td>
                    <td>Formalization of MSMEs & decent job creation</td>
                    <td>Itemized wage breakdowns eliminate unauthorized contractor fee skimming.</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-primary">Target 8.5</td>
                    <td>Full & productive employment with equal pay for equal work</td>
                    <td>Standardized hourly rates and verified overtime multipliers across shifts.</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-primary">Target 8.8</td>
                    <td>Protect labor rights and promote safe working environments</td>
                    <td>Anonymous SafeVoice hazard reporting + automated weekly shift fatigue warning limits.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-actions-row mt-4">
            <button type="button" className="primary-btn w-full" onClick={onClose}>
              Return to FairShift Prototype
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
