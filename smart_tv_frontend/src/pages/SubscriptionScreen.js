import React, { useEffect, useState } from 'react';
import { getUserSubscriptions, manageSubscription } from '../services/subscriptionService';
import { Focusable } from '../components/Focusable';

// PUBLIC_INTERFACE
export default function SubscriptionScreen() {
  /**
   * Displays list of subscriptions with simple manage action placeholder.
   */
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getUserSubscriptions();
      if (mounted) setSubs(data || []);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2 className="section-title">Subscriptions</h2>
      {subs.map((s, idx) => (
        <div key={s.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 12, marginBottom: 10, background: 'var(--color-surface)', borderRadius: 12,
          border: '1px solid rgba(17,24,39,0.06)', boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ fontWeight: 700 }}>{s.name}</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>Status: {s.status}</div>
          </div>
          <Focusable
            id={`manage-${s.id}`}
            as="button"
            className="btn"
            meta={{ group: 'subs', row: idx, col: 0 }}
            onClick={async () => {
              const action = s.status === 'active' ? 'cancel' : 'resume';
              await manageSubscription(s.id, action);
              setSubs((prev) => prev.map(p => p.id === s.id ? { ...p, status: action === 'cancel' ? 'inactive' : 'active' } : p));
            }}
          >
            {s.status === 'active' ? 'Cancel' : 'Resume'}
          </Focusable>
        </div>
      ))}
    </div>
  );
}
