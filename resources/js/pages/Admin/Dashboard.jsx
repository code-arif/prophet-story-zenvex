import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { TrendingUp, TrendingDown, Minus, FileText, Tag, File, Users, CreditCard, Zap, GraduationCap, BookMarked, ClipboardList, BookOpenText, UserCheck, SkipForward, UserX } from 'lucide-react';

import AdminShell from '../../layouts/AdminShell';

const STAT_CONFIGS = [
  { key: 'articles',           label: 'Articles',            accent: '#3b82f6', icon: FileText },
  { key: 'categories',         label: 'Categories',          accent: '#8b5cf6', icon: Tag     },
  { key: 'pages',              label: 'Pages',               accent: '#06b6d4', icon: File    },
  { key: 'lessons',            label: 'Lessons',             accent: '#14b8a6', icon: GraduationCap },
  { key: 'vocabDecks',         label: 'Vocab Decks',         accent: '#6366f1', icon: BookMarked },
  { key: 'quizzes',            label: 'Quizzes',             accent: '#f59e0b', icon: ClipboardList },
  { key: 'readingPassages',    label: 'Reading Passages',    accent: '#ec4899', icon: BookOpenText },
  { key: 'subscribers',        label: 'Subscribers',         accent: '#10b981', icon: Users   },
  { key: 'activeSubscriptions',label: 'Active Subscriptions',accent: '#ef4444', icon: CreditCard },
];

function Stat({ label, value, accent, icon: Icon, trend }) {
  const trendPositive = trend && trend > 0;
  const trendNegative = trend && trend < 0;

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div
            className="flex-shrink-0 size-10 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}18` }}
          >
            <Icon className="size-5" style={{ color: accent }} />
          </div>
        </div>

        {trend !== undefined && trend !== null && (
          <div className="mt-3 flex items-center gap-1.5">
            {trendPositive ? (
              <TrendingUp className="size-3.5 text-emerald-500" />
            ) : trendNegative ? (
              <TrendingDown className="size-3.5 text-red-500" />
            ) : (
              <Minus className="size-3.5 text-muted-foreground" />
            )}
            <span
              className={`text-xs font-semibold ${
                trendPositive ? 'text-emerald-600' : trendNegative ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-muted-foreground">vs prior period</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
      <div className="px-5 pt-5 pb-3 border-b border-border/60">
        <p className="text-sm font-bold text-foreground">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const ONBOARDING_SEGMENTS = [
  { key: 'completed', label: 'Profile Completed', color: '#10b981', icon: UserCheck },
  { key: 'skipped', label: 'Skipped', color: '#f59e0b', icon: SkipForward },
  { key: 'neverStarted', label: 'Never Started', color: '#64748b', icon: UserX },
];

function LearnerOnboardingCard({ data }) {
  const total = Number(data?.total) || 0;

  return (
    <ChartCard
      title="Learner Onboarding"
      subtitle="Profile setup funnel across all subscribers"
      className="lg:col-span-2"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {ONBOARDING_SEGMENTS.map(({ key, label, color, icon: Icon }) => {
          const value = Number(data?.[key]) || 0;
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={key} className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="size-4" style={{ color }} />
                </span>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground tracking-tight">{value.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{pct}% of subscribers</p>
            </div>
          );
        })}
      </div>

      {/* Proportion bar */}
      <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {ONBOARDING_SEGMENTS.map(({ key, color }) => {
          const value = Number(data?.[key]) || 0;
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div
              key={key}
              className="h-full transition-all duration-300"
              style={{ width: `${pct}%`, background: color }}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{total.toLocaleString()} total subscribers</p>
    </ChartCard>
  );
}

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 }, maxRotation: 45, color: '#94a3b8' },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { precision: 0, font: { size: 10 }, color: '#94a3b8' },
    },
  },
};

export default function AdminDashboard({ counts, charts, learnerOnboarding = null }) {
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

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your site's performance and activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STAT_CONFIGS.map(({ key, label, accent, icon }) => (
          <Stat
            key={key}
            label={label}
            value={counts?.[key] ?? 0}
            accent={accent}
            icon={icon}
          />
        ))}
      </div>

      {/* Charts grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {learnerOnboarding && <LearnerOnboardingCard data={learnerOnboarding} />}

        <ChartCard title="Articles (last 14 days)" subtitle="Published articles per day">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Articles',
                  data: articlesPerDay,
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  tension: 0.35,
                  fill: true,
                  pointRadius: 3,
                  pointBackgroundColor: '#22c55e',
                  borderWidth: 2,
                },
              ],
            }}
            options={CHART_DEFAULTS}
          />
        </ChartCard>

        <ChartCard title="New Subscribers (last 14 days)" subtitle="New signups per day">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: 'Subscribers',
                  data: subscribersPerDay,
                  backgroundColor: 'rgba(59, 130, 246, 0.7)',
                  borderRadius: 4,
                  borderSkipped: false,
                },
              ],
            }}
            options={CHART_DEFAULTS}
          />
        </ChartCard>

        <ChartCard title="Subscriptions" subtitle="Breakdown by status">
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut
                data={{
                  labels: Array.isArray(subscriptionStatus.labels) ? subscriptionStatus.labels : [],
                  datasets: [
                    {
                      data: Array.isArray(subscriptionStatus.data) ? subscriptionStatus.data : [],
                      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'],
                      borderWidth: 2,
                      borderColor: 'hsl(var(--card))',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { font: { size: 11 }, padding: 16, color: '#64748b' },
                    },
                  },
                  cutout: '65%',
                }}
              />
            </div>
          </div>
        </ChartCard>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-border/60">
            <p className="text-sm font-bold text-foreground">Quick Actions</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Common admin tasks</p>
          </div>
          <div className="p-5 space-y-2">
            {[
              { label: 'Manage Articles',     href: '/admin/articles',    color: '#3b82f6' },
              { label: 'Learner Lessons',     href: '/admin/learner/lessons', color: '#06b6d4' },
              { label: 'Vocabulary Decks',    href: '/admin/learner/vocabulary', color: '#8b5cf6' },
              { label: 'Quizzes',             href: '/admin/learner/quizzes', color: '#f59e0b' },
              { label: 'View Subscribers',    href: '/admin/subscribers', color: '#10b981' },
              { label: 'System Logs',         href: '/admin/logs',        color: '#f59e0b' },
              { label: 'General Settings',    href: '/admin/settings/general', color: '#8b5cf6' },
            ].map(({ label, href, color }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <span
                  className="size-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              </a>
            ))}

            {charts?.generatedAt && (
              <p className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                <Zap className="size-3" />
                Updated: {new Date(charts.generatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
