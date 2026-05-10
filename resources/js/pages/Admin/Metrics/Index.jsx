import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

import AdminShell from '../../../layouts/AdminShell';

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
      <div className="text-sm text-[hsl(var(--muted-foreground))]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[hsl(var(--foreground))]">{value}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
      <div className="text-base font-semibold">{title}</div>
      {subtitle ? <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</div> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminMetricsIndex({ counts, topArticles, charts }) {
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
  const viewsPerDay = Array.isArray(charts?.viewsPerDay) ? charts.viewsPerDay : [];
  const categoryViews = charts?.categoryViews || { labels: [], data: [] };

  return (
    <AdminShell title="System Metrics">
      <Head title="System Metrics" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Articles" value={counts?.articles ?? 0} />
        <Stat label="Published articles" value={counts?.publishedArticles ?? 0} />
        <Stat label="Total article views" value={counts?.totalArticleViews ?? 0} />
        <Stat label="Active subscriptions" value={counts?.activeSubscriptions ?? 0} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Views (last 14 days)" subtitle="Based on the article_views table">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Views',
                  data: viewsPerDay,
                  borderColor: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.18)',
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
          {!viewsPerDay.length ? (
            <div className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">No view tracking data found.</div>
          ) : null}
        </ChartCard>

        <ChartCard title="Category views" subtitle="Sum of article.view_count per category">
          <Bar
            data={{
              labels: Array.isArray(categoryViews.labels) ? categoryViews.labels : [],
              datasets: [
                {
                  label: 'Views',
                  data: Array.isArray(categoryViews.data) ? categoryViews.data : [],
                  backgroundColor: 'rgba(99, 102, 241, 0.65)',
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
      </div>

      <div className="mt-6 rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
        <div className="text-base font-semibold">Top Articles (by views)</div>
        <div className="mt-3 divide-y divide-[hsl(var(--border))]">
          {(topArticles || []).map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{a.title}</div>
                <div className="truncate text-xs text-[hsl(var(--muted-foreground))]">/articles/{a.slug}</div>
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">{a.view_count ?? 0} views</div>
            </div>
          ))}
          {(!topArticles || topArticles.length === 0) && (
            <div className="py-3 text-sm text-[hsl(var(--muted-foreground))]">No data yet.</div>
          )}
        </div>

        {charts?.generatedAt ? (
          <div className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">Updated: {new Date(charts.generatedAt).toLocaleString()}</div>
        ) : null}
      </div>
    </AdminShell>
  );
}
