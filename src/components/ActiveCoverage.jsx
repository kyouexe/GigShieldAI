import { useState, useEffect } from 'react';
import './ActiveCoverage.css';

export default function ActiveCoverage({ userData, riskData, onNext }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  const daysLeft = Math.ceil((endOfWeek - today) / (1000 * 60 * 60 * 24));

  const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="screen-enter container">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-greeting">
          <h2>Hi, {userData.name} 👋</h2>
          <p>{userData.platform} · {userData.city}</p>
        </div>
        <div className="badge badge-success">● Active</div>
      </div>

      {/* Status Card */}
      <div className="card dash-status-card">
        <div className="status-shield">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <div className="status-text">
          <h3>Coverage Active</h3>
          <p>You're protected this week</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dash-stats">
        <div className="card stat-card">
          <span className="stat-icon">🛡️</span>
          <span className="stat-label">Coverage</span>
          <span className="stat-value">₹{riskData.coverage}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">📅</span>
          <span className="stat-label">Days Left</span>
          <span className="stat-value">{daysLeft}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">💰</span>
          <span className="stat-label">Premium</span>
          <span className="stat-value">₹{riskData.premium}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">⚡</span>
          <span className="stat-label">Risk</span>
          <span className="stat-value">{riskData.level}</span>
        </div>
      </div>

      {/* Validity */}
      <div className="card validity-card">
        <div className="validity-row">
          <span className="validity-label">Valid From</span>
          <span className="validity-value">{formatDate(today)}</span>
        </div>
        <div className="validity-divider" />
        <div className="validity-row">
          <span className="validity-label">Valid Until</span>
          <span className="validity-value">{formatDate(endOfWeek)}</span>
        </div>
      </div>

      {/* Monitor Section */}
      <div className="card monitor-card">
        <div className="monitor-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Live Monitoring</span>
        </div>
        <div className="monitor-status">
          <div className="monitor-dot" />
          <span>No disruptions detected in your area</span>
        </div>
        <p className="monitor-time">Last checked: {time.toLocaleTimeString('en-IN')}</p>
      </div>

      {/* Simulate Button */}
      <button className="btn btn-warning" onClick={onNext}>
        ⚡ Simulate Disruption
      </button>
      <p className="simulate-note">For demo: triggers a heavy rain event</p>
    </div>
  );
}
