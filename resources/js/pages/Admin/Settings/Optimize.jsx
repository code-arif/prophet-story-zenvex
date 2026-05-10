import React from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Download, Upload, Trash2 } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';

function CacheCard({ title, description, actions }) {
  return (
    <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{description}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            size="sm"
            variant={action.variant || 'secondary'}
            onClick={() => router.post(action.url, {}, { preserveScroll: true })}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function AdminOptimizeSettings({ info }) {
  const [showRestoreModal, setShowRestoreModal] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [restoreType, setRestoreType] = React.useState('all');
  const [resetType, setResetType] = React.useState('all');
  
  const restoreForm = useForm({
    backup_file: null,
    restore_type: 'all',
  });

  const resetForm = useForm({
    reset_type: 'all',
    confirm: false,
  });

  const handleRestore = (e) => {
    e.preventDefault();
    restoreForm.post('/admin/settings/optimize/restore', {
      onSuccess: () => {
        setShowRestoreModal(false);
        restoreForm.reset();
      },
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!resetForm.data.confirm) {
      alert('Please check the confirmation box');
      return;
    }
    resetForm.post('/admin/settings/optimize/reset', {
      onSuccess: () => {
        setShowResetModal(false);
        resetForm.reset();
      },
    });
  };

  return (
    <AdminShell title="Settings">
      <Head title="Optimize - Admin Settings" />

      <div className="grid gap-4">

        <div className="space-y-4">
          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-lg font-semibold">Optimize</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Clear caches or cache configuration files to optimize your application.
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[hsl(var(--muted-foreground))]">
              <span>PHP: {info?.phpVersion}</span>
              <span>•</span>
              <span>Laravel: {info?.laravelVersion}</span>
              <span>•</span>
              <span>Cache: {info?.cacheDriver}</span>
              <span>•</span>
              <span>Session: {info?.sessionDriver}</span>
            </div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">Clear Caches</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Remove cached data to force the application to rebuild it fresh.
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CacheCard
                title="Application Cache"
                description="Clear all cached data stored by the application."
                actions={[
                  { label: 'Clear Cache', url: '/admin/settings/optimize/clear-cache', variant: 'destructive' },
                ]}
              />
              <CacheCard
                title="Compiled Views"
                description="Clear compiled Blade template files."
                actions={[
                  { label: 'Clear Views', url: '/admin/settings/optimize/clear-views', variant: 'destructive' },
                ]}
              />
              <CacheCard
                title="Configuration Cache"
                description="Clear the cached configuration files."
                actions={[
                  { label: 'Clear Config', url: '/admin/settings/optimize/clear-config', variant: 'destructive' },
                ]}
              />
              <CacheCard
                title="Route Cache"
                description="Clear the cached route files."
                actions={[
                  { label: 'Clear Routes', url: '/admin/settings/optimize/clear-routes', variant: 'destructive' },
                ]}
              />
            </div>

            <div className="mt-4">
              <CacheCard
                title="Clear All Caches"
                description="Clear all application caches at once (config, routes, views, events, cache)."
                actions={[
                  { label: 'Clear All', url: '/admin/settings/optimize/clear-all', variant: 'destructive' },
                ]}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">Cache for Production</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Cache configuration, routes, and views for improved performance in production.
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CacheCard
                title="Cache Config"
                description="Cache all configuration files into a single file for faster loading."
                actions={[
                  { label: 'Cache Config', url: '/admin/settings/optimize/cache-config' },
                ]}
              />
              <CacheCard
                title="Cache Routes"
                description="Cache all routes for faster route registration."
                actions={[
                  { label: 'Cache Routes', url: '/admin/settings/optimize/cache-routes' },
                ]}
              />
              <CacheCard
                title="Cache Views"
                description="Precompile all Blade templates for faster rendering."
                actions={[
                  { label: 'Cache Views', url: '/admin/settings/optimize/cache-views' },
                ]}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">Backup Data</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Download backups of your application data as JSON files.
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
                <div className="text-sm font-semibold">Settings Backup</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  All application settings and configurations.
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.location.href = '/admin/settings/optimize/backup-settings'}
                  >
                    <Download className="mr-2 size-3" />
                    Backup Settings
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
                <div className="text-sm font-semibold">Content Backup</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  All articles with metadata and content.
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.location.href = '/admin/settings/optimize/backup-content'}
                  >
                    <Download className="mr-2 size-3" />
                    Backup Articles
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
                <div className="text-sm font-semibold">Pages Backup</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  All static pages content.
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.location.href = '/admin/settings/optimize/backup-pages'}
                  >
                    <Download className="mr-2 size-3" />
                    Backup Pages
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
                <div className="text-sm font-semibold">Menu Backup</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  User and admin menu configurations.
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.location.href = '/admin/settings/optimize/backup-menu'}
                  >
                    <Download className="mr-2 size-3" />
                    Backup Menu
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
                <div className="text-sm font-semibold">Complete Backup</div>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Download a complete backup with settings, articles, pages, and menu.
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    onClick={() => window.location.href = '/admin/settings/optimize/backup-all'}
                  >
                    <Download className="mr-2 size-3" />
                    Backup Everything
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">Restore Data</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Restore application data from a previously downloaded backup file.
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowRestoreModal(true)}
              >
                <Upload className="mr-2 size-4" />
                Restore from Backup
              </Button>
            </div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <div className="text-base font-semibold">Reset Data</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              Permanently delete data from the application. This action cannot be undone.
            </div>

            <div className="mt-4">
              <Button
                variant="destructive"
                onClick={() => setShowResetModal(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Reset Data
              </Button>
            </div>
          </div>
        </div>

        {/* Restore Modal */}
        {showRestoreModal && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50" 
              onClick={() => setShowRestoreModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
                <div className="text-lg font-semibold">Restore from Backup</div>
                <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  Upload a backup file to restore your data.
                </div>

                <form onSubmit={handleRestore} className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Restore Type</label>
                    <select
                      value={restoreForm.data.restore_type}
                      onChange={(e) => restoreForm.setData('restore_type', e.target.value)}
                      className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                    >
                      <option value="all">Everything</option>
                      <option value="settings">Settings Only</option>
                      <option value="content">Articles Only</option>
                      <option value="pages">Pages Only</option>
                      <option value="menu">Menu Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Backup File</label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => restoreForm.setData('backup_file', e.target.files[0])}
                      className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                    />
                    {restoreForm.errors.backup_file && (
                      <div className="mt-1 text-xs text-[hsl(var(--destructive))]">
                        {restoreForm.errors.backup_file}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRestoreModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={restoreForm.processing}
                      className="flex-1"
                    >
                      {restoreForm.processing ? 'Restoring...' : 'Restore'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Reset Modal */}
        {showResetModal && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50" 
              onClick={() => setShowResetModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
                <div className="text-lg font-semibold text-[hsl(var(--destructive))]">⚠️ Reset Data</div>
                <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                  This will permanently delete selected data. This action cannot be undone!
                </div>

                <form onSubmit={handleReset} className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Reset Type</label>
                    <select
                      value={resetForm.data.reset_type}
                      onChange={(e) => resetForm.setData('reset_type', e.target.value)}
                      className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                    >
                      <option value="all">Everything (Settings + Articles + Pages)</option>
                      <option value="settings">Settings Only</option>
                      <option value="content">Articles Only</option>
                      <option value="pages">Pages Only</option>
                    </select>
                  </div>

                  <div className="rounded-2xl bg-[hsl(var(--destructive))]/10 p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={resetForm.data.confirm}
                        onChange={(e) => resetForm.setData('confirm', e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm">
                        I understand that this action will permanently delete the selected data and cannot be undone.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowResetModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={resetForm.processing || !resetForm.data.confirm}
                      className="flex-1"
                    >
                      {resetForm.processing ? 'Resetting...' : 'Reset Data'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
