import React, { useEffect } from 'react';

function HookScreen({ percentage, title, subtitle, onComplete, delay = 3000 }) {

    // Automatically move to the next step after the delay
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, delay);
        return () => clearTimeout(timer);
    }, [delay, onComplete]);

    return (
        <div className="slide-in-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 24px' }}>

            {/* Circular Progress Indicator */}
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '40px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Background Track */}
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="var(--bg-card)"
                        strokeWidth="8"
                    />
                    {/* Progress fill */}
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="var(--accent-main)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(percentage / 100) * 283} 283`}
                        style={{ transition: 'stroke-dasharray 2.5s ease-out' }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
                    %{percentage}
                </div>
            </div>

            <h2 style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '16px' }}>{title}</h2>
            {subtitle && <p style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: '1.5' }}>{subtitle}</p>}

        </div>
    );
}

export default HookScreen;
