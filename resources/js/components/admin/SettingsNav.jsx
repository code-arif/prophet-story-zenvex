import React from 'react';
import { Link, usePage } from '@inertiajs/react';

function Item({ href, children }) {
  const page = usePage();
  const current = page?.url || '';
  const active = current.startsWith(href);

  return (
    <Link
      href={href}
      className={
        'block rounded-2xl px-3 py-2 text-sm ring-1 ' +
        (active
          ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] ring-[hsl(var(--border))]'
          : 'text-[hsl(var(--muted-foreground))] ring-transparent hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]')
      }
    >
      {children}
    </Link>
  );
}

export default function SettingsNav() {
  return (
    <div className="rounded-3xl bg-[hsl(var(--card))] p-3 ring-1 ring-[hsl(var(--border))]">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
        Settings
      </div>
      <div className="space-y-1">
        <Item href="/admin/settings/general">General</Item>
        <Item href="/admin/settings/theme">Theme</Item>
        <Item href="/admin/settings/profile">Admin profile</Item>
        <Item href="/admin/settings/integrations">SMTP / SMS</Item>
        <Item href="/admin/settings/bdapps">BDApps API docs / test</Item>
        <Item href="/admin/settings/ussd-menu">USSD menu</Item>
        <Item href="/admin/settings/footer">Footer links</Item>
        <Item href="/admin/settings/widgets">Widgets</Item>
        <Item href="/admin/settings/menu">User menu</Item>
        {/* <Item href="/admin/settings/menu/admin">Admin menu (advanced)</Item> */}
        <Item href="/admin/settings/optimize">Optimize</Item>
      </div>
      <div className="mt-4 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
        Content Types
      </div>
      <div className="space-y-1">
        <Item href="/admin/post-types">Post Types</Item>
        <Item href="/admin/taxonomies">Taxonomies</Item>
      </div>
      <div className="mt-4 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
        Content
      </div>
      <div className="space-y-1">
        <Item href="/admin/content-manager">Content Manager</Item>
        <Item href="/admin/media">Media Manager</Item>
        <Item href="/admin/apk">Mobile App (APK)</Item>
      </div>
    </div>
  );
}
