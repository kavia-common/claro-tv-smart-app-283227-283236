import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const FocusContext = createContext(null);

/**
 * Maintains a registry of focusable elements and the current focused id.
 * Provides methods to set focus by id and to register/unregister focusable refs.
 */
export function FocusProvider({ children }) {
  const [focusedId, setFocusedId] = useState(null);
  const registry = useRef(new Map());

  const register = useCallback((id, ref, meta = {}) => {
    registry.current.set(id, { ref, meta });
  }, []);

  const unregister = useCallback((id) => {
    registry.current.delete(id);
  }, []);

  const focusById = useCallback((id) => {
    const item = registry.current.get(id);
    if (item?.ref?.current) {
      item.ref.current.focus();
      setFocusedId(id);
    }
  }, []);

  const api = useMemo(() => ({
    focusedId,
    setFocusedId,
    register,
    unregister,
    focusById,
    registry,
  }), [focusedId, register, unregister, focusById]);

  return <FocusContext.Provider value={api}>{children}</FocusContext.Provider>;
}

// PUBLIC_INTERFACE
export function useFocusManager() {
  /** Returns the focus manager context */
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocusManager must be used within FocusProvider');
  return ctx;
}
