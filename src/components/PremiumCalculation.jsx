import { useEffect, useState } from 'react';
import './PremiumCalculation.css';

const RISK_DATA = {
  Chennai:   { level: 'High',   premium: 35, coverage: 500, color: 'danger',  factors: ['Monsoon risk', 'Flood-prone zones', 'High humidity'] },
  Mumbai:    { level: 'High',   premium: 32, coverage: 480, color: 'danger',  factors: ['Heavy rainfall', 'Urban flooding', 'Traffic disruptions'] },
  Delhi:     { level: 'Medium', premium: 25, coverage: 400, color: 'warning', factors: ['AQI extremes', 'Heatwaves', 'Smog disruptions'] },
  Bangalore: { level: 'Low',    premium: 18, coverage: 350, color: 'success', factors: ['Moderate climate', 'Low flood risk', 'Stable conditions'] },
  Hyderabad: { level: 'Medium', premium: 22, coverage: 380, color: 'warning', factors: ['Seasonal rain', 'Heat spikes', 'Traffic blocks'] },
  Kolkata:   { level: 'High',   premium: 30, coverage: 450, color: 'danger',  factors: ['Cyclone zone', 'Waterlogging', 'Heavy monsoons'] },
  Pune:      { level: 'Low',    premium: 15, coverage: 300, color: 'success', factors: ['Mild weather', 'Low disruption', 'Stable terrain'] },
};

export default function PremiumCalculation({ userData, onNext }) {
  const [animPhase, setAnimPhase] = useState(0); // 0=loading, 1=reveal
  const risk = RISK_DATA[userData.city] || RISK_DATA['Chennai'];

  useEffect(() => {
    const t = setTimeout(() => setAnimPhase(1), 1800);
    return () => clearTimeout(t);
  }, []);

  if (animPhase === 0) {
    return (
      <div className="screen-enter container premium-loading">
        <div className="ai-spinner">
          <div className="spinner-ring" />
          <svg className="spinner-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h2a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a4 4 0 0 1 4-4h2V9.4A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/>
          </svg>
        </div>
        <p className="loading-text">AI is analyzing risk for <strong>{userData.city}</strong></p>
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
        <p className="loading-sub">Checking weather patterns, flood history, AQI data...</p>
      </div>
    );
  }

  return (
    <div className="screen-enter container">
      <div className="premium-header">
        <span className="badge badge-primary">🤖 AI-Calculated Premium</span>
        <h2>Your Coverage Plan</h2>
        <p className="premium-worker">
          {userData.name} · {userData.platform} · {userData.city}
        </p>
      </div>

      {/* Risk Level Card */}
      <div className={`card premium-risk-card risk-${risk.color}`}>
        <div className="risk-row">
          <span className="risk-label">Risk Level</span>
          <span className={`badge badge-${risk.color}`}>
            {risk.level === 'High' ? '🔴' : risk.level === 'Medium' ? '🟡' : '🟢'} {risk.level} Risk
          </span>
        </div>
        <div className="risk-factors">
          {risk.factors.map((f, i) => (
            <span key={i} className="risk-factor">{f}</span>
          ))}
        </div>
      </div>

      {/* Premium Details */}
      <div className="premium-grid">
        <div className="card premium-amount-card">
          <div className="premium-icon">💰</div>
          <span className="premium-label">Weekly Premium</span>
          <span className="premium-value">₹{risk.premium}</span>
          <span className="premium-period">/week</span>
        </div>
        <div className="card premium-amount-card">
          <div className="premium-icon">🛡️</div>
          <span className="premium-label">Max Coverage</span>
          <span className="premium-value">₹{risk.coverage}</span>
          <span className="premium-period">per event</span>
        </div>
      </div>

      {/* What's Covered */}
      <div className="card covered-card">
        <h4>What's Covered</h4>
        <div className="covered-list">
          <div className="covered-item"><span>🌧️</span> Heavy Rainfall</div>
          <div className="covered-item"><span>🌡️</span> Extreme Heat</div>
          <div className="covered-item"><span>🌫️</span> Air Pollution</div>
          <div className="covered-item"><span>🌊</span> Flood Alerts</div>
          <div className="covered-item"><span>🚫</span> Curfew / Strikes</div>
          <div className="covered-item"><span>🚗</span> Traffic Blocks</div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => onNext(risk)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Activate Insurance — ₹{risk.premium}/week
      </button>
    </div>
  );
}
