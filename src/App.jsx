import { useState } from 'react';
import './App.css';
import Onboarding from './components/Onboarding';
import PremiumCalculation from './components/PremiumCalculation';
import ActiveCoverage from './components/ActiveCoverage';
import DisruptionAlert from './components/DisruptionAlert';
import PayoutSuccess from './components/PayoutSuccess';

const SCREENS = {
  ONBOARDING: 'onboarding',
  PREMIUM: 'premium',
  DASHBOARD: 'dashboard',
  DISRUPTION: 'disruption',
  PAYOUT: 'payout',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.ONBOARDING);
  const [userData, setUserData] = useState(null);
  const [riskData, setRiskData] = useState(null);

  const handleOnboardingNext = (data) => {
    setUserData(data);
    setScreen(SCREENS.PREMIUM);
  };

  const handlePremiumNext = (risk) => {
    setRiskData(risk);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleDisruption = () => {
    setScreen(SCREENS.DISRUPTION);
  };

  const handleProcessClaim = () => {
    setScreen(SCREENS.PAYOUT);
  };

  const handleRestart = () => {
    setUserData(null);
    setRiskData(null);
    setScreen(SCREENS.ONBOARDING);
  };

  return (
    <div className="app-wrapper" key={screen}>
      {screen === SCREENS.ONBOARDING && (
        <Onboarding onNext={handleOnboardingNext} />
      )}
      {screen === SCREENS.PREMIUM && (
        <PremiumCalculation userData={userData} onNext={handlePremiumNext} />
      )}
      {screen === SCREENS.DASHBOARD && (
        <ActiveCoverage userData={userData} riskData={riskData} onNext={handleDisruption} />
      )}
      {screen === SCREENS.DISRUPTION && (
        <DisruptionAlert userData={userData} onNext={handleProcessClaim} />
      )}
      {screen === SCREENS.PAYOUT && (
        <PayoutSuccess userData={userData} riskData={riskData} onRestart={handleRestart} />
      )}
    </div>
  );
}
