import React from 'react';

function MultiSelectPill({ label, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '12px 20px',
                borderRadius: '30px',
                background: selected ? 'rgba(86, 113, 255, 0.15)' : 'var(--bg-card)',
                border: `1px solid ${selected ? 'var(--accent-main)' : 'transparent'}`,
                color: selected ? 'white' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                margin: '6px'
            }}
        >
            {selected && <span style={{ marginRight: '8px', color: 'var(--accent-main)' }}>✓</span>}
            {label}
        </div>
    );
}

export default MultiSelectPill;
