import React from 'react';

function TopBar({ currentStep, totalSteps, onBack }) {
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div style={{ width: '100%' }}>
            {/* Progress Bar Line */}
            <div className="progress-container">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Header Layout */}
            <div className="app-header">
                <div style={{ width: '50px' }}>
                    {onBack && (
                        <button className="back-btn" onClick={onBack}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="logo-center">
                    <span className="logo-icon">A</span>
                    AstroWhere
                </div>

                <div style={{ width: '50px', textAlign: 'right' }}>
                    <span className="progress-text">{currentStep}/{totalSteps}</span>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
