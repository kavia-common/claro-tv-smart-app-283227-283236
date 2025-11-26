import React from 'react';
import { Focusable } from './Focusable';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export function SideMenu() {
  /** Side menu with focusable vertical items */
  const location = useLocation();
  const items = [
    { id: 'menu-home', label: 'Home', to: '/' },
    { id: 'menu-subscriptions', label: 'Subscriptions', to: '/subscriptions' },
    { id: 'menu-settings', label: 'Settings', to: '/settings' },
  ];

  return (
    <nav className="sidemenu" aria-label="Main">
      {items.map((item, idx) => {
        const active = location.pathname === item.to;
        return (
          <Focusable
            key={item.id}
            id={item.id}
            as="div"
            meta={{ group: 'sidemenu', row: idx, col: 0 }}
            className={`sidemenu-item${active ? ' active' : ''}`}
            onClick={() => { /* Link click below */ }}
          >
            <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}>
              {item.label}
            </Link>
            {active && <span className="badge">Now</span>}
          </Focusable>
        );
      })}
    </nav>
  );
}
