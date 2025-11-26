import React, { useEffect, useMemo, useRef } from 'react';
import { Focusable } from './Focusable';

// PUBLIC_INTERFACE
export function ContentCarousel({ idPrefix = 'card', title = 'Featured', items = [] }) {
  /**
   * Horizontal carousel with focusable cards. Smooth scroll using rAF and cleanup to avoid leaks.
   */
  const rowRef = useRef(null);
  const scrollTarget = useRef(0);
  const rafId = useRef(0);

  const cards = useMemo(() => {
    if (!items.length) {
      return Array.from({ length: 10 }).map((_, i) => ({
        id: `${idPrefix}-${i + 1}`,
        title: `Sample #${i + 1}`,
        subtitle: 'HD • 4K • 12+',
      }));
    }
    return items;
  }, [items, idPrefix]);

  // Smooth scrolling loop
  useEffect(() => {
    function step() {
      const el = rowRef.current;
      if (!el) return;
      const dx = (scrollTarget.current - el.scrollLeft) * 0.2;
      if (Math.abs(dx) > 0.5) {
        el.scrollLeft += dx;
        rafId.current = requestAnimationFrame(step);
      } else {
        el.scrollLeft = scrollTarget.current;
      }
    }
    rafId.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // Keep focused item roughly centered
  const centerOn = (childEl) => {
    const el = rowRef.current;
    if (!el || !childEl) return;
    const childLeft = childEl.offsetLeft;
    const childWidth = childEl.offsetWidth;
    const viewport = el.clientWidth;
    const next = Math.max(0, childLeft - (viewport / 2 - childWidth / 2));
    scrollTarget.current = next;
    // allow rAF to interpolate
  };

  return (
    <section className="carousel" aria-label={title}>
      <h2 className="section-title">{title}</h2>
      <div className="carousel-row" ref={rowRef}>
        {cards.map((c, i) => (
          <Focusable
            key={c.id}
            id={c.id}
            className="carousel-card"
            meta={{ group: 'carousel', row: 0, col: i }}
            onFocus={(e) => centerOn(e.currentTarget)}
            onClick={() => { /* TODO: route to detail */ }}
          >
            <div className="card-thumb" />
            <div className="card-body">
              <div className="card-title">{c.title}</div>
              <div className="card-subtitle">{c.subtitle}</div>
            </div>
          </Focusable>
        ))}
      </div>
    </section>
  );
}
