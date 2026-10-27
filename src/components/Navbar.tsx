import React from 'react'
import type { Role, Industry } from '../types'
import { translations } from '../i18n/translations'
import { Icon } from './Icon'

interface NavbarProps {
  role: Role
  setRole: (r: Role) => void
  industry: Industry
  setIndustry: (i: Industry) => void
  onResetData: () => void
  onOpenAdoptionGuide: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  industry,
  setIndustry,
  onResetData,
  onOpenAdoptionGuide,
}) => {
  const t = translations.en

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-group">
          <div className="brand-logo">
            <span className="logo-mark"><Icon name="shield" size={22} /></span>
            <div>
              <span className="brand-name">{t.appTitle}</span>
              <span className="brand-edition">{t.appTagline}</span>
            </div>
          </div>
          <span className="sdg-pill" title={t.sdgBadge}>
            <span className="sdg-number">8</span> {t.sdgBadge}
          </span>
        </div>

        <div className="header-primary-controls">
          <div className="role-switch-container">
            <span className="role-label">{t.switchRole}:</span>
            <div className="segmented-control" role="group" aria-label={t.switchRole}>
              <button
                type="button"
                aria-pressed={role === 'worker'}
                className={`segmented-btn ${role === 'worker' ? 'selected worker-theme' : ''}`}
                onClick={() => setRole('worker')}
              >
                <Icon name="user" size={17} /> {t.roleWorkerShort}
              </button>
              <button
                type="button"
                aria-pressed={role === 'employer'}
                className={`segmented-btn ${role === 'employer' ? 'selected employer-theme' : ''}`}
                onClick={() => setRole('employer')}
              >
                <Icon name="building" size={17} /> {t.roleEmployerShort}
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="header-bottom-row">
        <div className="industry-switch-container">
          <span className="role-label">{t.selectIndustry}:</span>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${industry === 'construction' ? 'selected' : ''}`}
              onClick={() => setIndustry('construction')}
            >
              <Icon name="hammer" size={17} /> {t.industryConstructionShort}
            </button>
            <button
              type="button"
              className={`segmented-btn ${industry === 'campus' ? 'selected' : ''}`}
              onClick={() => setIndustry('campus')}
            >
              <Icon name="graduation" size={17} /> {t.industryCampusShort}
            </button>
          </div>
        </div>
        <div className="header-controls" aria-label={t.navCrossIndustry}>
          <button type="button" className="secondary-btn btn-sm utility-btn" onClick={onOpenAdoptionGuide}>
            <Icon name="book" size={16} /> {t.navCrossIndustry}
          </button>
          <button type="button" className="secondary-btn btn-sm utility-btn" onClick={onResetData} title={t.resetDataBtn}>
            <Icon name="refresh" size={16} /> {t.resetDataBtn}
          </button>
        </div>
      </div>
    </header>
  )
}
