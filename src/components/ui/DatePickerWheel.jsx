import React, { useRef, useEffect, useState } from 'react';

const ITEM_HEIGHT = 44; // px height of each item

const months = [
    { value: 1, label: 'Ocak' },
    { value: 2, label: 'Şubat' },
    { value: 3, label: 'Mart' },
    { value: 4, label: 'Nisan' },
    { value: 5, label: 'Mayıs' },
    { value: 6, label: 'Haziran' },
    { value: 7, label: 'Temmuz' },
    { value: 8, label: 'Ağustos' },
    { value: 9, label: 'Eylül' },
    { value: 10, label: 'Ekim' },
    { value: 11, label: 'Kasım' },
    { value: 12, label: 'Aralık' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => ({ value: currentYear - i, label: String(currentYear - i) }));

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function WheelColumn({ items, value, onChange }) {
    const scrollRef = useRef(null);
    const timeoutRef = useRef(null);
    const [localValue, setLocalValue] = useState(value);

    // Initial positioning and external value changes
    useEffect(() => {
        const index = items.findIndex(item => item.value === value);
        if (index !== -1 && scrollRef.current) {
            scrollRef.current.scrollTop = index * ITEM_HEIGHT;
            setLocalValue(value);
        }
    }, [value, items]);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        const safeIndex = Math.max(0, Math.min(index, items.length - 1));
        const newValue = items[safeIndex].value;

        setLocalValue(newValue);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            onChange(newValue);
            // Snap to grid perfectly when scrolling stops
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ top: safeIndex * ITEM_HEIGHT, behavior: 'smooth' });
            }
        }, 150);
    };

    return (
        <div style={{ flex: 1, height: `${ITEM_HEIGHT * 5}px`, overflow: 'hidden' }}>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{
                    height: '100%',
                    overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // IE
                }}
            >
                {/* CSS to hide scrollbar for Chrome/Safari */}
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {/* Spacers to center first and last items */}
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />

                {items.map((item) => (
                    <div
                        key={item.value}
                        onClick={() => {
                            const idx = items.findIndex(i => i.value === item.value);
                            if (scrollRef.current) {
                                scrollRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
                            }
                        }}
                        style={{
                            height: `${ITEM_HEIGHT}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            scrollSnapAlign: 'center',
                            fontSize: localValue === item.value ? '1.1rem' : '0.95rem',
                            color: localValue === item.value ? 'var(--text-main)' : 'rgba(255,255,255,0.25)',
                            fontWeight: localValue === item.value ? '600' : '400',
                            transition: 'all 0.15s ease-out',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        {item.label}
                    </div>
                ))}

                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
            </div>
        </div>
    );
}

export default function DatePickerWheel({ value, onChange }) {
    // Determine the max days based on selected month/year
    const maxDays = getDaysInMonth(value.month, value.year);
    const dayItems = Array.from({ length: maxDays }, (_, i) => ({ value: i + 1, label: String(i + 1) }));

    const handleMonthChange = (m) => {
        const newMaxDays = getDaysInMonth(m, value.year);
        // Correct the day if the new month has fewer days
        const newDay = value.day > newMaxDays ? newMaxDays : value.day;
        onChange({ ...value, month: m, day: newDay });
    };

    const handleDayChange = (d) => {
        onChange({ ...value, day: d });
    };

    const handleYearChange = (y) => {
        const newMaxDays = getDaysInMonth(value.month, y);
        const newDay = value.day > newMaxDays ? newMaxDays : value.day;
        onChange({ ...value, year: y, day: newDay });
    };

    return (
        <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto', position: 'relative' }}>
            {/* Headers equivalent to the reference image */}
            <div style={{ display: 'flex', marginBottom: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>
                <div style={{ flex: 1 }}>Ay</div>
                <div style={{ flex: 1 }}>Gün</div>
                <div style={{ flex: 1 }}>Yıl</div>
            </div>

            {/* Picker Container */}
            <div style={{
                position: 'relative',
                display: 'flex',
                background: 'rgba(255,255,255,0.03)',
                padding: '8px 0',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                {/* Center Highlight Lines (matching Atrix design) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: `${ITEM_HEIGHT}px`,
                    transform: 'translateY(-50%)',
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    pointerEvents: 'none'
                }} />

                {/* Top/Bottom Gradients to simulate 3D drum roll */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: `${ITEM_HEIGHT * 2}px`,
                    background: 'linear-gradient(to bottom, var(--bg-main) 0%, transparent 100%)',
                    pointerEvents: 'none', zIndex: 1
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: `${ITEM_HEIGHT * 2}px`,
                    background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)',
                    pointerEvents: 'none', zIndex: 1
                }} />

                <WheelColumn
                    items={months}
                    value={value.month}
                    onChange={handleMonthChange}
                />
                <WheelColumn
                    items={dayItems}
                    value={value.day}
                    onChange={handleDayChange}
                />
                <WheelColumn
                    items={years}
                    value={value.year}
                    onChange={handleYearChange}
                />
            </div>
        </div>
    );
}
