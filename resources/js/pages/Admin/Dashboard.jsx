import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';

import AdminShell from '../../layouts/AdminShell';

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
      <div className="text-sm text-[hsl(var(--muted-foreground))]">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-semibold text-[hsl(var(--foreground))]">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</div> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminDashboard({ counts, charts }) {
  const { admin } = usePage().props;
  const refreshSeconds = Number(admin?.widgetRefreshSeconds || 0);

  React.useEffect(() => {
    if (!Number.isFinite(refreshSeconds) || refreshSeconds <= 0) return;

    const id = setInterval(() => {
      router.reload({ preserveScroll: true, preserveState: true });
    }, Math.max(5, refreshSeconds) * 1000);

    return () => clearInterval(id);
  }, [refreshSeconds]);

  const labels = Array.isArray(charts?.labels) ? charts.labels : [];
  const articlesPerDay = Array.isArray(charts?.articlesPerDay) ? charts.articlesPerDay : [];
  const subscribersPerDay = Array.isArray(charts?.subscribersPerDay) ? charts.subscribersPerDay : [];
  const subscriptionStatus = charts?.subscriptionStatus || { labels: [], data: [] };

  return (
    <AdminShell title="Dashboard">
      <Head title="Admin Dashboard" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Articles" value={counts?.articles ?? 0} />
        <Stat label="Categories" value={counts?.categories ?? 0} />
        <Stat label="Pages" value={counts?.pages ?? 0} />
        <Stat label="Subscribers" value={counts?.subscribers ?? 0} />
        <Stat label="Active Subscriptions" value={counts?.activeSubscriptions ?? 0} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Articles (last 14 days)" subtitle="Published articles per day">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Articles',
                  data: articlesPerDay,
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(34, 197, 94, 0.18)',
                  tension: 0.25,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { precision: 0 } } },
            }}
          />
        </ChartCard>

        <ChartCard title="New subscribers (last 14 days)" subtitle="New signups per day">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: 'Subscribers',
                  data: subscribersPerDay,
                  backgroundColor: 'rgba(59, 130, 246, 0.65)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { precision: 0 } } },
            }}
          />
        </ChartCard>

        <ChartCard title="Subscriptions" subtitle="Breakdown by status">
          <Doughnut
            data={{
              labels: Array.isArray(subscriptionStatus.labels) ? subscriptionStatus.labels : [],
              datasets: [
                {
                  data: Array.isArray(subscriptionStatus.data) ? subscriptionStatus.data : [],
                  backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: 'bottom' } },
            }}
          />
        </ChartCard>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 text-sm text-[hsl(var(--muted-foreground))] ring-1 ring-[hsl(var(--border))]">
          <div className="text-base font-semibold text-[hsl(var(--foreground))]">Quick Actions</div>
          <div className="mt-2">Use the left menu to manage Articles, Categories, Pages, Subscribers, Logs, and Settings.</div>
          {charts?.generatedAt ? (
            <div className="mt-3 text-xs">Updated: {new Date(charts.generatedAt).toLocaleString()}</div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
