import React from 'react';
import { Head, useForm } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminSettingsProfile({ user }) {
  const form = useForm({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    password_confirmation: '',
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/profile');
  }

  return (
    <AdminShell title="Settings">
      <Head title="Admin Profile" />

      <div className="grid gap-4">

        <div>
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold">Admin profile</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Update your admin account details.</div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name</label>
                  <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                  {form.errors.name ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name}</div> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Phone</label>
                  <Input value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                  {form.errors.phone ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.phone}</div> : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Email</label>
                <Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                {form.errors.email ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.email}</div> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">New password (optional)</label>
                  <Input type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
                  {form.errors.password ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.password}</div> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Confirm password</label>
                  <Input
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                  />
                </div>
              </div>

              <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
