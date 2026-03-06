import React, { useState } from 'react';

function BirthForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        city: '',
        date: '',
        time: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (formData.city && formData.date) {
            onSubmit(formData);
        }
    };

    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            paddingTop: '30px'
        }}>

            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Step 1</h2>
                <h1 style={{ fontSize: '2rem', color: 'var(--accent-gold)' }}>Cosmic Birth Data</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>
                    Exact coordinates and times are required to map your personalized planetary lines.
                </p>
            </div>

            <form onSubmit={handleFormSubmit} className="glass-panel delay-1" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                <div className="input-group">
                    <label className="input-label">Birth City / Country</label>
                    <input
                        type="text"
                        name="city"
                        className="glass-input"
                        placeholder="e.g. Istanbul, Turkey"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </div>

                <div className="row">
                    <div className="col input-group">
                        <label className="input-label">Birth Date</label>
                        <input
                            type="date"
                            name="date"
                            className="glass-input"
                            style={{ colorScheme: 'dark' }} // Makes native calendar icon look better
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col input-group">
                        <label className="input-label">Time</label>
                        <input
                            type="time"
                            name="time"
                            className="glass-input"
                            style={{ colorScheme: 'dark' }}
                            value={formData.time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(160,171,192,0.6)', marginBottom: '16px' }}>
                        🔒 Your data is private and securely processed.
                    </p>
                    <button type="submit" className="btn-primary" disabled={!formData.city || !formData.date}>
                        Analyze Sky Patterns
                    </button>
                </div>

            </form>
        </div>
    );
}

export default BirthForm;
