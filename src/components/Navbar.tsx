import React from 'react'
import type { Role, Industry, Language } from '../types'
import { translations } from '../i18n/translations'

interface NavbarProps {
  role: Role
  setRole: (r: Role) => void
  industry: Industry
  setIndustry: (i: Industry) => void
  language: Language
  setLanguage: (l: Language) => void
  onResetData: () => void
  onOpenAdoptionGuide: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  industry,
  setIndustry,
  language,
  setLanguage,
  onResetData,
  onOpenAdoptionGuide,
}) => {
  const t = translations[language]

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-group">
          <div className="brand-logo">
            <span className="logo-shield">⚖️</span>
            <div>
              <span className="brand-name">{t.appTitle}</span>
              <span className="brand-edition">PromptWars 2026</span>
            </div>
          </div>
          <span className="sdg-pill" title="UN SDG 8: Decent Work & Inclusive Economic Growth">
            🎯 {t.sdgBadge}
          </span>
        </div>

        <div className="header-controls">
          {/* Language Selector */}
          <div className="control-capsule">
            <span className="capsule-label">🌐</span>
            <button
              type="button"
              className={`pill-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={`pill-btn ${language === 'ta' ? 'active' : ''}`}
              onClick={() => setLanguage('ta')}
              aria-label="Switch to Tamil"
            >
              தமிழ்
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            type="button"
            className="secondary-btn btn-sm"
            onClick={onResetData}
            title={t.resetDataBtn}
          >
            🔄 {t.resetDataBtn}
          </button>

          {/* Adoption Guide Trigger */}
          <button
            type="button"
            className="secondary-btn btn-sm"
            onClick={onOpenAdoptionGuide}
          >
            📘 {t.navCrossIndustry}
          </button>
        </div>
      </div>

      <div className="header-bottom-row">
        {/* Role Toggle */}
        <div className="role-switch-container">
          <span className="role-label">{t.switchRole}:</span>
          <div className="segmented-control" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'worker'}
              className={`segmented-btn ${role === 'worker' ? 'selected worker-theme' : ''}`}
              onClick={() => setRole('worker')}
            >
              👷 {t.roleWorker}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'employer'}
              className={`segmented-btn ${role === 'employer' ? 'selected employer-theme' : ''}`}
              onClick={() => setRole('employer')}
            >
              🏢 {t.roleEmployer}
            </button>
          </div>
        </div>

        {/* Industry Switcher */}
        <div className="industry-switch-container">
          <span className="role-label">{t.selectIndustry}:</span>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${industry === 'construction' ? 'selected' : ''}`}
              onClick={() => setIndustry('construction')}
            >
              🏗️ {t.industryConstruction}
            </button>
            <button
              type="button"
              className={`segmented-btn ${industry === 'campus' ? 'selected' : ''}`}
              onClick={() => setIndustry('campus')}
            >
              🎓 {t.industryCampus}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
