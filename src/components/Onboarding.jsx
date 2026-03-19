import { useState } from 'react';
import './Onboarding.css';

export default function Onboarding({ onNext }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [platform, setPlatform] = useState('');

  const isValid = name.trim() && city && platform;

  return (
    <div className="screen-enter container">
      {/* Logo & Branding */}
      <div className="onboarding-header">
        <div className="logo-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 className="onboarding-title">GigShield <span>AI</span></h1>
        <p className="onboarding-subtitle">Protect Your Weekly Income</p>
        <p className="onboarding-desc">
          AI-powered parametric insurance for gig delivery workers. Get covered against rain, heat, floods & more.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="feature-pills">
        <span className="pill">🌧️ Rain Cover</span>
        <span className="pill">🌡️ Heat Shield</span>
        <span className="pill">⚡ Instant Payout</span>
        <span className="pill">🤖 AI-Powered</span>
      </div>

      {/* Form */}
      <div className="onboarding-form">
        <div className="input-group">
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="city">City</label>
          <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select your city</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Pune">Pune</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="platform">Delivery Platform</label>
          <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">Select your platform</option>
            <option value="Swiggy">Swiggy</option>
            <option value="Zomato">Zomato</option>
            <option value="Blinkit">Blinkit</option>
            <option value="Zepto">Zepto</option>
            <option value="Dunzo">Dunzo</option>
            <option value="BigBasket">BigBasket</option>
          </select>
        </div>

        <button
          className={`btn btn-primary ${!isValid ? 'btn-disabled' : ''}`}
          disabled={!isValid}
          onClick={() => onNext({ name, city, platform })}
        >
          Get Started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <p className="onboarding-footer">
        By continuing, you agree to our Terms of Service
      </p>
    </div>
  );
}
