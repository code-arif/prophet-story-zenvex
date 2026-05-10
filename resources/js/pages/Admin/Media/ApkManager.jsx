import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Download, Package, Star, Trash2, Upload, X, RefreshCw } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import SettingsNav from '../../../components/admin/SettingsNav';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size > 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

function ApkCard({ apk, isActive, onSetActive, onDelete }) {
  const url = apk.url || `/storage/${apk.path}`;

  return (
    <div
      className={`rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 transition-all ${
        isActive ? 'ring-[hsl(var(--primary))] ring-2' : 'ring-[hsl(var(--border))]'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[hsl(var(--muted))]">
          <Package className="size-7 text-[hsl(var(--muted-foreground))]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold">{apk.name}</div>
            {isActive && (
              <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--primary))] px-2 py-0.5 text-xs font-medium text-[hsl(var(--primary-foreground))]">
                <Star className="size-3" />
                Active
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <span>v{apk.version}</span>
            <span>•</span>
            <span>{formatSize(apk.size)}</span>
            <span>•</span>
            <span>{apk.download_count || 0} downloads</span>
          </div>

          {apk.description && <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{apk.description}</div>}

          <div className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
            Uploaded: {new Date(apk.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a href={url} download className="inline-flex items-center gap-2 rounded-2xl bg-[hsl(var(--muted))] px-4 py-2 text-sm hover:bg-[hsl(var(--muted))/80]">
          <Download className="size-4" />
          Download
        </a>

        {!isActive && (
          <Button variant="outline" size="sm" onClick={() => onSetActive(apk)}>
            <Star className="mr-1 size-4" />
            Set as Active
          </Button>
        )}

        <Button variant="outline" size="sm" className="text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10" onClick={() => onDelete(apk)}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function UploadModal({ open, onClose }) {
  const form = useForm({
    file: null,
    name: '',
    version: '',
    description: '',
    is_active: false,
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/apk', {
      forceFormData: true,
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload APK</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">APK File</label>
            <input
              type="file"
              accept=".apk"
              onChange={(e) => form.setData('file', e.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
            />
            {form.errors.file && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.file}</div>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Version *</label>
            <Input
              value={form.data.version}
              onChange={(e) => form.setData('version', e.target.value)}
              placeholder="e.g., 1.0.0"
              required
            />
            {form.errors.version && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.version}</div>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">App Name (optional)</label>
            <Input
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              placeholder="Leave empty for default"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Description (optional)</label>
            <textarea
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
              placeholder="What's new in this version?"
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
              rows={3}
            />
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border-[hsl(var(--border))] bg-[hsl(var(--background))]"
              checked={form.data.is_active}
              onChange={(e) => form.setData('is_active', e.target.checked)}
            />
            Set as active download
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing || !form.data.file || !form.data.version}>
              {form.processing ? 'Uploading…' : 'Upload APK'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminApkManager({ apks, activeApk, lastSync }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    router.post('/admin/media/sync', {}, {
      onFinish: () => setSyncing(false),
    });
  }

  function handleSetActive(apk) {
    if (!confirm(`Set "${apk.name} v${apk.version}" as the active download?`)) return;
    router.post(`/admin/apk/${apk.id}/activate`);
  }

  function handleDelete(apk) {
    if (!confirm(`Delete "${apk.name} v${apk.version}"? This cannot be undone.`)) return;
    router.delete(`/admin/apk/${apk.id}`);
  }

  const apkList = apks || [];

  return (
    <AdminShell title="Settings">
      <Head title="Mobile App (APK)" />

      <div className="grid gap-4">

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Upload and manage Android APK files. The active APK will be available for download on the app page.
              </div>
              {lastSync && (
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Last synced: {new Date(lastSync).toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSync} disabled={syncing}>
                <RefreshCw className={`mr-2 size-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Refresh'}
              </Button>
              <Button onClick={() => setUploadOpen(true)}>
                <Upload className="mr-2 size-4" />
                Upload APK
              </Button>
            </div>
          </div>

          {apkList.length === 0 ? (
            <div className="rounded-3xl bg-[hsl(var(--card))] p-12 text-center ring-1 ring-[hsl(var(--border))]">
              <Package className="mx-auto size-16 text-[hsl(var(--muted-foreground))]" />
              <div className="mt-4 text-lg font-medium">No APK uploaded</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Upload your first APK to make it available for download.
              </div>
              <Button className="mt-4" onClick={() => setUploadOpen(true)}>
                <Upload className="mr-2 size-4" />
                Upload APK
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {apkList.map((apk) => (
                <ApkCard
                  key={apk.id}
                  apk={apk}
                  isActive={activeApk?.id === apk.id}
                  onSetActive={handleSetActive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </AdminShell>
  );
}
