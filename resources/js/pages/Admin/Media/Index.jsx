import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { File, Image, Trash2, Upload, Video, FileText, X, Folder, Home, ChevronRight, RefreshCw, Plus, FolderPlus, Package, Edit, Star, FolderInput, Edit2 } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

function FileIcon({ type, className = 'size-8' }) {
  switch (type) {
    case 'image':
      return <Image className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'document':
      return <FileText className={className} />;
    case 'apk':
      return <Package className={className} />;
    default:
      return <File className={className} />;
  }
}

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

function MediaCard({ file, onDelete, onEdit, onMove, onRename }) {
  const isImage = file.type === 'image';
  const isApk = file.type === 'apk';
  const url = file.url || `/storage/${file.path}`;

  return (
    <div className="group relative rounded-2xl bg-[hsl(var(--card))] p-3 ring-1 ring-[hsl(var(--border))] transition-all hover:ring-[hsl(var(--primary))]">
      <div className="aspect-square overflow-hidden rounded-xl bg-[hsl(var(--muted))]">
        {isImage ? (
          <img src={url} alt={file.name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-[hsl(var(--muted-foreground))]">
            <FileIcon type={file.type} className="size-12" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium text-[hsl(var(--foreground))]">{file.name}</div>
          {isApk && file.is_active && (
            <Star className="size-3 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
          <span>{formatSize(file.size)}</span>
          <span>•</span>
          <span className="uppercase">{file.type}</span>
          {isApk && file.version && (
            <>
              <span>•</span>
              <span>v{file.version}</span>
            </>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onRename(file)}
          className="rounded-full bg-[hsl(var(--primary))]/80 p-1.5 text-white hover:bg-[hsl(var(--primary))]"
          title="Rename"
        >
          <Edit2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onMove(file)}
          className="rounded-full bg-[hsl(var(--primary))]/80 p-1.5 text-white hover:bg-[hsl(var(--primary))]"
          title="Move to folder"
        >
          <FolderInput className="size-4" />
        </button>
        {isApk && (
          <button
            type="button"
            onClick={() => onEdit(file)}
            className="rounded-full bg-[hsl(var(--primary))]/80 p-1.5 text-white hover:bg-[hsl(var(--primary))]"
            title="Edit APK details"
          >
            <Edit className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(file)}
          className="rounded-full bg-[hsl(var(--destructive))]/80 p-1.5 text-white hover:bg-[hsl(var(--destructive))]"
          title="Delete"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function FolderCard({ folder, onClick, onDelete }) {
  return (
    <div
      className="group relative cursor-pointer rounded-2xl bg-[hsl(var(--card))] p-3 ring-1 ring-[hsl(var(--border))] transition-all hover:ring-[hsl(var(--primary))] hover:shadow-lg"
    >
      <div 
        onClick={() => onClick(folder.path)}
        className="aspect-square overflow-hidden rounded-xl bg-linear-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/5"
      >
        <div className="flex size-full items-center justify-center text-[hsl(var(--primary))]">
          <Folder className="size-16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        </div>
      </div>

      <div className="mt-2" onClick={() => onClick(folder.path)}>
        <div className="truncate text-sm font-medium text-[hsl(var(--foreground))]">{folder.name}</div>
        <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{folder.file_count} files</div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(folder);
        }}
        className="absolute right-2 top-2 rounded-full bg-[hsl(var(--destructive))]/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[hsl(var(--destructive))]"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function CreateFolderModal({ open, onClose, currentFolder }) {
  const form = useForm({
    folder_name: '',
    parent_folder: currentFolder || '',
  });

  function submit(e) {
    e.preventDefault();
    form.post('/admin/media/folder', {
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
          <h3 className="text-lg font-semibold">Create New Folder</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Folder Name</label>
            <Input
              value={form.data.folder_name}
              onChange={(e) => form.setData('folder_name', e.target.value)}
              placeholder="e.g. images, icons, documents"
              required
            />
            {form.errors.folder_name && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.folder_name}</div>}
          </div>

          {currentFolder && (
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Will be created in: <span className="font-medium text-[hsl(var(--foreground))]">{currentFolder}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing} className="flex-1">
              {form.processing ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadModal({ open, onClose, currentFolder, allFolders = [] }) {
  const [folderMode, setFolderMode] = useState('current'); // 'current', 'select', or 'custom'
  const [customFolderPath, setCustomFolderPath] = useState('');
  
  const form = useForm({
    file: null,
    name: '',
    description: '',
    collection: currentFolder || '',
  });

  // Update collection when currentFolder changes
  React.useEffect(() => {
    if (currentFolder) {
      form.setData('collection', currentFolder);
      setFolderMode('current');
    } else {
      setFolderMode('select');
    }
  }, [currentFolder]);

  function submit(e) {
    e.preventDefault();
    
    // Set the collection based on the selected mode
    let finalCollection = '';
    if (folderMode === 'current') {
      finalCollection = currentFolder || '';
    } else if (folderMode === 'custom') {
      finalCollection = customFolderPath.trim();
    }
    // For 'select' mode, use form.data.collection as is
    
    if (folderMode !== 'select') {
      form.setData('collection', finalCollection);
    }
    
    form.post('/admin/media', {
      forceFormData: true,
      onSuccess: () => {
        onClose();
        form.reset();
        setFolderMode(currentFolder ? 'current' : 'select');
        setCustomFolderPath('');
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
          <h3 className="text-lg font-semibold">Upload File</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">File</label>
            <input
              type="file"
              onChange={(e) => form.setData('file', e.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
            />
            {form.errors.file && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.file}</div>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name (optional)</label>
            <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Leave empty to use filename" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Description (optional)</label>
            <textarea
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
              rows={2}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-[hsl(var(--muted-foreground))]">Upload to Folder</label>
              <div className="flex gap-1">
                {currentFolder && (
                  <button
                    type="button"
                    onClick={() => setFolderMode('current')}
                    className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                      folderMode === 'current'
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                        : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/80'
                    }`}
                  >
                    Current
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFolderMode('select')}
                  className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                    folderMode === 'select'
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/80'
                  }`}
                >
                  Select
                </button>
                <button
                  type="button"
                  onClick={() => setFolderMode('custom')}
                  className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                    folderMode === 'custom'
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/80'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {folderMode === 'current' ? (
              <div className="rounded-xl bg-[hsl(var(--muted))] px-4 py-3">
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">📁 {currentFolder || 'Root'}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">Current folder</div>
              </div>
            ) : folderMode === 'select' ? (
              <>
                <select
                  value={form.data.collection}
                  onChange={(e) => form.setData('collection', e.target.value)}
                  className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
                >
                  <option value="">Root folder</option>
                  {allFolders && allFolders.length > 0 ? (
                    allFolders.map((folder) => (
                      <option key={folder} value={folder}>
                        📁 {folder}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="media">media</option>
                      <option value="media/images">media/images</option>
                      <option value="media/videos">media/videos</option>
                      <option value="apk">apk</option>
                    </>
                  )}
                </select>
                {form.data.collection && (
                  <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">📁 Uploading to: <span className="font-medium text-[hsl(var(--primary))]">{form.data.collection || 'Root'}</span></p>
                )}
              </>
            ) : (
              <>
                <Input
                  value={customFolderPath}
                  onChange={(e) => setCustomFolderPath(e.target.value)}
                  placeholder="Type folder path (e.g., media/images, icons, docs/pdfs)"
                  className="w-full"
                />
                <div className="mt-2 space-y-1">
                  {customFolderPath ? (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">📁 Will upload to: <span className="font-medium text-[hsl(var(--primary))]">{customFolderPath}</span></p>
                  ) : (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Type a folder path or leave empty for root</p>
                  )}
                  <p className="text-xs text-[hsl(var(--muted-foreground))]/70">💡 Tip: Use slashes (/) to create nested folders</p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing || !form.data.file}>
              {form.processing ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditMediaModal({ open, onClose, file }) {
  const form = useForm({
    name: file?.name || '',
    version: file?.version || '',
    download_filename: file?.download_filename || '',
    description: file?.description || '',
    is_active: file?.is_active || false,
  });

  React.useEffect(() => {
    if (file) {
      form.setData({
        name: file.name || '',
        version: file.version || '',
        download_filename: file.download_filename || '',
        description: file.description || '',
        is_active: file.is_active || false,
      });
    }
  }, [file]);

  function submit(e) {
    e.preventDefault();
    form.put(`/admin/media/${file.id}`, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit APK Details</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name</label>
            <Input
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              placeholder="e.g., BD Election Daily App"
              required
            />
            {form.errors.name && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name}</div>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Version</label>
            <Input
              value={form.data.version}
              onChange={(e) => form.setData('version', e.target.value)}
              placeholder="e.g., 1.0.0"
            />
            {form.errors.version && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.version}</div>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Download Filename</label>
            <Input
              value={form.data.download_filename}
              onChange={(e) => form.setData('download_filename', e.target.value)}
              placeholder="e.g., my-app-v1.0.0.apk (auto-generated from brand name if not specified)"
            />
            {form.errors.download_filename && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.download_filename}</div>}
            <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
              This will be the filename when users download the APK
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Description</label>
            <textarea
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
              rows={3}
              placeholder="What's new in this version?"
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

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing} className="flex-1">
              {form.processing ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MoveModal({ open, onClose, file, currentFolder, allFolders = [] }) {
  const form = useForm({
    folder: file?.collection || '',
  });

  function submit(e) {
    e.preventDefault();
    form.post(`/admin/media/${file.id}/move`, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  if (!open || !file) return null;

  // Get unique folders from all folders for selection
  const folderOptions = [...new Set(allFolders.map(f => f.path))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Move File</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="rounded-xl bg-[hsl(var(--muted))] p-3">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Moving:</div>
            <div className="font-medium text-[hsl(var(--foreground))]">{file.name}</div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Destination Folder</label>
            <select
              value={form.data.folder}
              onChange={(e) => form.setData('folder', e.target.value)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
            >
              <option value="">Root Folder</option>
              {folderOptions.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
            {form.errors.folder && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.folder}</div>}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing} className="flex-1">
              {form.processing ? 'Moving...' : 'Move File'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RenameModal({ open, onClose, file }) {
  const form = useForm({
    name: file?.name || '',
  });

  function submit(e) {
    e.preventDefault();
    form.post(`/admin/media/${file.id}/rename`, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Rename File</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="rounded-xl bg-[hsl(var(--muted))] p-3">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Current name:</div>
            <div className="font-medium text-[hsl(var(--foreground))]">{file.name}</div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">New Name</label>
            <Input
              value={form.data.name}
              onChange={(e) => form.setData('name', e.target.value)}
              placeholder="Enter new file name"
              required
            />
            {form.errors.name && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.name}</div>}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={form.processing} className="flex-1">
              {form.processing ? 'Renaming...' : 'Rename File'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminMediaIndex({ folders = [], files = [], currentFolder, breadcrumbs = [], pagination, filters, types, lastSync, basePath = '', baseUrl = '', fullBaseUrl = '', allFolders = [] }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [movingFile, setMovingFile] = useState(null);
  const [renamingFile, setRenamingFile] = useState(null);
  const [typeFilter, setTypeFilter] = useState(filters?.type || '');
  const [syncing, setSyncing] = useState(false);

  function navigateToFolder(folderPath) {
    const params = new URLSearchParams();
    if (folderPath) params.set('folder', folderPath);
    if (typeFilter) params.set('type', typeFilter);
    router.get(`/admin/media?${params.toString()}`);
  }

  function handleSync() {
    setSyncing(true);
    router.post('/admin/media/sync', {}, {
      onFinish: () => setSyncing(false),
    });
  }

  function handleDeleteFolder(folder) {
    if (!confirm(`Delete folder "${folder.name}" and all its contents?`)) return;
    router.delete('/admin/media/folder', {
      data: { folder_path: folder.path },
    });
  }

  function handleDelete(file) {
    if (!confirm(`Delete "${file.name}"?`)) return;
    router.delete(`/admin/media/${file.id}`);
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (currentFolder) params.set('folder', currentFolder);
    if (typeFilter) params.set('type', typeFilter);
    router.get(`/admin/media?${params.toString()}`);
  }

  const items = [...folders, ...files];
  const isRootView = !currentFolder;

  return (
    <AdminShell title="Media Manager">
      <Head title="Media Manager" />

      <div className="grid gap-4">

        <div>
          {/* Root path indicator */}
          {isRootView && fullBaseUrl && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[hsl(var(--muted))] px-4 py-2.5 text-sm">
              <Home className="size-4 text-[hsl(var(--primary))]" />
              <span className="font-medium text-[hsl(var(--foreground))]">Root:</span>
              <code className="rounded bg-[hsl(var(--background))] px-2 py-0.5 text-xs text-[hsl(var(--primary))]">
                {fullBaseUrl}/
              </code>
            </div>
          )}

          {/* Breadcrumbs */}
          {!isRootView && (
            <div className="mb-4 flex items-center gap-2 text-sm">
              <button onClick={() => navigateToFolder(null)} className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" title={fullBaseUrl || 'Root'}>
                <Home className="size-4" />
                <span>Root {basePath && `(${basePath})`}</span>
              </button>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  <ChevronRight className="size-4 text-[hsl(var(--muted-foreground))]" />
                  <button
                    onClick={() => navigateToFolder(crumb.path)}
                    className={`hover:text-[hsl(var(--foreground))] ${
                      index === breadcrumbs.length - 1 ? 'font-medium text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {!isRootView && (
                <>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm"
                  >
                    <option value="">All types</option>
                    {types?.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>

                  <Button variant="outline" size="sm" onClick={applyFilters}>
                    Filter
                  </Button>
                </>
              )}

              {!isRootView && (
                <Button variant="outline" size="sm" onClick={() => navigateToFolder(null)}>
                  <Home className="mr-2 size-4" />
                  Back to Folders
                </Button>
              )}

              {lastSync && (
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  Last synced: {new Date(lastSync).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSync} disabled={syncing}>
                <RefreshCw className={`mr-2 size-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Refresh'}
              </Button>
              <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
                <FolderPlus className="mr-2 size-4" />
                New Folder
              </Button>
              {!isRootView && (
                <Button onClick={() => setUploadOpen(true)}>
                  <Upload className="mr-2 size-4" />
                  Upload
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <div className="rounded-3xl bg-[hsl(var(--card))] p-12 text-center ring-1 ring-[hsl(var(--border))]">
              <Folder className="mx-auto size-12 text-[hsl(var(--muted-foreground))]" />
              <div className="mt-4 text-lg font-medium">{isRootView ? 'No folders yet' : 'This folder is empty'}</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {isRootView ? 'Upload a file to create your first folder.' : 'Upload files to this folder to get started.'}
              </div>
              {!isRootView && (
                <Button className="mt-4" onClick={() => setUploadOpen(true)}>
                  <Upload className="mr-2 size-4" />
                  Upload File
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {folders.map((folder) => (
                  <FolderCard key={folder.path} folder={folder} onClick={navigateToFolder} onDelete={handleDeleteFolder} />
                ))}
                {files.map((file) => (
                  <MediaCard 
                    key={file.id} 
                    file={file} 
                    onDelete={handleDelete} 
                    onEdit={setEditingFile}
                    onMove={setMovingFile}
                    onRename={setRenamingFile}
                  />
                ))}
              </div>

              {pagination && pagination.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {pagination.links?.map((link, i) => (
                    <button
                      key={i}
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        link.active
                          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                          : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))/80]'
                      } disabled:opacity-50`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CreateFolderModal open={createFolderOpen} onClose={() => setCreateFolderOpen(false)} currentFolder={currentFolder} />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} currentFolder={currentFolder} allFolders={allFolders} />
      <EditMediaModal open={!!editingFile} onClose={() => setEditingFile(null)} file={editingFile} />
      <MoveModal open={!!movingFile} onClose={() => setMovingFile(null)} file={movingFile} currentFolder={currentFolder} allFolders={allFolders} />
      <RenameModal open={!!renamingFile} onClose={() => setRenamingFile(null)} file={renamingFile} />
    </AdminShell>
  );
}
