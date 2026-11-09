import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-margin-sm bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant md:hidden shadow-lg">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-transform duration-150 ${
            isActive ? 'text-primary dark:text-primary-fixed-dim font-bold scale-95' : 'text-on-surface-variant hover:text-primary'
          }`
        }
      >
        <span className="material-symbols-outlined">dashboard</span>
        <span className="text-label-sm font-label-sm">Dashboard</span>
      </NavLink>

      <NavLink
        to="/create-quote"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-transform duration-150 ${
            isActive ? 'text-primary dark:text-primary-fixed-dim font-bold scale-95' : 'text-on-surface-variant hover:text-primary'
          }`
        }
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          add_circle
        </span>
        <span className="text-label-sm font-label-sm">New Quote</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center transition-transform duration-150 ${
            isActive ? 'text-primary dark:text-primary-fixed-dim font-bold scale-95' : 'text-on-surface-variant hover:text-primary'
          }`
        }
      >
        <span className="material-symbols-outlined">history</span>
        <span className="text-label-sm font-label-sm">History</span>
      </NavLink>
    </nav>
  );
};
