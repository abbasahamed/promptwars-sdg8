import { useState, useEffect } from 'react'
import type { Role, Industry } from './types'
import { translations } from './i18n/translations'
import { initializeStorage, resetToDefaultSeed } from './services/storageService'
import { Navbar } from './components/Navbar'
import { TransparentPay } from './components/TransparentPay'
import { SafeVoiceReport } from './components/SafeVoiceReport'
import { EmployerDashboard } from './components/EmployerDashboard'
import { IndustryAdoptionModal } from './components/IndustryAdoptionModal'
import { Icon } from './components/Icon'
import { useDialogAccessibility } from './hooks/useDialogAccessibility'
import './App.css'

export default function App() {
  const [role, setRole] = useState<Role>('worker')
  const [industry, setIndustry] = useState<Industry>('construction')
  const [workerTab, setWorkerTab] = useState<'pay' | 'safevoice'>('pay')
  const [showAdoptionGuide, setShowAdoptionGuide] = useState<boolean>(false)
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false)
  const [storageVersion, setStorageVersion] = useState<number>(1)
  const resetDialogRef = useDialogAccessibility(showResetConfirm, () => setShowResetConfirm(false))

  // Initialize demo data on load
  useEffect(() => {
    initializeStorage()
  }, [])

  const t = translations.en

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
                <Icon name="wallet" size={18} /> {t.navPay}
              </button>
              <button
                type="button"
                className={`tab-btn ${workerTab === 'safevoice' ? 'active' : ''}`}
                onClick={() => setWorkerTab('safevoice')}
              >
                <Icon name="shield" size={18} /> {t.navSafeVoice}
              </button>
            </div>

            {workerTab === 'pay' ? (
              <TransparentPay industry={industry} />
            ) : (
              <SafeVoiceReport industry={industry} />
            )}
          </div>
        )}

        {/* Employer / Admin Interface */}
        {role === 'employer' && (
          <div className="employer-view-container">
          <EmployerDashboard industry={industry} />
          </div>
        )}
      </main>

      {/* Cross-Industry Blueprint Modal */}
      {showAdoptionGuide && (
        <IndustryAdoptionModal
          onClose={() => setShowAdoptionGuide(false)}
        />
      )}

      {/* Reset Demo Data Confirmation Modal */}
      {showResetConfirm && (
         <div ref={resetDialogRef} tabIndex={-1} className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title">
           <div className="modal-card modal-sm">
             <div className="modal-header">
            <h3 id="reset-dialog-title" className="modal-title"><Icon name="refresh" size={20} /> {t.resetDataBtn}</h3>
               <button
                 type="button"
                 className="modal-close-btn"
                 onClick={() => setShowResetConfirm(false)}
                 aria-label={t.closeModal}
               >
                 <Icon name="close" size={20} />
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
                  {t.confirmReset}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Footer */}
      <footer className="app-footer">
        <div className="footer-content">
           <div className="footer-left"><strong>FairShift</strong> — {t.footerBuilt}</div>
           <div className="footer-right">
             <span>{t.footerSdg}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
