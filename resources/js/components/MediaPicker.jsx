import React, { useState, useEffect } from 'react';
import { Check, Image, Upload, X, Search, File, Folder, Home, ChevronRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';

import { Button } from './ui/button';
import { Input } from './ui/input';

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

function FolderItem({ folder, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(folder.path)}
      className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/5 ring-2 ring-transparent transition-all hover:ring-[hsl(var(--border))] hover:shadow-md"
    >
      <div className="flex size-full items-center justify-center text-[hsl(var(--primary))]">
        <Folder className="size-12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <div className="truncate text-xs font-medium text-white">{folder.name}</div>
        <div className="text-[10px] text-white/70">{folder.file_count || 0} files</div>
      </div>
    </button>
  );
}

function MediaItem({ file, selected, onSelect }) {
  const isImage = file.type === 'image';
  const url = file.url || `/storage/${file.path}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(file)}
      className={`group relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
        selected ? 'ring-[hsl(var(--primary))]' : 'ring-transparent hover:ring-[hsl(var(--border))]'
      }`}
    >
      {isImage ? (
        <img src={url} alt={file.name} className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center bg-[hsl(var(--muted))]">
          <File className="size-8 text-[hsl(var(--muted-foreground))]" />
        </div>
      )}

      {selected && (
        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--primary))]/20">
          <div className="rounded-full bg-[hsl(var(--primary))] p-1">
            <Check className="size-4 text-[hsl(var(--primary-foreground))]" />
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <div className="truncate text-xs text-white">{file.name}</div>
        <div className="truncate text-[10px] text-white/70">{formatSize(file.size)}</div>
      </div>
    </button>
  );
}

function UploadTab({ onUploaded, currentFolder = '' }) {
  const fileInputRef = React.useRef(null);
  const page = usePage();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [folderMode, setFolderMode] = useState('select'); // 'select' or 'create'
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(currentFolder || '');

  // Update selected folder when currentFolder changes
  React.useEffect(() => {
    if (currentFolder) {
      setSelectedFolder(currentFolder);
    }
  }, [currentFolder]);

  function getCsrfToken() {
    // Try to get token from Inertia props first (more reliable)
    const inertiaToken = page?.props?._token || page?.props?.csrf_token;
    if (inertiaToken) return inertiaToken;
    
    // Fallback to meta tag
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }

  async function handleUpload() {
    if (!file || uploading) return;
    if (folderMode === 'create' && !newFolderName) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    // Determine final folder path
    let finalFolder = selectedFolder;
    if (folderMode === 'create' && newFolderName) {
      finalFolder = currentFolder 
        ? `${currentFolder}/${newFolderName}` 
        : newFolderName;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    formData.append('collection', finalFolder);

    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        setError('CSRF token not found. Please refresh the page.');
        setUploading(false);
        return;
      }

      const response = await fetch('/admin/media', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      if (response.ok) {
        setFile(null);
        setName('');
        setSuccess(true);
        setFolderMode('select');
        setNewFolderName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploaded();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || data.errors?.file?.[0] || `Upload failed (${response.status})`);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">File</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null;
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
          }}
          className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
        />
        {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
        {success && <div className="mt-1 text-xs text-green-400">Upload successful!</div>}
      </div>

      <div>
        <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Name (optional)</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Leave empty to use filename"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-[hsl(var(--muted-foreground))]">Upload to Folder</label>
          <div className="flex gap-2">
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
              onClick={() => setFolderMode('create')}
              className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                folderMode === 'create'
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/80'
              }`}
            >
              Create New
            </button>
          </div>
        </div>

        {folderMode === 'select' ? (
          <>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm"
            >
              <option value="">Root folder</option>
              {currentFolder && (
                <option value={currentFolder}>📁 {currentFolder} (current)</option>
              )}
              <option value="icons">icons</option>
              <option value="apk">apk</option>
              <option value="media">media</option>
              <option value="media/images">media/images</option>
              <option value="media/videos">media/videos</option>
              <option value="media/documents">media/documents</option>
            </select>
            {currentFolder && selectedFolder === currentFolder && (
              <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">📁 Uploading to current folder: <span className="font-medium text-[hsl(var(--primary))]">{currentFolder}</span></p>
            )}
          </>
        ) : (
          <>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter new folder name (e.g., images, icons)"
              className="w-full"
            />
            {newFolderName && (
              <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">Will create: <span className="font-medium text-[hsl(var(--primary))]">
                {currentFolder ? `${currentFolder}/${newFolderName}` : newFolderName}
              </span></p>
            )}
            {currentFolder && (
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]/70">Creating subfolder inside: {currentFolder}</p>
            )}
          </>
        )}
      </div>

      <Button 
        type="button" 
        onClick={handleUpload} 
        disabled={uploading || !file || (folderMode === 'create' && !newFolderName)} 
        className="w-full"
      >
        {uploading ? 'Uploading…' : 'Upload'}
      </Button>
    </div>
  );
}

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  accept = 'image', // 'image', 'video', 'document', 'all'
  multiple = false,
  title = 'Select Media',
  initialSelectedPath = null, // path of currently selected media
}) {
  const [tab, setTab] = useState('library'); // 'library' or 'upload'
  const [media, setMedia] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open, accept, currentFolder]);

  // Update selected state when media loads and we have an initialSelectedPath
  useEffect(() => {
    if (media.length > 0 && initialSelectedPath) {
      const matchedFile = media.find((f) => f.path === initialSelectedPath);
      if (matchedFile) {
        setSelected([matchedFile]);
      } else {
        setSelected([]);
      }
    } else if (!initialSelectedPath) {
      setSelected([]);
    }
  }, [media, initialSelectedPath, open]);

  async function fetchMedia() {
    setLoading(true);
    try {
      const type = accept === 'all' ? '' : accept;
      const folder = currentFolder || '';
      const response = await fetch(`/api/admin/media/api?type=${type}&folder=${folder}`);
      const data = await response.json();
      setMedia(data.files || data.media || []);
      setFolders(data.folders || []);
      setBreadcrumbs(data.breadcrumbs || []);
    } catch (err) {
      console.error('Failed to fetch media:', err);
      setMedia([]);
      setFolders([]);
      setBreadcrumbs([]);
    } finally {
      setLoading(false);
    }
  }

  function handleNavigateToFolder(folderPath) {
    setCurrentFolder(folderPath);
    setSearch('');
  }

  function handleBackToRoot() {
    setCurrentFolder(null);
    setSearch('');
  }

  function handleSelect(file) {
    if (multiple) {
      setSelected((prev) => {
        const exists = prev.find((f) => f.id === file.id);
        if (exists) {
          return prev.filter((f) => f.id !== file.id);
        }
        return [...prev, file];
      });
    } else {
      setSelected([file]);
    }
  }

  function handleConfirm() {
    if (selected.length === 0) return;

    if (multiple) {
      onSelect(selected);
    } else {
      onSelect(selected[0]);
    }
    onClose();
  }

  function handleUploaded() {
    fetchMedia();
    setTab('library');
  }

  const filteredMedia = search
    ? media.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : media;

  const isRootView = !currentFolder;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[hsl(var(--muted))]">
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[hsl(var(--border))]">
          <button
            type="button"
            onClick={() => setTab('library')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'library'
                ? 'border-b-2 border-[hsl(var(--primary))] text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <Image className="mr-2 inline-block size-4" />
            Media Library
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'upload'
                ? 'border-b-2 border-[hsl(var(--primary))] text-[hsl(var(--foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            <Upload className="mr-2 inline-block size-4" />
            Upload New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {tab === 'library' ? (
            <>
              {/* Breadcrumbs */}
              {!isRootView && (
                <div className="mb-4 flex items-center gap-2 text-sm flex-wrap">
                  <button 
                    onClick={handleBackToRoot} 
                    className="flex items-center gap-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    <Home className="size-4" />
                    <span>Home</span>
                  </button>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      <ChevronRight className="size-4 text-[hsl(var(--muted-foreground))]" />
                      <button
                        onClick={() => handleNavigateToFolder(crumb.path)}
                        className={`transition-colors hover:text-[hsl(var(--foreground))] ${
                          index === breadcrumbs.length - 1 
                            ? 'font-medium text-[hsl(var(--foreground))]' 
                            : 'text-[hsl(var(--muted-foreground))]'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Search - show in folders and at root if there are files */}
              {(!isRootView || filteredMedia.length > 0) && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={isRootView ? "Search files in root..." : "Search files in this folder..."}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {loading ? (
                <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">Loading...</div>
              ) : isRootView && folders.length === 0 && filteredMedia.length === 0 ? (
                <div className="py-12 text-center">
                  <Folder className="mx-auto size-12 text-[hsl(var(--muted-foreground))]" />
                  <div className="mt-2 text-[hsl(var(--muted-foreground))]">No folders or files available</div>
                  <Button className="mt-4" variant="outline" onClick={() => setTab('upload')}>
                    Upload to create folders
                  </Button>
                </div>
              ) : isRootView ? (
                <div className="space-y-4">
                  {folders.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">Folders</h4>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {folders.map((folder) => (
                          <FolderItem
                            key={folder.path}
                            folder={folder}
                            onNavigate={handleNavigateToFolder}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredMedia.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">Files in Root</h4>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {filteredMedia.map((file) => (
                          <MediaItem
                            key={file.id}
                            file={file}
                            selected={!!selected.find((f) => f.id === file.id)}
                            onSelect={handleSelect}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-12 text-center">
                  <Image className="mx-auto size-12 text-[hsl(var(--muted-foreground))]" />
                  <div className="mt-2 text-[hsl(var(--muted-foreground))]">
                    {search ? 'No files match your search' : 'This folder is empty'}
                  </div>
                  {!search && (
                    <Button className="mt-4" variant="outline" onClick={() => setTab('upload')}>
                      Upload a file
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {filteredMedia.map((file) => (
                    <MediaItem
                      key={file.id}
                      file={file}
                      selected={!!selected.find((f) => f.id === file.id)}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <UploadTab onUploaded={handleUploaded} currentFolder={currentFolder} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[hsl(var(--border))] p-4">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            {selected.length > 0 ? `${selected.length} selected` : isRootView ? 'Select a folder or file' : 'No selection'}
          </div>
          <div className="flex gap-2">
            {!isRootView && currentFolder && (
              <Button type="button" variant="outline" onClick={handleBackToRoot}>
                <Home className="mr-2 size-4" />
                Back to Folders
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={selected.length === 0}>
              {multiple ? 'Insert Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
