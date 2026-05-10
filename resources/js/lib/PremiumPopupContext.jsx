import React from 'react';
import { usePage } from '@inertiajs/react';
import PremiumPopup from '../components/PremiumPopup';

export const PremiumPopupContext = React.createContext(null);

/**
 * Provides `openPremiumPopup()` and `isSubscribed` to the whole tree.
 * Render this once at the layout level (AppShell).
 */
export function PremiumPopupProvider({ children }) {
  const { auth, flash } = usePage().props;
  const isSubscribed = Boolean(auth?.isSubscribed);

  const [isOpen, setIsOpen] = React.useState(() => Boolean(flash?.premiumPopup));
  const openPremiumPopup = React.useCallback(() => setIsOpen(true), []);
  const closePremiumPopup = React.useCallback(() => setIsOpen(false), []);

  const value = React.useMemo(
    () => ({ isSubscribed, openPremiumPopup, closePremiumPopup }),
    [isSubscribed, openPremiumPopup, closePremiumPopup],
  );

  return (
    <PremiumPopupContext.Provider value={value}>
      {children}
      <PremiumPopup open={isOpen} onClose={closePremiumPopup} />
    </PremiumPopupContext.Provider>
  );
}

/**
 * Returns `{ isSubscribed, openPremiumPopup, closePremiumPopup }`.
 *
 * `guardClick(e)` — call inside any onClick to intercept premium content:
 *   - If user is NOT subscribed it prevents navigation and opens the popup, returning true.
 *   - If subscribed, it does nothing and returns false.
 */
export function usePremiumPopup() {
  const ctx = React.useContext(PremiumPopupContext);
  if (!ctx) {
    // Fallback when used outside provider — never blocks navigation
    return {
      isSubscribed: true,
      openPremiumPopup: () => {},
      closePremiumPopup: () => {},
      guardClick: () => false,
    };
  }

  const guardClick = (e) => {
    if (!ctx.isSubscribed) {
      e?.preventDefault();
      e?.stopPropagation();
      ctx.openPremiumPopup();
      return true;
    }
    return false;
  };

  return { ...ctx, guardClick };
}
