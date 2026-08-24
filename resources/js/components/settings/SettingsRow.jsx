import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * SettingsRow — single settings row with label, value, and optional action.
 */
export default function SettingsRow({ label, value, action, onClick, danger }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-all active:bg-black/5"
    >
      <div>
        <p className={`text-[14px] font-semibold font-bn ${danger ? 'text-danger' : 'text-ink'}`}>
          {t(label)}
        </p>
        {value && <p className="text-[12px] text-muted font-bn">{t(value)}</p>}
      </div>
      {action ? (
        <span className="text-[13px] text-brand font-semibold font-bn">{t(action)}</span>
      ) : (
        <span className="text-[13px] text-muted">▶</span>
      )}
    </button>
  );
}
