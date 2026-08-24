import React from 'react';
import { useI18n } from '../../lib/i18n';

/**
 * ScriptBubble — conversation script message bubble.
 */
export default function ScriptBubble({ text, level = 'beginner', isUser = false }) {
  const { t } = useI18n();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser ? 'bg-brand text-white' : 'bg-inset-blue'
      }`}>
        <p className={`text-[14px] font-bn ${isUser ? 'text-white' : 'text-ink'}`}>
          {t(text)}
        </p>
        <p className={`text-[11px] mt-1 ${isUser ? 'text-white/70' : 'text-muted'}`}>
          {level}
        </p>
      </div>
    </div>
  );
}
