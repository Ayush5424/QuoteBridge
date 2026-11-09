import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavbarProps {
  supplierMode?: boolean;
  rfqNumber?: string;
  roleBadge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ supplierMode, rfqNumber, roleBadge }) => {
  const location = useLocation();
  const isSupplierPage = supplierMode || location.pathname.startsWith('/supplier-quote');

  return (
    <header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-md h-16 max-w-container-max mx-auto">
        {/* Brand / Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="bg-primary-container p-2 rounded-lg text-on-primary group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-headline-lg-mobile" style={{ fontVariationSettings: "'FILL' 1" }}>
              handshake
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg font-bold text-primary dark:text-primary-fixed-dim">
            QuoteBridge
          </h1>
        </NavLink>

        {/* Center / Right Navigation or Context Info */}
        <div className="flex items-center gap-6">
          {isSupplierPage ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-label-md font-label-md text-on-surface font-semibold">
                  {roleBadge || 'External Supplier Portal'}
                </span>
                <span className="text-label-sm font-label-sm text-text-muted">
                  {rfqNumber || 'RFQ #28491-B'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant overflow-hidden shadow-sm">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Supplier Manager"
                />
              </div>
            </div>
          ) : (
            <>
              <nav className="hidden md:flex items-center gap-3 lg:gap-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-label-md font-label-md px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed-dim font-bold bg-surface-container-high'
                        : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
                    }`
                  }
                  end
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/create-quote"
                  className={({ isActive }) =>
                    `text-label-md font-label-md px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed-dim font-bold bg-surface-container-high'
                        : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
                    }`
                  }
                >
                  New Quote
                </NavLink>

                <NavLink
                  to="/compare"
                  className={({ isActive }) =>
                    `text-label-md font-label-md px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed-dim font-bold bg-surface-container-high'
                        : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
                    }`
                  }
                >
                  Comparison
                </NavLink>

                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `text-label-md font-label-md px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary dark:text-primary-fixed-dim font-bold bg-surface-container-high'
                        : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
                    }`
                  }
                >
                  History
                </NavLink>

                <NavLink
                  to="/supplier-quote"
                  className={({ isActive }) =>
                    `text-label-md font-label-md px-3 py-1.5 rounded-lg border border-border-subtle transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-primary border-primary bg-primary/5 font-semibold'
                        : 'text-text-muted hover:text-on-surface hover:border-outline'
                    }`
                  }
                  title="Switch to supplier response view"
                >
                  <span className="material-symbols-outlined text-[16px]">store</span>
                  <span>Supplier View</span>
                </NavLink>
              </nav>

              <div className="flex items-center gap-3">
                <span className="text-label-md font-label-md text-on-surface-variant hidden xl:block">
                  Retailer Portal
                </span>
                <div className="h-10 w-10 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden flex items-center justify-center shadow-sm">
                  <img
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Alex - Procurement Lead"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
