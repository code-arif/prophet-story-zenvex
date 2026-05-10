import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';

export default function AdminSubscriberShow({ subscriber, subscription }) {
  const sms = useForm({ message: '' });
  const deleteForm = useForm({ password: '' });
  const { flash } = usePage().props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if subscriber can be deleted (no active subscription)
  const canDelete = !subscription || subscription.status !== 'active' || subscription.ends_at !== null;

  function send(e) {
    e.preventDefault();
    sms.post(`/admin/subscribers/${encodeURIComponent(subscriber.msisdn)}/sms`);
  }

  function handleDelete(e) {
    e.preventDefault();
    deleteForm.delete(`/admin/subscribers/${encodeURIComponent(subscriber.msisdn)}`, {
      onSuccess: () => setShowDeleteModal(false),
      onError: () => {},
    });
  }

  return (
    <AdminShell title="Subscriber Details">
      <Head title="Subscriber Details" />

      {/* Flash messages */}
      {flash?.error && (
        <div className="mb-4 rounded-xl bg-[hsl(var(--destructive))]/10 px-4 py-3 text-sm text-[hsl(var(--destructive))] ring-1 ring-[hsl(var(--destructive))]/20">
          {flash.error}
        </div>
      )}
      {flash?.status && (
        <div className="mb-4 rounded-xl bg-[hsl(var(--primary))]/10 px-4 py-3 text-sm text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]/20">
          {flash.status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">MSISDN</div>
          <div className="mt-1 text-lg font-semibold">{subscriber.msisdn}</div>

          <div className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Name</div>
          <div className="mt-1 text-base">{subscriber.name || '—'}</div>

          <div className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">DOB</div>
          <div className="mt-1 text-base">{subscriber.dob || '—'}</div>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">Subscription</div>
          <div className="mt-1 text-base">
            {subscription ? (
              <div className="space-y-1">
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">Status:</span> {subscription.status}
                </div>
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">Starts:</span> {subscription.starts_at || '—'}
                </div>
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">Ends:</span> {subscription.ends_at || '—'}
                </div>
                <div>
                  <span className="text-[hsl(var(--muted-foreground))]">Channel:</span> {subscription.channel || '—'}
                </div>
              </div>
            ) : (
              '—'
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
        <div className="text-base font-semibold">Send SMS</div>
        <form onSubmit={send} className="mt-3 space-y-3">
          <textarea
            className="min-h-28 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            value={sms.data.message}
            onChange={(e) => sms.setData('message', e.target.value)}
            placeholder="Type message…"
          />
          {sms.errors.message ? (
            <div className="text-xs text-[hsl(var(--destructive))]">{sms.errors.message}</div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button disabled={sms.processing}>{sms.processing ? 'Sending…' : 'Send'} </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/subscribers">Back</Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Subscriber Section */}
      {canDelete && (
        <div className="mt-6 rounded-3xl bg-[hsl(var(--destructive))]/5 p-5 ring-1 ring-[hsl(var(--destructive))]/20">
          <div className="text-base font-semibold text-[hsl(var(--destructive))]">Danger Zone</div>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Delete this subscriber permanently. This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            className="mt-3"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Subscriber
          </Button>
        </div>
      )}

      {!canDelete && (
        <div className="mt-6 rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            This subscriber has an active subscription and cannot be deleted. Cancel the subscription first.
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold text-[hsl(var(--destructive))]">Confirm Delete</div>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Are you sure you want to delete subscriber <strong>{subscriber.msisdn}</strong>?
              <br />
              Enter your admin password to confirm.
            </p>

            <form onSubmit={handleDelete} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-[hsl(var(--muted-foreground))]">Admin Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  value={deleteForm.data.password}
                  onChange={(e) => deleteForm.setData('password', e.target.value)}
                  placeholder="Enter your password"
                  autoFocus
                />
                {deleteForm.errors.password && (
                  <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{deleteForm.errors.password}</div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteForm.processing || !deleteForm.data.password}
                >
                  {deleteForm.processing ? 'Deleting…' : 'Delete'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    deleteForm.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
