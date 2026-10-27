import { useState, useEffect } from 'react'
import type { Role, Industry, Language } from './types'
import { translations } from './i18n/translations'
import { initializeStorage, resetToDefaultSeed } from './services/storageService'
import { Navbar } from './components/Navbar'
import { TransparentPay } from './components/TransparentPay'
import { SafeVoiceReport } from './components/SafeVoiceReport'
import { EmployerDashboard } from './components/EmployerDashboard'
import { IndustryAdoptionModal } from './components/IndustryAdoptionModal'
import './App.css'

export default function App() {
  const [role, setRole] = useState<Role>('worker')
  const [industry, setIndustry] = useState<Industry>('construction')
  const [language, setLanguage] = useState<Language>('en')
  const [workerTab, setWorkerTab] = useState<'pay' | 'safevoice'>('pay')
  const [showAdoptionGuide, setShowAdoptionGuide] = useState<boolean>(false)
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false)
  const [storageVersion, setStorageVersion] = useState<number>(1)

  // Initialize demo data on load
  useEffect(() => {
    initializeStorage()
  }, [])

  const t = translations[language]

  const handleResetData = () => {
    resetToDefaultSeed()
    setStorageVersion((v) => v + 1)
    setShowResetConfirm(false)
  }

  return (
    <div className="app-root">
      <Navbar
        role={role}
        setRole={setRole}
        industry={industry}
        setIndustry={setIndustry}
        language={language}
        setLanguage={setLanguage}
        onResetData={() => setShowResetConfirm(true)}
        onOpenAdoptionGuide={() => setShowAdoptionGuide(true)}
      />

      <main className="main-content" key={`${industry}-${storageVersion}`}>
        {/* Worker Interface */}
        {role === 'worker' && (
          <div className="worker-view-container">
            {/* Worker Sub-navigation */}
            <div className="worker-tab-bar">
              <button
                type="button"
                className={`tab-btn ${workerTab === 'pay' ? 'active' : ''}`}
                onClick={() => setWorkerTab('pay')}
              >
                💰 {t.navPay}
              </button>
              <button
                type="button"
                className={`tab-btn ${workerTab === 'safevoice' ? 'active' : ''}`}
                onClick={() => setWorkerTab('safevoice')}
              >
                🛡️ {t.navSafeVoice}
              </button>
            </div>

            {workerTab === 'pay' ? (
              <TransparentPay industry={industry} language={language} />
            ) : (
              <SafeVoiceReport industry={industry} language={language} />
            )}
          </div>
        )}

        {/* Employer / Admin Interface */}
        {role === 'employer' && (
          <div className="employer-view-container">
            <EmployerDashboard industry={industry} language={language} />
          </div>
        )}
      </main>

      {/* Cross-Industry Blueprint Modal */}
      {showAdoptionGuide && (
        <IndustryAdoptionModal
          language={language}
          onClose={() => setShowAdoptionGuide(false)}
        />
      )}

      {/* Reset Demo Data Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">⚠️ Reset Demo Data</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowResetConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="text-secondary">{t.resetConfirm}</p>
              <div className="modal-actions-row mt-4">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-btn btn-danger"
                  onClick={handleResetData}
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <strong>FairShift</strong> — Built for PromptWars × ACM SRM Student Chapter (2026)
          </div>
          <div className="footer-right">
            <span>UN Sustainable Development Goal 8 • Decent Work & Economic Growth</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
