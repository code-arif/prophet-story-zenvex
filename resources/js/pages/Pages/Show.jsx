import React from 'react';
import DOMPurify from 'dompurify';
import AppShell from '../../layouts/AdminShell';
import BlocksView from '../../components/BlocksView';

export default function PageShow({ page }) {
  const useBlocks = page?.use_builder && Array.isArray(page?.builder_data) && page.builder_data.length > 0;

  return (
    <AppShell title={page?.title || 'Page'}>
      {useBlocks ? (
        <BlocksView blocks={page.builder_data} />
      ) : page?.content ? (
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content, { USE_PROFILES: { html: true }, ADD_ATTR: ['style', 'target'] }) }}
        />
      ) : (
        <div className="px-4 py-6 text-sm text-[hsl(var(--muted-foreground))]">No content.</div>
      )}
    </AppShell>
  );
}
