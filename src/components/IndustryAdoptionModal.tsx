import React from 'react'
import { translations } from '../i18n/translations'
import { Icon } from './Icon'

interface IndustryAdoptionModalProps {
  onClose: () => void
}

export const IndustryAdoptionModal: React.FC<IndustryAdoptionModalProps> = ({
  onClose,
}) => {
  const t = translations.en

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="adoption-dialog-title">
      <div className="modal-card adoption-modal-card">
        <div className="modal-header">
          <div>
            <h3 id="adoption-dialog-title" className="modal-title"><Icon name="globe" size={20} /> {t.crossTitle}</h3>
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
                <span className="col-icon"><Icon name="hammer" size={24} /></span>
                <div>
                  <h4 className="col-title">{t.adoptionConstructionTitle}</h4>
                  <span className="col-tag">{t.adoptionConstructionTag}</span>
                </div>
              </div>

              <div className="col-section">
                <h5>{t.adoptionChallenges}</h5>
                <ul className="bullet-list">
                  <li>{t.adoptionConstructionChallenge1}</li>
                  <li>{t.adoptionConstructionChallenge2}</li>
                  <li>{t.adoptionConstructionChallenge3}</li>
                </ul>
              </div>

              <div className="col-section">
                <h5>{t.adoptionDeployment}</h5>
                <ul className="bullet-list">
                  <li>{t.adoptionConstructionDeployment1}</li>
                  <li>{t.adoptionConstructionDeployment2}</li>
                  <li>{t.adoptionConstructionDeployment3}</li>
                </ul>
              </div>
            </div>

            {/* Campus Facilities Blueprint */}
            <div className="industry-col-card">
              <div className="col-header">
                <span className="col-icon"><Icon name="graduation" size={24} /></span>
                <div>
                  <h4 className="col-title">{t.adoptionCampusTitle}</h4>
                  <span className="col-tag">{t.adoptionCampusTag}</span>
                </div>
              </div>

              <div className="col-section">
                <h5>{t.adoptionChallenges}</h5>
                <ul className="bullet-list">
                  <li>{t.adoptionCampusChallenge1}</li>
                  <li>{t.adoptionCampusChallenge2}</li>
                  <li>{t.adoptionCampusChallenge3}</li>
                </ul>
              </div>

              <div className="col-section">
                <h5>{t.adoptionDeployment}</h5>
                <ul className="bullet-list">
                  <li>{t.adoptionCampusDeployment1}</li>
                  <li>{t.adoptionCampusDeployment2}</li>
                  <li>{t.adoptionCampusDeployment3}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SDG 8 Alignment Matrix */}
          <div className="sdg-matrix-card mt-4">
            <h4 className="matrix-title"><Icon name="activity" size={18} /> {t.adoptionMatrixTitle}</h4>
            <div className="matrix-table-wrap">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>{t.adoptionTarget}</th>
                    <th>{t.adoptionDescription}</th>
                    <th>{t.adoptionImplementation}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-primary">Target 8.3</td>
                    <td>{t.adoptionTarget83Description}</td>
                    <td>{t.adoptionTarget83Implementation}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-primary">Target 8.5</td>
                    <td>{t.adoptionTarget85Description}</td>
                    <td>{t.adoptionTarget85Implementation}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-primary">Target 8.8</td>
                    <td>{t.adoptionTarget88Description}</td>
                    <td>{t.adoptionTarget88Implementation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-actions-row mt-4">
            <button type="button" className="primary-btn w-full" onClick={onClose}>
              {t.adoptionReturn}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
