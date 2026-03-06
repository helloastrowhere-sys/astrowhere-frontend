import { useState } from 'react';
import './index.css';

// We'll import these new components next
import TopBar from './components/TopBar';
import QuizEngine from './components/QuizEngine';
import ResultsPage from './components/ResultsPage';
import PaymentPage from './components/PaymentPage';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [astroData, setAstroData] = useState(null);
  const totalSteps = 12; // 1-10: Quiz, 11: Payment, 12: Results

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  return (
    <div className="app-container">
      {currentStep <= 10 && (
        <TopBar
          currentStep={currentStep}
          totalSteps={10} // Bar only shows progress for the quiz part
          onBack={currentStep > 1 ? handleBack : null}
        />
      )}

      {currentStep <= 10 && (
        <QuizEngine
          currentStep={currentStep}
          onNext={handleNext}
          setAstroData={setAstroData}
        />
      )}

      {currentStep === 11 && (
        <PaymentPage onPaymentSuccess={handleNext} />
      )}

      {currentStep === 12 && (
        <ResultsPage astroData={astroData} />
      )}
    </div>
  );
}

export default App;
