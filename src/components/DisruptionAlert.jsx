import { useEffect, useState } from 'react';
import './DisruptionAlert.css';

export default function DisruptionAlert({ userData, onNext }) {
  const [phase, setPhase] = useState(0); // 0=detecting, 1=alert shown

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2200);
    return () => clearTimeout(t);
  }, []);

  if (phase === 0) {
    return (
      <div className="screen-enter container disruption-detecting">
        <div className="detect-pulse-ring">
          <div className="detect-pulse-inner" />
        </div>
        <h3>Scanning for disruptions...</h3>
        <p>Monitoring weather data for {userData.city}</p>
      </div>
    );
  }

  return (
    <div className="screen-enter container">
      {/* Alert Banner */}
      <div className="alert-banner">
        <div className="alert-icon-box">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <span className="badge badge-danger">⚠️ DISRUPTION DETECTED</span>
        <h2>Heavy Rain Alert</h2>
        <p>Delivery disruption detected in your area</p>
      </div>

      {/* Details Card */}
      <div className="card alert-detail-card">
        <div className="alert-detail-row">
          <div className="alert-detail-item">
            <span className="detail-icon">🌧️</span>
            <span className="detail-label">Event Type</span>
            <span className="detail-value">Heavy Rainfall</span>
          </div>
          <div className="alert-detail-item">
            <span className="detail-icon">📊</span>
            <span className="detail-label">Rainfall</span>
            <span className="detail-value highlight">60mm</span>
          </div>
        </div>
        <div className="alert-detail-row">
          <div className="alert-detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-label">Location</span>
            <span className="detail-value">{userData.city}</span>
          </div>
          <div className="alert-detail-item">
            <span className="detail-icon">⏰</span>
            <span className="detail-label">Detected At</span>
            <span className="detail-value">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Threshold Info */}
      <div className="card threshold-card">
        <div className="threshold-bar-wrap">
          <div className="threshold-labels">
            <span>Trigger Threshold: 50mm</span>
            <span className="threshold-actual">Actual: 60mm</span>
          </div>
          <div className="threshold-bar">
            <div className="threshold-fill" />
            <div className="threshold-marker" />
          </div>
        </div>
        <p className="threshold-note">Rainfall exceeded the parametric trigger threshold by 10mm</p>
      </div>

      {/* Claim Status */}
      <div className="card claim-status-card">
        <div className="claim-step done">
          <div className="step-dot" />
          <div className="step-text">
            <span className="step-title">Disruption Verified</span>
            <span className="step-sub">Weather data confirmed</span>
          </div>
          <span className="step-check">✓</span>
        </div>
        <div className="claim-step done">
          <div className="step-dot" />
          <div className="step-text">
            <span className="step-title">Eligibility Confirmed</span>
            <span className="step-sub">Active policy found</span>
          </div>
          <span className="step-check">✓</span>
        </div>
        <div className="claim-step active">
          <div className="step-dot" />
          <div className="step-text">
            <span className="step-title">AI Fraud Check</span>
            <span className="step-sub">Running validation...</span>
          </div>
          <span className="step-spinner" />
        </div>
      </div>

      <button className="btn btn-warning" onClick={onNext}>
        ⚡ Process Claim Now
      </button>
    </div>
  );
}
