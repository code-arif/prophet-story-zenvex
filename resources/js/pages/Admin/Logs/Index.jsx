import React from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';

export default function AdminLogsIndex({ sms, bdapps, laravelLogTail }) {
  const [expandedBdapps, setExpandedBdapps] = React.useState(null);

  const toggleBdapps = (id) => {
    setExpandedBdapps(expandedBdapps === id ? null : id);
  };

  return (
    <AdminShell title="Logs">
      <Head title="Admin Logs" />

      <div className="space-y-4">
        {/* BDApps Logs - Full Width */}
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="text-base font-semibold">BDApps API Logs</div>
          <div className="mt-2 max-h-125 overflow-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <div className="divide-y divide-[hsl(var(--border))]">
              {(bdapps || []).map((log) => (
                <div key={log.id} className="p-3 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
                          log.direction === 'in' 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                            : 'bg-green-500/10 text-green-600 dark:text-green-400'
                        }`}>
                          {log.direction === 'in' ? '← IN' : '→ OUT'}
                        </span>
                        <span className="font-semibold uppercase">{log.service}</span>
                        <span className="text-[hsl(var(--muted-foreground))]">{log.http_method}</span>
                        {log.status_code && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
                            log.status_code >= 200 && log.status_code < 300
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : log.status_code >= 400
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {log.status_code}
                          </span>
                        )}
                      </div>
                      {log.url && (
                        <div className="mt-1 text-[hsl(var(--muted-foreground))] break-all">
                          {log.url}
                        </div>
                      )}
                      {log.error && (
                        <div className="mt-2 rounded-lg bg-red-500/10 p-2 text-red-600 dark:text-red-400">
                          {log.error}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                        {log.created_at}
                      </div>
                      <button
                        onClick={() => toggleBdapps(log.id)}
                        className="p-1 hover:bg-[hsl(var(--accent))] rounded transition-colors"
                      >
                        {expandedBdapps === log.id ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedBdapps === log.id && (
                    <div className="mt-3 space-y-2">
                      {log.request && Object.keys(log.request).length > 0 && (
                        <div>
                          <div className="font-semibold mb-1">Request:</div>
                          <pre className="rounded-lg bg-[hsl(var(--muted))] p-2 overflow-x-auto text-xs">
                            {JSON.stringify(log.request, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.response && Object.keys(log.response).length > 0 && (
                        <div>
                          <div className="font-semibold mb-1">Response:</div>
                          <pre className="rounded-lg bg-[hsl(var(--muted))] p-2 overflow-x-auto text-xs">
                            {JSON.stringify(log.response, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {(!bdapps || bdapps.length === 0) && (
                <div className="p-4 text-sm text-[hsl(var(--muted-foreground))]">No BDApps logs yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* SMS and Laravel Logs - Side by Side */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">SMS Logs</div>
            <div className="mt-2 max-h-105 overflow-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
              <div className="divide-y divide-[hsl(var(--border))]">
                {(sms || []).map((m) => (
                  <div key={m.id} className="p-3 text-xs">
                    <div className="flex justify-between gap-3">
                      <div className="font-semibold">{m.msisdn}</div>
                      <div className="text-[hsl(var(--muted-foreground))]">{m.created_at}</div>
                    </div>
                    <div className="mt-1 text-[hsl(var(--muted-foreground))]">
                      {m.provider} • {m.status}
                    </div>
                    {m.error ? <div className="mt-1 text-[hsl(var(--destructive))]">{m.error}</div> : null}
                  </div>
                ))}
                {(!sms || sms.length === 0) && (
                  <div className="p-4 text-sm text-[hsl(var(--muted-foreground))]">No SMS logs yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">Laravel Log (tail)</div>
            <pre className="mt-2 max-h-105 overflow-auto whitespace-pre-wrap rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3 text-xs text-[hsl(var(--foreground))]">
              {laravelLogTail || 'No laravel.log found yet.'}
            </pre>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
