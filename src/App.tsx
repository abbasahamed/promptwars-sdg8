import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString()
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container">
      <header className="header">
        <div className="badge">PromptWars × ACM SRM Student Chapter</div>
        <h1 className="title">SDG 8 Hackathon Workspace</h1>
        <p className="subtitle">
          United Nations Sustainable Development Goal 8: Decent Work & Economic Growth
        </p>
      </header>

      <main className="main-card">
        <div className="status-banner">
          <span className="status-dot"></span>
          <div>
            <strong>Status:</strong> Official Problem Statement Pending
          </div>
        </div>

        <p className="status-description">
          The exact problem statement and challenge specifications will be revealed at the
          hackathon kickoff. No challenge solution or speculative domain logic has been
          pre-built.
        </p>

        <div className="grid">
          <div className="card">
            <h3>Hackathon Setup</h3>
            <p className="card-value">Ready for ~3h Sprint</p>
            <p className="card-detail">Minimal, lightweight React + TS + Vite starter</p>
          </div>

          <div className="card">
            <h3>Environment</h3>
            <p className="card-value">MacBook Air M4</p>
            <p className="card-detail">Node.js, npm, Vite HMR, and TypeScript verified</p>
          </div>

          <div className="card">
            <h3>Target Theme</h3>
            <p className="card-value">UN SDG 8</p>
            <p className="card-detail">Decent work, inclusive economic growth, and employment</p>
          </div>

          <div className="card">
            <h3>Local Clock</h3>
            <p className="card-value mono">{currentTime}</p>
            <p className="card-detail">React state & runtime active</p>
          </div>
        </div>

        <div className="checklist">
          <h3>Pre-Flight Checklist</h3>
          <ul>
            <li>✅ Repository initialized under 10 MB limit</li>
            <li>✅ Production build (`npm run build`) passing</li>
            <li>✅ TypeScript strict type-checking (`npm run typecheck`) passing</li>
            <li>✅ Linter (`npm run lint`) passing</li>
            <li>⏳ Awaiting official prompt announcement</li>
          </ul>
        </div>
      </main>

      <footer className="footer">
        <p>Prepared for PromptWars × ACM SRM Student Chapter</p>
      </footer>
    </div>
  )
}
