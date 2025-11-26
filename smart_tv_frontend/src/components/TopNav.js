import React from 'react';
import { Focusable } from './Focusable';

// PUBLIC_INTERFACE
export function TopNav({ onAction }) {
  /** Top navigation bar with simple actions */
  return (
    <div className="topnav">
      <div className="topnav-title">
        <span style={{ display: 'inline-flex', width: 12, height: 12, background: 'var(--color-primary)', borderRadius: 2 }} />
        Claro TV
      </div>
      <div className="topnav-actions">
        <Focusable id="top-action-search" as="button" className="btn" meta={{ group: 'top' }} onClick={() => onAction?.('search')}>
          Search
        </Focusable>
        <Focusable id="top-action-profile" as="button" className="btn secondary" meta={{ group: 'top' }} onClick={() => onAction?.('profile')}>
          Profile
        </Focusable>
      </div>
    </div>
  );
}
