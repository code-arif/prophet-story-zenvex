import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Kid Mode context — Palm Green chrome switch for the subscriber side.
 *
 * The Prophet Stories app serves both children and adults. When kid mode is
 * on, the whole subscriber chrome (top bar, bottom nav, sidebar, shell)
 * swaps its Sandstone Ochre accents for Palm Green (`--color-kid`).
 *
 * State is persisted to localStorage (`ui.kidMode`) and mirrored on
 * `<html data-kid-mode>` so global CSS can react too.
 */
const KidModeContext = createContext({
  kidMode: false,
  setKidMode: () => {},
  toggleKidMode: () => {},
});

export function KidModeProvider({ children }) {
  const [kidMode, setKidMode] = useState(() => {
    try {
      return localStorage.getItem('ui.kidMode') === '1';
    } catch {
      return false; // Storage unavailable — default to adult mode.
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ui.kidMode', kidMode ? '1' : '0');
    } catch {
      // Persist is best-effort only.
    }
    document.documentElement.dataset.kidMode = kidMode ? 'true' : 'false';
  }, [kidMode]);

  const toggleKidMode = () => setKidMode((v) => !v);

  return (
    <KidModeContext.Provider value={{ kidMode, setKidMode, toggleKidMode }}>
      {children}
    </KidModeContext.Provider>
  );
}

export function useKidMode() {
  return useContext(KidModeContext);
}