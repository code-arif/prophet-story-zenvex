import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import FlashMessages from '../../../components/FlashMessages';

export default function AdminLogin({ brandName, logoUrl }) {
  usePage();

  const form = useForm({
    email: '',
    password: '',
    remember: true,
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/login');
  }

  return (
    <div className="min-h-dvh bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Head title="Admin Login" />
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-10">
        <div className="w-full rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
          <div className="flex flex-col items-center">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="mb-3 h-12 w-12 rounded-2xl" />
            ) : null}
            <div className="text-lg font-semibold">Admin Panel</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{brandName}</div>
          </div>

          <div className="mt-4">
            <FlashMessages />
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Email</label>
              <Input
                type="email"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
                autoComplete="email"
                required
              />
              {form.errors.email ? (
                <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.email}</div>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Password</label>
              <Input
                type="password"
                value={form.data.password}
                onChange={(e) => form.setData('password', e.target.value)}
                autoComplete="current-password"
                required
              />
              {form.errors.password ? (
                <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.password}</div>
              ) : null}
            </div>

            <Button className="w-full" disabled={form.processing}>
              {form.processing ? 'Signing in…' : 'Sign in'}
            </Button>

            <div className="text-xs text-[hsl(var(--muted-foreground))] hidden">
              Create an admin user via: <span className="font-mono">php artisan admin:create you@example.com</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
