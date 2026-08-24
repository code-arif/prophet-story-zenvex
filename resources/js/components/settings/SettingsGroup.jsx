import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * SettingsGroup — settings section with header and rows.
 */
export default function SettingsGroup({ title, children }) {
  const { t } = useI18n();

  return (
    <div className="mb-3">
      <p className="mb-2 px-1 text-[12px] font-bold uppercase tracking-wider text-muted font-bn">
        {t(title)}
      </p>
      <div className="glass overflow-hidden divide-y divide-border-rest">
        {children}
      </div>
    </div>
  );
}
