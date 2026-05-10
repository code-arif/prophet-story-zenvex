import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

import AdminShell from '../../../layouts/AdminShell';

function Pagination({ links }) {
  if (!links || links.length <= 3) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((l, idx) => {
        if (!l.url) {
          return (
            <span
              key={idx}
              className="px-3 py-1 rounded border text-sm text-gray-400"
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          );
        }
        return (
          <Link
            key={idx}
            href={l.url}
            className={`px-3 py-1 rounded border text-sm ${l.active ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}
            dangerouslySetInnerHTML={{ __html: l.label }}
          />
        );
      })}
    </div>
  );
}

export default function Index() {
  const { props } = usePage();
  const initialQ = props.q ?? '';
  const { rows } = props;

  const [q, setQ] = useState(initialQ);
  const stats = useMemo(() => {
    const items = rows?.data ?? [];
    const activeCount = items.filter((r) => r.isActive).length;
    return { total: rows?.meta?.total ?? items.length, activeCount };
  }, [rows]);

  const onSearch = (e) => {
    e.preventDefault();
    router.get('/admin/subscriptions', { q }, { preserveState: true, replace: true });
  };

  return (
    <AdminShell title="Subscriptions">
      <Head title="Subscriptions" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <div className="text-sm text-gray-500">Total: {stats.total} · Active (computed): {stats.activeCount}</div>
        </div>

        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-72"
            placeholder="Search by MSISDN or name"
          />
          <button className="px-4 py-2 rounded bg-black text-white text-sm">Search</button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 p-3 border-b">MSISDN</th>
              <th className="text-left text-xs font-semibold text-gray-600 p-3 border-b">Name</th>
              <th className="text-left text-xs font-semibold text-gray-600 p-3 border-b">Status</th>
              <th className="text-left text-xs font-semibold text-gray-600 p-3 border-b">Channel</th>
              <th className="text-left text-xs font-semibold text-gray-600 p-3 border-b">Updated</th>
              <th className="text-right text-xs font-semibold text-gray-600 p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(rows?.data ?? []).map((row) => (
              <tr key={row.msisdn} className="hover:bg-gray-50">
                <td className="p-3 border-b font-mono text-sm">{row.msisdn}</td>
                <td className="p-3 border-b text-sm">{row.name ?? '-'}</td>
                <td className="p-3 border-b text-sm">
                  {row.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-xs">ACTIVE</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200 text-xs">INACTIVE</span>
                  )}
                </td>
                <td className="p-3 border-b text-sm">{row.current?.channel ?? '-'}</td>
                <td className="p-3 border-b text-sm">{row.updated_at ?? '-'}</td>
                <td className="p-3 border-b text-right">
                  <Link
                    href={`/admin/subscriptions/${encodeURIComponent(row.msisdn)}`}
                    className="text-sm underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}

            {(rows?.data ?? []).length === 0 ? (
              <tr>
                <td className="p-3 text-sm text-gray-500" colSpan={6}>
                  No subscriptions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <Pagination links={rows?.links} />
      </div>
    </AdminShell>
  );
}
