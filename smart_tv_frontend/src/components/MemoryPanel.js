import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export function MemoryPanel() {
  /**
   * Displays lightweight performance hints. Uses browser APIs if available.
   * Designed to be low overhead and cleaned up on unmount.
   */
  const [mem, setMem] = useState({ usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 });
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let mounted = true;
    let last = performance.now();
    let frames = 0;
    let rafId;

    function tick(ts) {
      frames += 1;
      if (ts - last >= 1000) {
        if (mounted) setFps(frames);
        frames = 0;
        last = ts;
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    const interval = setInterval(() => {
      const perfMem = performance && performance.memory ? performance.memory : null;
      if (perfMem && mounted) {
        setMem({
          usedJSHeapSize: perfMem.usedJSHeapSize,
          totalJSHeapSize: perfMem.totalJSHeapSize,
          jsHeapSizeLimit: perfMem.jsHeapSizeLimit,
        });
      }
    }, 1500);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  const fmtMB = (v) => (v ? (v / 1048576).toFixed(1) : 'n/a');

  return (
    <div className="memory-panel" role="status" aria-live="polite">
      <div style={{ fontWeight: 800, marginBottom: 4, color: '#91c3ff' }}>Performance</div>
      <div className="memory-metric"><span>FPS</span><span>{fps}</span></div>
      <div className="memory-metric"><span>Heap Used</span><span>{fmtMB(mem.usedJSHeapSize)} MB</span></div>
      <div className="memory-metric"><span>Heap Total</span><span>{fmtMB(mem.totalJSHeapSize)} MB</span></div>
      <div className="memory-metric"><span>Heap Limit</span><span>{fmtMB(mem.jsHeapSizeLimit)} MB</span></div>
    </div>
  );
}
