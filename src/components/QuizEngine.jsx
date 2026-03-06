import React, { useState, useMemo } from 'react';
import OptionCard from './OptionCard';
import HookScreen from './ui/HookScreen';
import MultiSelectPill from './ui/MultiSelectPill';
import WheelPicker from './ui/WheelPicker';

const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const TURKEY_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort((a, b) => a.localeCompare(b, 'tr'));

const RELATIONSHIPS = [
    { value: 'Bir ilişkim var', label: 'Bir ilişkim var', emoji: '💕' },
    { value: 'Yeni ayrıldım', label: 'Yeni ayrıldım', emoji: '💔' },
    { value: 'Nişanlıyım', label: 'Nişanlıyım', emoji: '🥰' },
    { value: 'Evliyim', label: 'Evliyim', emoji: '💍' },
    { value: 'Ruh eşimi arıyorum', label: 'Ruh eşimi arıyorum', emoji: '💫' },
    { value: 'Bekarım', label: 'Bekarım', emoji: '😌' },
    { value: 'Karmaşık', label: 'Karmaşık', emoji: '🤔' }
];

const currentYear = new Date().getFullYear();

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function QuizEngine({ currentStep, onNext, setAstroData }) {
    const [isLocationFocused, setIsLocationFocused] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selections, setSelections] = useState({
        gender: null,
        location: '',
        // Date wheel indices (0 = header label for month/day, yearHeaderIdx for year)
        dateMonthIdx: 0,
        dateDayIdx: 0,
        dateYearIdx: 74, // Position of 'Yıl' label (1926-1999 = 74 items before it)
        // Time wheel indices
        timeHourIdx: 0,
        timeMinuteIdx: 0,
        timeUnknown: false,
        relationship: null,
        goals: [],
        element: null,
        email: ''
    });

    const handleSelect = (key, value) => {
        setSelections(prev => ({ ...prev, [key]: value }));
    };

    const handleGoalToggle = (goal) => {
        setSelections(prev => {
            let newGoals = [...prev.goals];
            if (newGoals.includes(goal)) {
                newGoals = newGoals.filter(g => g !== goal);
            } else if (newGoals.length < 3) {
                newGoals.push(goal);
            }
            return { ...prev, goals: newGoals };
        });
    };

    // ---- Date Picker Data ----
    // First item is the header label (index 0), actual values start at index 1
    const monthItems = [
        { value: 'header', label: 'Ay', isHeader: true },
        ...MONTHS_TR.map((m, i) => ({ value: i + 1, label: m }))
    ];

    // Years: 1926-1999 above 'Yıl', then 2000-current below 'Yıl'
    const startYear = 1926;
    const splitYear = 2000;
    const yearsBefore = Array.from({ length: splitYear - startYear }, (_, i) => ({
        value: startYear + i,
        label: String(startYear + i)
    }));
    const yearsAfter = Array.from({ length: currentYear - splitYear + 1 }, (_, i) => ({
        value: splitYear + i,
        label: String(splitYear + i)
    }));
    const yearHeaderIdx = yearsBefore.length; // Index of 'Yıl' in the list
    const yearItems = [
        ...yearsBefore,
        { value: 'header', label: 'Yıl', isHeader: true },
        ...yearsAfter
    ];

    // Figure out selected month/year for computing days
    const selectedMonth = selections.dateMonthIdx > 0 ? selections.dateMonthIdx : 1;
    const selectedYear = selections.dateYearIdx !== yearHeaderIdx ? yearItems[selections.dateYearIdx]?.value || 2000 : 2000;
    const maxDays = getDaysInMonth(selectedMonth, selectedYear);
    const dayItems = [
        { value: 'header', label: 'Gün', isHeader: true },
        ...Array.from({ length: maxDays }, (_, i) => ({
            value: i + 1, label: String(i + 1)
        }))
    ];

    // Validation: month & day must be > 0, year must not be on the header
    const dateIsValid = selections.dateMonthIdx > 0 && selections.dateDayIdx > 0 && selections.dateYearIdx !== yearHeaderIdx;

    const dateColumns = [
        { key: 'dateMonthIdx', items: monthItems, selectedIndex: selections.dateMonthIdx },
        { key: 'dateDayIdx', items: dayItems, selectedIndex: Math.min(selections.dateDayIdx, maxDays) },
        { key: 'dateYearIdx', items: yearItems, selectedIndex: selections.dateYearIdx },
    ];

    // ---- Time Picker Data (24-hour format) ----
    const hourItems = Array.from({ length: 24 }, (_, i) => ({
        value: i, label: String(i).padStart(2, '0')
    }));
    const minuteItems = Array.from({ length: 60 }, (_, i) => ({
        value: i, label: String(i).padStart(2, '0')
    }));

    const timeColumns = [
        { key: 'timeHourIdx', items: hourItems, selectedIndex: selections.timeHourIdx },
        { key: 'timeMinuteIdx', items: minuteItems, selectedIndex: selections.timeMinuteIdx },
    ];

    const handleWheelChange = (key, index) => {
        handleSelect(key, index);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Şimdilik test amaçlı sabit bir koordinat (İstanbul: 41.0082, 28.9784) gönderiyoruz. 
            // İleride Google Maps API ile `selections.location` bilgisinden gerçek koordinat çekilecek.
            const payload = {
                year: selectedYear,
                month: selectedMonth,
                day: selections.dateDayIdx,
                hour: selections.timeUnknown ? 12.0 : selections.timeHourIdx + (selections.timeMinuteIdx / 60.0),
                lat: 41.0082,
                lon: 28.9784
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/api/calculate-chart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log("BACKEND'DEN GELEN ASTROLOJİ SONUCU:", data);

            if (setAstroData) {
                setAstroData(data);
            }
            onNext();

        } catch (error) {
            console.error("API Error:", error);
            alert("Sunucuya bağlanılamadı. Backend'in çalıştığından (Port 8000) emin olun.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="slide-in-right" key={`step-${currentStep}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>

            {/* 1. Cinsiyet */}
            {currentStep === 1 && (
                <>
                    <div className="step-container" style={{ overflowY: 'auto', paddingBottom: '32px' }}>
                        <h1 className="step-title">Başlamak için cinsiyetinizi seçin</h1>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
                            <OptionCard icon="♀" label="Kadın" selected={selections.gender === 'female'} onClick={() => handleSelect('gender', 'female')} />
                            <OptionCard icon="♂" label="Erkek" selected={selections.gender === 'male'} onClick={() => handleSelect('gender', 'male')} />
                            <OptionCard icon="⚥" label="Diğer" selected={selections.gender === 'other'} onClick={() => handleSelect('gender', 'other')} />
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '80px' }}>
                            Kişiselleştirilmiş astroloji raporunuzu almak için testi tamamlayın.
                        </p>

                        {/* Footer Section */}
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                <img src="/assets/logo-transparent.png" alt="AstroWhere Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '0.5px' }}>AstroWhere</div>
                            <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>2026 © All Rights Reserved.</div>
                            <div style={{ fontSize: '0.85rem', marginBottom: '32px' }}>By continuing you agree to our</div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '20px', columnGap: '32px', fontSize: '0.9rem', color: 'var(--text-main)', textAlign: 'center' }}>
                                <span style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Privacy Policy</span>
                                <span style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Terms of Use</span>
                                <span style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Billing Terms</span>
                                <span style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Money-Back Policy</span>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-actions">
                        <button className="btn-continue" onClick={onNext} disabled={!selections.gender}>Devam Et</button>
                    </div>
                </>
            )}

            {/* 2. Tarih - Wheel Picker */}
            {currentStep === 2 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title" style={{ marginBottom: '10px' }}>Doğum tarihiniz ne zaman?</h1>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.9rem', padding: '0 10px' }}>
                            Astrolojik haritanızı eksiksiz ve doğru çıkarabilmemiz için doğum tarihinizi bilmemiz çok önemlidir.
                        </p>

                        <div style={{ flex: 1 }} />

                        <WheelPicker columns={dateColumns} onChange={handleWheelChange} />

                        <div style={{ flex: 0.4 }} />
                    </div>
                    <div className="bottom-actions">
                        <button className="btn-continue" onClick={onNext} disabled={!dateIsValid}>Devam Et</button>
                    </div>
                </>
            )}

            {/* 3. Saat - Wheel Picker */}
            {currentStep === 3 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title">Doğum saatinizi biliyor musunuz?</h1>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Gezegenlerin gökyüzündeki tam konumunu belirlemek için doğum saatinize ihtiyacımız var.
                        </p>

                        <div style={{ flex: 1 }} />

                        <WheelPicker columns={timeColumns} onChange={handleWheelChange} />

                        <div style={{ flex: 1 }} />

                        <div style={{ textAlign: 'center', marginBottom: '16px', marginTop: 'auto' }}>
                            <span
                                onClick={() => {
                                    handleSelect('timeUnknown', true);
                                    onNext();
                                }}
                                style={{
                                    color: 'var(--accent-main)',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                }}
                            >
                                Hatırlamıyorum
                            </span>
                        </div>
                    </div>
                    <div className="bottom-actions">
                        <button className="btn-continue" onClick={onNext}>Devam Et</button>
                    </div>
                </>
            )}

            {/* 4. Konum */}
            {currentStep === 4 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title">Nerede doğdunuz?</h1>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
                            Doğduğunuz şehrin enlem ve boylamı, dünya haritanızın merkezini belirler.
                        </p>

                        <div style={{ position: 'relative', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
                            <input
                                type="text"
                                className="text-input"
                                placeholder="Örn: Adana"
                                value={selections.location}
                                onChange={(e) => {
                                    handleSelect('location', e.target.value);
                                    setIsLocationFocused(true);
                                }}
                                onFocus={() => setIsLocationFocused(true)}
                                // Delay blur to allow clicking suggestions
                                onBlur={() => setTimeout(() => setIsLocationFocused(false), 200)}
                                autoFocus
                            />

                            {isLocationFocused && selections.location && (
                                <div className="location-dropdown">
                                    {TURKEY_CITIES
                                        .filter(city => city.toLocaleLowerCase('tr-TR').includes(selections.location.toLocaleLowerCase('tr-TR')))
                                        .slice(0, 8)
                                        .map((city, idx) => (
                                            <div
                                                key={idx}
                                                className="location-suggestion"
                                                onClick={() => {
                                                    handleSelect('location', city);
                                                    setIsLocationFocused(false);
                                                }}
                                            >
                                                {city}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bottom-actions">
                        <button
                            className="btn-continue"
                            onClick={onNext}
                            disabled={!TURKEY_CITIES.some(city => city.toLocaleLowerCase('tr-TR') === selections.location.trim().toLocaleLowerCase('tr-TR'))}
                        >
                            Devam Et
                        </button>
                    </div>
                </>
            )}

            {/* 5. HOOK 1 (Transition) */}
            {currentStep === 5 && (
                <HookScreen
                    percentage={34}
                    title="Yıldız haritanızda nadir bir enerji tespit ettik..."
                    subtitle="En uyumlu olduğunuz coğrafi hatları belirlemek için gökyüzü haritanız çıkarılıyor."
                    onComplete={onNext}
                />
            )}

            {/* 6. İlişki Durumu */}
            {currentStep === 6 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title">Mevcut ilişki durumunuz nedir?</h1>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '16px', flexShrink: 0 }}>
                            Aşk ve Venüs hatlarınızı yorumlarken bu bilgiye ihtiyacımız var.
                        </p>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            flex: 1,
                            overflowY: 'auto',
                            paddingBottom: '20px',
                            // Add a subtle padding block to prevent scrollbar overlap feeling tight
                            paddingRight: '4px'
                        }}>
                            {RELATIONSHIPS.map((rel) => (
                                <div
                                    key={rel.value}
                                    onClick={() => { handleSelect('relationship', rel.value); setTimeout(onNext, 400); }}
                                    className={`relationship-card ${selections.relationship === rel.value ? 'selected' : ''}`}
                                >
                                    <span className="relationship-emoji">{rel.emoji}</span>
                                    <span className="relationship-label">{rel.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* 7. Hedefler */}
            {currentStep === 7 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title">Gelecek için en büyük 3 hedefiniz nedir?</h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
                            {[
                                { label: 'Kariyer', emoji: '💼' },
                                { label: 'Aşk & Evlilik', emoji: '💍' },
                                { label: 'Aile Uyumu', emoji: '👨‍👩‍👧' },
                                { label: 'Seyahat', emoji: '✈️' },
                                { label: 'Girişimcilik', emoji: '🚀' },
                                { label: 'Sağlık', emoji: '💪' },
                                { label: 'Bolluk ve Para', emoji: '💰' },
                                { label: 'Manevi Huzur', emoji: '🧘' }
                            ].map((goal) => (
                                <MultiSelectPill
                                    key={goal.label}
                                    label={`${goal.emoji}  ${goal.label}`}
                                    selected={selections.goals.includes(goal.label)}
                                    onClick={() => handleGoalToggle(goal.label)}
                                />
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
                            {selections.goals.length} / 3 seçildi
                        </p>
                    </div>
                    <div className="bottom-actions">
                        <button className="btn-continue" onClick={onNext} disabled={selections.goals.length !== 3}>Devam Et</button>
                    </div>
                </>
            )}

            {/* 8. Doğa Elementi */}
            {currentStep === 8 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title">Hangi doğa elementine en yakın hissediyorsunuz?</h1>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginTop: '32px',
                            maxWidth: '300px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '100%'
                        }}>
                            {[{ e: 'Ateş', i: '🔥' }, { e: 'Su', i: '🌊' }, { e: 'Toprak', i: '🌿' }, { e: 'Hava', i: '🌪️' }].map(({ e, i }) => (
                                <OptionCard
                                    key={e} icon={i} label={e}
                                    selected={selections.element === e}
                                    onClick={() => { handleSelect('element', e); setTimeout(onNext, 400); }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* 9. HOOK 2 */}
            {currentStep === 9 && (
                <HookScreen
                    percentage={67}
                    title="Büyük açıklamanıza çok yaklaştınız!"
                    subtitle="Astrolojik profilleriniz dünya haritasıyla eşleştiriliyor..."
                    onComplete={onNext}
                    delay={2000}
                />
            )}

            {/* 10. Final Lead Capture */}
            {currentStep === 10 && (
                <>
                    <div className="step-container">
                        <h1 className="step-title" style={{ fontSize: '1.6rem', color: '#5671FF' }}>Astro-Lokasyon Haritanız Hazır</h1>
                        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', margin: '24px 0', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🗺️</div>
                            <h3 style={{ marginBottom: '8px' }}>Ruhunuzun Koordinatları Çözüldü</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>12 sayfalık detaylı harita analizi, şans, aşk ve kariyer hatlarınız kişisel dosyanızda.</p>
                        </div>
                        <p style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>Raporu nereye gönderelim?</p>
                        <input
                            type="email"
                            className="text-input"
                            placeholder="E-posta adresiniz"
                            value={selections.email}
                            onChange={(e) => handleSelect('email', e.target.value)}
                        />
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
                            Kişisel verileriniz bizde güvende. E-postanızı güncellemeler, makbuzlar ve abonelik bilgileri için kullanacağız.
                        </p>
                    </div>
                    <div className="bottom-actions">
                        <button className="btn-continue" onClick={handleSubmit} disabled={!selections.email.includes('@') || isSubmitting}>
                            {isSubmitting ? 'Hesaplanıyor...' : 'Raporumu Gör'}
                        </button>
                    </div>
                </>
            )}

        </div>
    );
}

export default QuizEngine;
