import React, { useEffect, useRef, useState } from 'react';
import { useFocusManager } from '../hooks/useFocusManager';

/**
 * Focusable wraps a focusable dom element and registers it with FocusManager.
 * Props: id (required), className, onFocus, onBlur, meta (neighbors, row, col, group)
 */
export function Focusable({ id, className = '', onFocus, onBlur, meta = {}, children, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const { register, unregister, focusedId, setFocusedId } = useFocusManager();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    register(id, ref, meta);
    return () => unregister(id);
  }, [id, meta, register, unregister]);

  useEffect(() => {
    const focused = focusedId === id;
    setIsFocused(focused);
  }, [focusedId, id]);

  return (
    <Tag
      ref={ref}
      tabIndex={-1}
      className={`${className} focusable ${isFocused ? 'focused' : ''}`}
      onFocus={(e) => { setFocusedId(id); setIsFocused(true); onFocus && onFocus(e); }}
      onBlur={(e) => { setIsFocused(false); onBlur && onBlur(e); }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
