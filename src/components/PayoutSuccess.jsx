import { useEffect, useState } from 'react';
import './PayoutSuccess.css';

export default function PayoutSuccess({ userData, riskData, onRestart }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen-enter container payout-screen">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: ['#6C5CE7', '#00b894', '#fdcb6e', '#a29bfe', '#55efc4'][i % 5],
              }}
            />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <div className="payout-hero">
        <div className="success-circle">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="badge badge-success">✅ CLAIM APPROVED</span>
        <h2 className="payout-amount">₹{riskData.coverage} Credited</h2>
        <p className="payout-message">Your income loss has been compensated automatically</p>
      </div>

      {/* Transaction Details */}
      <div className="card payout-details-card">
        <h4>Transaction Details</h4>
        <div className="payout-row">
          <span className="payout-label">Beneficiary</span>
          <span className="payout-val">{userData.name}</span>
        </div>
        <div className="payout-divider" />
        <div className="payout-row">
          <span className="payout-label">Platform</span>
          <span className="payout-val">{userData.platform}</span>
        </div>
        <div className="payout-divider" />
        <div className="payout-row">
          <span className="payout-label">Trigger Event</span>
          <span className="payout-val">Heavy Rainfall (60mm)</span>
        </div>
        <div className="payout-divider" />
        <div className="payout-row">
          <span className="payout-label">Location</span>
          <span className="payout-val">{userData.city}</span>
        </div>
        <div className="payout-divider" />
        <div className="payout-row">
          <span className="payout-label">Payout Amount</span>
          <span className="payout-val payout-highlight">₹{riskData.coverage}</span>
        </div>
        <div className="payout-divider" />
        <div className="payout-row">
          <span className="payout-label">Transaction ID</span>
          <span className="payout-val payout-mono">GS{Date.now().toString().slice(-8)}</span>
        </div>
        <div className="payout-divider" />
        <div className="payout-row">
          <span className="payout-label">Status</span>
          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Completed</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card timeline-card">
        <h4>Claim Timeline</h4>
        <div className="timeline-item">
          <div className="tl-dot tl-done" />
          <div className="tl-content">
            <span className="tl-title">Disruption Detected</span>
            <span className="tl-time">Heavy rain — 60mm recorded</span>
          </div>
        </div>
        <div className="timeline-item">
          <div className="tl-dot tl-done" />
          <div className="tl-content">
            <span className="tl-title">Eligibility Verified</span>
            <span className="tl-time">Active policy confirmed</span>
          </div>
        </div>
        <div className="timeline-item">
          <div className="tl-dot tl-done" />
          <div className="tl-content">
            <span className="tl-title">Fraud Check Passed</span>
            <span className="tl-time">AI validation — Score: 0.02 (Low risk)</span>
          </div>
        </div>
        <div className="timeline-item">
          <div className="tl-dot tl-done tl-success" />
          <div className="tl-content">
            <span className="tl-title tl-title-success">Payout Processed</span>
            <span className="tl-time">₹{riskData.coverage} credited to linked account</span>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onRestart}>
        Back to Home
      </button>
    </div>
  );
}
