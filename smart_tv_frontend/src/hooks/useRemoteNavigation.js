import { useCallback, useEffect } from 'react';
import { useFocusManager } from './useFocusManager';

/**
 * Assign this hook at root-level of the TV UI.
 * It listens to keyboard events to simulate remote D-Pad controls.
 * Arrow keys navigate; Enter triggers click; Back navigates history.
 */
export function useRemoteNavigation({ onEnter, onBack } = {}) {
  const { focusedId, registry, focusById } = useFocusManager();

  // Compute next id based on arrow direction using registry metadata
  const findNext = useCallback((direction) => {
    const entries = Array.from(registry.current.entries());
    if (!entries.length) return null;

    const current = registry.current.get(focusedId);
    if (!current) {
      // If nothing focused, focus first
      return entries[0][0];
    }

    const { meta } = current;
    if (!meta) return entries[0][0];

    // Meta may provide neighbors map for precise control
    if (meta.neighbors && meta.neighbors[direction]) {
      return meta.neighbors[direction];
    }

    // Fallback heuristics: use order for left/right; step rows for up/down via meta.row/col
    if (direction === 'left' || direction === 'right') {
      const ids = entries.map(([id]) => id);
      const idx = ids.indexOf(focusedId);
      const nextIdx = direction === 'right' ? Math.min(ids.length - 1, idx + 1) : Math.max(0, idx - 1);
      return ids[nextIdx];
    }
    if (direction === 'up' || direction === 'down') {
      const sameGroup = entries.filter(([, item]) => item.meta?.group === current.meta?.group);
      if (sameGroup.length && Number.isFinite(meta?.col) && Number.isFinite(meta?.row)) {
        // find cell
        const targetRow = direction === 'down' ? meta.row + 1 : meta.row - 1;
        const candidate = sameGroup.find(([, item]) => item.meta?.row === targetRow && item.meta?.col === meta.col);
        if (candidate) return candidate[0];
      }
      // fallback to current
      return focusedId;
    }
    return focusedId;
  }, [focusedId, registry]);

  useEffect(() => {
    function onKeyDown(e) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          focusById(findNext('left')); break;
        case 'ArrowRight':
          e.preventDefault();
          focusById(findNext('right')); break;
        case 'ArrowUp':
          e.preventDefault();
          focusById(findNext('up')); break;
        case 'ArrowDown':
          e.preventDefault();
          focusById(findNext('down')); break;
        case 'Enter':
        case 'NumpadEnter':
          e.preventDefault();
          if (onEnter) onEnter(focusedId);
          else {
            const item = registry.current.get(focusedId);
            item?.ref?.current?.click?.();
          }
          break;
        case 'Backspace':
        case 'Escape':
          e.preventDefault();
          if (onBack) onBack();
          else window.history.back();
          break;
        default:
      }
    }
    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusById, findNext, onEnter, onBack, focusedId, registry]);
}
