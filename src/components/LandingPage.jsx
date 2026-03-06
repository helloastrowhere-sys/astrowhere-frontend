import React from 'react';

function LandingPage({ onStart }) {
    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            paddingBottom: '20px'
        }}>

            {/* Header Area */}
            <div style={{ textAlign: 'center', marginTop: '40px' }} className="delay-1">
                <h2 style={{ color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    Welcome to
                </h2>
                <h1 style={{
                    fontSize: '3rem',
                    margin: '10px 0',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(255,215,0,0.3)'
                }}>
                    AstroWhere
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '80%', margin: '0 auto' }}>
                    Discover the cosmic coordinates where you truly belong.
                </p>
            </div>

            {/* Center Image/Icon Area */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="delay-2">
                <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    {/* Abstract Star Compass */}
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        <circle cx="12" cy="12" r="10" opacity="0.3"></circle>
                        <path d="M12 2v20 M2 12h20" opacity="0.3"></path>
                    </svg>

                    {/* Orbit rings */}
                    <div style={{
                        position: 'absolute', width: '240px', height: '240px',
                        border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%',
                        animation: 'spin 60s linear infinite'
                    }} />
                </div>
            </div>

            {/* Bottom CTA Area */}
            <div className="glass-panel delay-3">
                <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Where is your destiny?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
                    Using ancient astrocartography, we map your unique planetary lines across the globe to reveal where you will find love, success, and spiritual peace.
                </p>
                <button className="btn-primary" onClick={onStart}>
                    Calculate Destiny
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </div>

        </div>
    );
}

export default LandingPage;
