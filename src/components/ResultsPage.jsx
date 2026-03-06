import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function ResultsPage({ astroData }) {
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!astroData || !astroData.calculated_positions) {
        return (
            <div className="step-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Sonuçlar yüklenemedi. Lütfen tekrar deneyin.</p>
            </div>
        );
    }

    const { 'Güneş (Sun) Boylamı': sunLongitude, 'Venüs (Aşk Hattı) Boylamı': venusLongitude } = astroData.calculated_positions;

    return (
        <div className="slide-in-right" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', padding: '24px 16px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '32px' }}
            >
                <h1 className="step-title" style={{ fontSize: '2rem', color: '#5671FF', marginBottom: '8px' }}>
                    Yıldız Haritanız Hazır
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Mükemmel enerjilerin kesiştiği noktalar tespit edildi.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '2rem', marginRight: '16px' }}>☀️</span>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>Güneş Hattı (Kariyer & Güç)</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Boylam: {sunLongitude}°</p>
                    </div>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                    Güneş hattınızın gectiği coğrafyalar, size en yüksek yaşam enerjisini, kariyer başarısını ve kendini gerçekleştirme fırsatını sunar. Bu bölgelerde parlayabilirsiniz.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', marginBottom: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '2rem', marginRight: '16px' }}>💖</span>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>Venüs Hattı (Aşk & Uyum)</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Boylam: {venusLongitude}°</p>
                    </div>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
                    Venüs hattınızın izleri, ruh eşinizi bulabileceğiniz, sanatsal ilhamınızın zirveye çıkacağı ve kendinizi en huzurlu hissedeceğiniz yerleri gösterir.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: animationComplete ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ marginTop: 'auto', textAlign: 'center' }}
            >
                <button className="btn-continue" onClick={() => alert("Premium modele geçildiğinde detaylı dünya haritası açılacak.")}>
                    Detaylı Haritamı İncele
                </button>
            </motion.div>
        </div>
    );
}

export default ResultsPage;
