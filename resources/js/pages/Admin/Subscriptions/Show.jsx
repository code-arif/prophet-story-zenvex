import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-sm">{value ?? '-'}</div>
    </div>
  );
}

export default function Show() {
  const { props } = usePage();
  const { subscriber, msisdn, isActive, active, canceled } = props;

  const [channel, setChannel] = useState('admin');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const statusBadge = useMemo(() => {
    if (isActive) {
      return <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-xs">ACTIVE</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200 text-xs">INACTIVE</span>;
  }, [isActive]);

  const post = (url) => {
    router.post(url, { channel, note }, { preserveScroll: true });
  };

  return (
    <AdminShell title="Manage Subscription">
      <Head title={`Subscription · ${msisdn}`} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">
            <Link href="/admin/subscriptions" className="underline">Subscriptions</Link> / <span className="font-mono">{msisdn}</span>
          </div>
          <h1 className="text-2xl font-semibold mt-1">Manage Subscription {statusBadge}</h1>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <div className="font-semibold">Subscriber</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="MSISDN" value={<span className="font-mono">{msisdn}</span>} />
            <Field label="Name" value={subscriber?.name} />
            <Field label="DOB" value={subscriber?.dob} />
            <Field label="Updated" value={subscriber?.updated_at} />
          </div>

          <div className="mt-4 text-sm">
            <Link href={`/admin/subscribers/${encodeURIComponent(msisdn)}`} className="underline">
              Open Subscriber
            </Link>
          </div>
        </div>

        <div className="border rounded p-4">
          <div className="font-semibold">Current subscription state</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Active row" value={active ? `${active.status} (${active.channel ?? '-'})` : '-'} />
            <Field label="Canceled row" value={canceled ? `${canceled.status} (${canceled.channel ?? '-'})` : '-'} />
            <Field label="Active starts_at" value={active?.starts_at} />
            <Field label="Active ends_at" value={active?.ends_at ?? '(null)'} />
            <Field label="Canceled ends_at" value={canceled?.ends_at} />
            <Field label="Last message" value={active?.last_message ?? canceled?.last_message} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded p-4">
          <div className="font-semibold">Actions</div>

          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-500">Channel</div>
            <input
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full"
              placeholder="admin"
            />
          </div>

          <div className="mt-3">
            <div className="text-xs font-semibold text-gray-500">Note</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full"
              rows={3}
              placeholder="Why changed?"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => post(`/admin/subscriptions/${encodeURIComponent(msisdn)}/activate`)}
              className="px-4 py-2 rounded bg-green-600 text-white text-sm"
            >
              Mark ACTIVE
            </button>
            <button
              type="button"
              onClick={() => post(`/admin/subscriptions/${encodeURIComponent(msisdn)}/cancel`)}
              className="px-4 py-2 rounded bg-red-600 text-white text-sm"
            >
              Mark CANCELED
            </button>
            <button
              type="button"
              onClick={() => router.post(`/admin/subscriptions/${encodeURIComponent(msisdn)}/clear`, {}, { preserveScroll: true })}
              className="px-4 py-2 rounded border text-sm"
            >
              Clear rows
            </button>
          </div>
        </div>

        <div className="border rounded p-4 lg:col-span-2">
          <div className="font-semibold">Send SMS (manual)</div>
          <div className="text-sm text-gray-500 mt-1">This uses the same BDApps SMS service as the app.</div>

          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              router.post(
                `/admin/subscriptions/${encodeURIComponent(msisdn)}/send-sms`,
                { message },
                { preserveScroll: true }
              );
              setMessage('');
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full"
              rows={4}
              placeholder="Type message…"
            />
            <div className="flex justify-end">
              <button className="px-4 py-2 rounded bg-black text-white text-sm">Send</button>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
