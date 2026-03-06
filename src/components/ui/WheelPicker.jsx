import React, { useRef, useEffect, useCallback, useState } from 'react';

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PADDING = ITEM_HEIGHT * 2;

function WheelColumn({ items, selectedIndex, onSelect }) {
    const scrollRef = useRef(null);
    const isUserScrolling = useRef(false);
    const snapTimer = useRef(null);
    const lastReportedIndex = useRef(selectedIndex);

    useEffect(() => {
        if (!isUserScrolling.current && scrollRef.current) {
            scrollRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
        }
    }, [selectedIndex]);

    const snapToNearest = useCallback(() => {
        if (!scrollRef.current) return;
        const scrollTop = scrollRef.current.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(index, items.length - 1));

        scrollRef.current.scrollTo({
            top: clamped * ITEM_HEIGHT,
            behavior: 'smooth'
        });

        if (clamped !== lastReportedIndex.current) {
            lastReportedIndex.current = clamped;
            onSelect(clamped);
        }
        isUserScrolling.current = false;
    }, [items.length, onSelect]);

    const handleScroll = useCallback(() => {
        isUserScrolling.current = true;
        clearTimeout(snapTimer.current);
        snapTimer.current = setTimeout(snapToNearest, 80);
    }, [snapToNearest]);

    const handleClick = useCallback((index) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: 'smooth'
            });
        }
        lastReportedIndex.current = index;
        onSelect(index);
    }, [onSelect]);

    const [visualCenter, setVisualCenter] = useState(selectedIndex);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => {
            const center = Math.round(el.scrollTop / ITEM_HEIGHT);
            setVisualCenter(Math.max(0, Math.min(center, items.length - 1)));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, [items.length]);

    return (
        <div className="wheel-column">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="wheel-scroll-container"
                style={{
                    height: `${CONTAINER_HEIGHT}px`,
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div style={{ height: `${PADDING}px` }} />

                {items.map((item, index) => {
                    const dist = Math.abs(index - visualCenter);
                    const isHeader = item.isHeader;
                    let className = 'wheel-item';

                    if (isHeader) {
                        className += ' wheel-item--header';
                    } else if (dist === 0) {
                        className += ' wheel-item--selected';
                    } else if (dist === 1) {
                        className += ' wheel-item--near';
                    } else {
                        className += ' wheel-item--far';
                    }

                    return (
                        <div
                            key={`${item.value}-${index}`}
                            onClick={() => handleClick(index)}
                            className={className}
                            style={{ height: `${ITEM_HEIGHT}px` }}
                        >
                            {item.label}
                        </div>
                    );
                })}

                <div style={{ height: `${PADDING}px` }} />
            </div>
        </div>
    );
}

export default function WheelPicker({ columns, onChange }) {
    return (
        <div className="wheel-picker-wrapper">
            <div className="wheel-picker-inner" style={{ height: `${CONTAINER_HEIGHT}px` }}>

                {/* Selection highlight lines */}
                <div className="wheel-selection-band" style={{
                    top: `${ITEM_HEIGHT * 2}px`,
                    height: `${ITEM_HEIGHT}px`,
                }} />

                {/* Top fade mask */}
                <div className="wheel-fade-top" style={{
                    height: `${ITEM_HEIGHT * 1.5}px`,
                }} />

                {/* Bottom fade mask */}
                <div className="wheel-fade-bottom" style={{
                    height: `${ITEM_HEIGHT * 1.5}px`,
                }} />

                {/* Columns */}
                {columns.map((col) => (
                    <WheelColumn
                        key={col.key}
                        items={col.items}
                        selectedIndex={col.selectedIndex}
                        onSelect={(index) => onChange(col.key, index)}
                    />
                ))}
            </div>
        </div>
    );
}
