import React from 'react';

function OptionCard({ icon, label, selected, onClick }) {
    return (
        <div
            className={`element-card ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="element-icon-circle">
                <span className="element-icon">{icon}</span>
            </div>
            <span className="element-label">{label}</span>
        </div>
    );
}

export default OptionCard;
