import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Users,
  CreditCard,
  Zap,
  UserCheck,
  SkipForward,
  UserX,
  Briefcase,
  Wallet,
  DollarSign,
  FolderCheck,
  MessageSquare,
} from 'lucide-react';

import AdminShell from '../../layouts/AdminShell';

const STAT_CONFIGS = [
  { key: 'subscribers',        label: 'Total Subscribers',    accent: '#10b981', icon: Users },
  { key: 'activeSubscriptions',label: 'Active Subscriptions', accent: '#3b82f6', icon: CreditCard },
  { key: 'jobs',               label: 'Total Jobs',           accent: '#8b5cf6', icon: Briefcase },
  { key: 'clients',            label: 'Clients',              accent: '#06b6d4', icon: UserCheck },
  { key: 'incomeEntries',      label: 'Income Entries',       accent: '#14b8a6', icon: Wallet },
  { key: 'totalIncomeBdt',     label: 'Total Income',         accent: '#f59e0b', icon: DollarSign, isCurrency: true },
  { key: 'documents',          label: 'Documents',            accent: '#ec4899', icon: FolderCheck },
  { key: 'feedbacks',          label: 'User Feedbacks',       accent: '#6366f1', icon: MessageSquare },
  { key: 'articles',           label: 'Articles',             accent: '#64748b', icon: FileText },
];

function Stat({ label, value, accent, icon: Icon, isCurrency = false }) {
  const displayValue = isCurrency
    ? `৳ ${typeof value === 'number' ? value.toLocaleString() : value}`
    : typeof value === 'number'
    ? value.toLocaleString()
    : value;

  return (
    <div
      className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md text-[hsl(var(--card-foreground))]"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider truncate">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight truncate">
              {displayValue}
            </p>
          </div>
          <div
            className="flex-shrink-0 size-10 rounded-lg flex items-center justify-center ml-2"
            style={{ background: `${accent}18` }}
          >
            <Icon className="size-5" style={{ color: accent }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden text-[hsl(var(--card-foreground))] ${className}`}>
      <div className="px-5 pt-5 pb-3 border-b border-[hsl(var(--border))]">
        <p className="text-sm font-bold text-[hsl(var(--foreground))]">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</p>}
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
      title="User Onboarding Funnel"
      subtitle="Profile setup progress across all users"
      className="lg:col-span-2"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {ONBOARDING_SEGMENTS.map(({ key, label, color, icon: Icon }) => {
          const value = Number(data?.[key]) || 0;
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={key} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.3] p-4">
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="size-4" style={{ color }} />
                </span>
                <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{label}</p>
              </div>
              <p className="mt-3 text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">{value.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{pct}% of users</p>
            </div>
          );
        })}
      </div>

      {/* Proportion bar */}
      <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
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
      <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{total.toLocaleString()} total users</p>
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
      grid: { color: 'rgba(0,0,0,0.06)' },
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
  const subscribersPerDay = Array.isArray(charts?.subscribersPerDay) ? charts.subscribersPerDay : [];
  const incomePerDay = Array.isArray(charts?.incomePerDay) ? charts.incomePerDay : [];
  const subscriptionStatus = charts?.subscriptionStatus || { labels: [], data: [] };

  return (
    <AdminShell title="Dashboard">
      <Head title="Easy Rise Admin Dashboard" />

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Easy Rise Dashboard</h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          ইজি রাইজ প্ল্যাটফর্মের সার্বিক পারফর্মেন্স ও ইউজার অ্যাক্টিভিটি
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STAT_CONFIGS.map(({ key, label, accent, icon, isCurrency }) => (
          <Stat
            key={key}
            label={label}
            value={counts?.[key] ?? 0}
            accent={accent}
            icon={icon}
            isCurrency={isCurrency}
          />
        ))}
      </div>

      {/* Charts grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {learnerOnboarding && <LearnerOnboardingCard data={learnerOnboarding} />}

        <ChartCard title="New Subscribers (last 14 days)" subtitle="Daily new registered users">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: 'Subscribers',
                  data: subscribersPerDay,
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderRadius: 6,
                  borderSkipped: false,
                },
              ],
            }}
            options={CHART_DEFAULTS}
          />
        </ChartCard>

        <ChartCard title="User Income Logged (last 14 days BDT)" subtitle="Daily user income entries in BDT">
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Income (BDT)',
                  data: incomePerDay,
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.35,
                  fill: true,
                  pointRadius: 3,
                  pointBackgroundColor: '#10b981',
                  borderWidth: 2,
                },
              ],
            }}
            options={CHART_DEFAULTS}
          />
        </ChartCard>

        <ChartCard title="Subscriptions Status" subtitle="Breakdown by active and canceled status">
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut
                data={{
                  labels: Array.isArray(subscriptionStatus.labels) ? subscriptionStatus.labels : [],
                  datasets: [
                    {
                      data: Array.isArray(subscriptionStatus.data) ? subscriptionStatus.data : [],
                      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4'],
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
                      labels: { font: { size: 11 }, padding: 16, color: '#94a3b8' },
                    },
                  },
                  cutout: '65%',
                }}
              />
            </div>
          </div>
        </ChartCard>

        {/* Quick Actions */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden text-[hsl(var(--card-foreground))]">
          <div className="px-5 pt-5 pb-3 border-b border-[hsl(var(--border))]">
            <p className="text-sm font-bold text-[hsl(var(--foreground))]">Quick Actions</p>
            <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">প্রয়োজনীয় এডমিন সার্ভিসসমূহ</p>
          </div>
          <div className="p-5 space-y-2">
            {[
              { label: 'View Subscribers',      href: '/admin/subscribers',      color: '#10b981' },
              { label: 'Subscriptions',         href: '/admin/subscriptions',    color: '#3b82f6' },
              { label: 'User Feedbacks',        href: '/admin/feedbacks',        color: '#6366f1' },
              { label: 'Send Bulk SMS',         href: '/admin/sms/bulk',         color: '#f59e0b' },
              { label: 'Content Manager',       href: '/admin/content-manager',  color: '#06b6d4' },
              { label: 'System Logs',           href: '/admin/logs',             color: '#ef4444' },
              { label: 'General Settings',      href: '/admin/settings/general', color: '#8b5cf6' },
            ].map(({ label, href, color }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[hsl(var(--muted))/0.5] transition-colors group"
              >
                <span
                  className="size-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span className="text-sm font-medium text-[hsl(var(--foreground))] group-hover:text-primary transition-colors">
                  {label}
                </span>
              </a>
            ))}

            {charts?.generatedAt && (
              <p className="mt-3 pt-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                <Zap className="size-3" />
                Updated: {new Date(charts.generatedAt).toLocaleString('bn-BD')}
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
