import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PaymentPage({ onPaymentSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate a network request for payment
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Wait a moment so the user sees the success checkmark
            setTimeout(() => {
                onPaymentSuccess();
            }, 1200);
        }, 2000);
    };

    return (
        <div className="slide-in-right" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 16px', position: 'relative' }}>

            {/* Header Content */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '24px' }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
                <h1 className="step-title" style={{ fontSize: '1.8rem', color: '#5671FF', marginBottom: '8px' }}>
                    Astro-Lokasyon Haritanız Çözüldü
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>12 sayfalık detaylı analizinize ve haritanıza erişmek için kilidi açın.</p>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                    background: 'var(--bg-card)',
                    padding: '24px',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(86, 113, 255, 0.2)',
                    marginBottom: 'auto'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 600 }}>Tam Erişim</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 500, alignSelf: 'flex-start', marginTop: '4px' }}>₺</span>
                        <span style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>19<span style={{ fontSize: '2rem' }}>.99</span></span>
                    </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {[
                        'Dünya üzerindeki Kariyer & Güç hatlarınız',
                        'Ruh eşinizi bulabileceğiniz Venüs çizgileriniz',
                        'Şans ve bolluk getirecek Jüpiter lokasyonları',
                        '12 Aylık kişisel transit potansiyeliniz',
                    ].map((feature, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px', color: 'var(--text-main)' }}>
                            <span style={{ color: '#5671FF', marginRight: '12px', fontSize: '1.1rem' }}>✓</span>
                            <span style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Payment Button Area */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ marginTop: '24px' }}
            >
                <button
                    className="btn-continue"
                    onClick={handlePayment}
                    disabled={isProcessing || isSuccess}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: isSuccess ? '#22c55e' : 'var(--accent-main)',
                        transition: 'background 0.3s ease'
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.span
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Güvenli Ödeme İşleniyor...
                            </motion.span>
                        ) : isSuccess ? (
                            <motion.span
                                key="success"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span>Kilit Açıldı</span>
                                <span>🎉</span>
                            </motion.span>
                        ) : (
                            <motion.span
                                key="default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span>Kredi Kartı ile Öde</span>
                                <span>💳</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>🔒 256-bit SSL Güvenli Ödeme</span>
                </div>
            </motion.div>
        </div>
    );
}

export default PaymentPage;
