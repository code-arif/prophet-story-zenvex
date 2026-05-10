import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Download, Package, Smartphone, Shield, Zap } from 'lucide-react';

import AppShell from '../layouts/AppShell';
import { Button } from '../components/ui/button';

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--primary))/10]">
        <Icon className="size-6 text-[hsl(var(--primary))]" />
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{description}</div>
      </div>
    </div>
  );
}

export default function AppDownload({ brandName, logoUrl, apk, appChargeText, appFeatures }) {
  const { flash } = usePage().props;

  const features = Array.isArray(appFeatures) && appFeatures.length > 0
    ? appFeatures
    : null;

  return (
    <AppShell title="Download App">
      <Head title="Download App" />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Hero Section */}
        <div className="rounded-3xl bg-[hsl(var(--card))] p-6 text-center ring-1 ring-[hsl(var(--border))] sm:p-8">
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[hsl(var(--primary))/10]">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="size-12 object-contain" />
            ) : (
              <Package className="size-10 text-[hsl(var(--primary))]" />
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold">{brandName || 'BD Election Daily'}</h1>
          {appChargeText && (
            <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{appChargeText}</div>
          )}

          {apk ? (
            <div className="mt-6">
              <a href="/app/download">
                <Button size="lg" className="w-full sm:w-auto">
                  <Download className="mr-2 size-5" />
                  Download APK (v{apk.version})
                </Button>
              </a>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                <span>{apk.size}</span>
                <span>•</span>
                <span>{apk.downloadCount?.toLocaleString() || 0} downloads</span>
                <span>•</span>
                <span>Updated {apk.updatedAt}</span>
              </div>

              {apk.description && (
                <div className="mt-4 rounded-2xl bg-[hsl(var(--muted))] p-4 text-left text-sm">
                  <div className="font-medium">What's new in v{apk.version}:</div>
                  <div className="mt-1 text-[hsl(var(--muted-foreground))]">{apk.description}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <div className="rounded-2xl bg-[hsl(var(--muted))] p-4">
                <Smartphone className="mx-auto size-8 text-[hsl(var(--muted-foreground))]" />
                <div className="mt-2 text-[hsl(var(--muted-foreground))]">
                  The Android app is coming soon. Please check back later.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
          <h2 className="text-lg font-semibold">App Features</h2>

          <div className="mt-6 space-y-4">
            {features ? (
              features.map((f, i) => (
                <Feature key={i} icon={Zap} title={f} description={null} />
              ))
            ) : (
              <div className="mt-6 space-y-6">
                <Feature
                  icon={Zap}
                  title="Real-time Updates"
                  description="Get instant notifications for breaking election news and results."
                />
                <Feature
                  icon={Smartphone}
                  title="Offline Reading"
                  description="Save articles to read later, even without internet connection."
                />
                <Feature
                  icon={Shield}
                  title="Secure & Private"
                  description="Your data is protected. We only use your phone number for authentication."
                />
              </div>
            )}
          </div>
        </div>

        {/* Installation Guide */}
        {apk && (
          <div className="rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
            <h2 className="text-lg font-semibold">How to Install</h2>

            <ol className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">
                  1
                </span>
                <span>
                  <strong>Download</strong> - Tap the download button above to get the APK file.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">
                  2
                </span>
                <span>
                  <strong>Enable Unknown Sources</strong> - Go to Settings → Security → Enable "Unknown sources" or "Install
                  unknown apps".
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">
                  3
                </span>
                <span>
                  <strong>Install</strong> - Open the downloaded APK file and tap "Install".
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">
                  4
                </span>
                <span>
                  <strong>Open & Login</strong> - Launch the app and login with your phone number.
                </span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </AppShell>
  );
}
