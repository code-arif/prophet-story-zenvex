import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, Download, Upload, Plus, ArrowUpDown, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function AdminArticlesIndex({ articles, filters, postType }) {
  const [search, setSearch] = React.useState(filters?.search || '');
  const [sortBy, setSortBy] = React.useState(filters?.sort_by || 'published_at');
  const [sortDir, setSortDir] = React.useState(filters?.sort_dir || 'desc');
  const postTypeSlug = filters?.post_type || '';
  const fileInputRef = React.useRef(null);
  const deleteForm = useForm({});

  function destroy(id) {
    if (!confirm(
      'এই আর্টিকেলটি স্থায়ীভাবে মুছে যাবে — পুনরুদ্ধার সম্ভব নয়।\n\nআপনি কি নিশ্চিত?'
    )) return;
    deleteForm.delete(`/admin/articles/${id}`, { preserveScroll: true });
  }
  const [conflicts, setConflicts] = React.useState(null);
  const [currentFile, setCurrentFile] = React.useState(null);
  const [decisions, setDecisions] = React.useState({});
  const [showConflictModal, setShowConflictModal] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (filters?.search || '')) {
        handleFilter({ search });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function handleFilter(newFilters) {
    router.get('/admin/articles', { 
      ...filters, 
      ...newFilters,
      sort_by: sortBy,
      sort_dir: sortDir,
    }, { 
      preserveState: true,
      preserveScroll: true,
    });
  }

  function handleSort(column) {
    const newSortDir = sortBy === column && sortDir === 'desc' ? 'asc' : 'desc';
    setSortBy(column);
    setSortDir(newSortDir);
    router.get('/admin/articles', {
      ...filters,
      search,
      sort_by: column,
      sort_dir: newSortDir,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }

  function handleExport() {
    window.location.href = '/admin/articles/export';
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFile(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/admin/articles/import', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 409) {
        // Conflicts found
        setConflicts(data.conflicts || []);
        const initialDecisions = {};
        (data.conflicts || []).forEach((conflict, idx) => {
          initialDecisions[conflict.index] = 'skip';
        });
        setDecisions(initialDecisions);
        setShowConflictModal(true);
      } else if (response.ok) {
        router.reload({ only: ['articles'] });
        alert('Articles imported successfully!');
      } else {
        alert('Import failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Import failed: ' + err.message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleConfirmedImport() {
    if (!currentFile) return;

    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('confirm', 'true');
    formData.append('decisions', JSON.stringify(decisions));

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/admin/articles/import', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setShowConflictModal(false);
        setConflicts(null);
        setCurrentFile(null);
        setDecisions({});
        router.reload({ only: ['articles'] });
        alert(data.message || 'Articles imported successfully!');
      } else {
        alert('Import failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  }

  function SortButton({ column, children }) {
    const isActive = sortBy === column;
    return (
      <button
        onClick={() => handleSort(column)}
        className="flex items-center gap-1 font-medium transition-colors hover:text-[hsl(var(--foreground))]"
      >
        {children}
        <ArrowUpDown className={`size-3 ${isActive ? 'text-[hsl(var(--primary))]' : ''}`} />
      </button>
    );
  }

  return (
    <AdminShell title={postType ? `${postType.icon || ''} ${postType.name}` : 'Articles'}>
      <Head title={postType ? `${postType.name} — Admin` : 'Admin Articles'} />

      {/* Page header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          {articles?.total || 0} {postType ? postType.name : 'articles'}
          {postType && <span className="ml-2 rounded-full bg-[hsl(var(--primary)/0.1)] px-2 py-0.5 text-xs text-[hsl(var(--primary))]">{postType.slug}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 size-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button asChild>
            <Link href={`/admin/articles/create${postTypeSlug ? `?post_type=${postTypeSlug}` : ''}`}>
              <Plus className="mr-2 size-4" />
              {postType ? `New ${postType.name}` : 'New Article'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, slug, or excerpt..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-[hsl(var(--muted-foreground))]">
                  <SortButton column="title">Article</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs text-[hsl(var(--muted-foreground))]">
                  <SortButton column="published_at">Published</SortButton>
                </th>
                <th className="px-4 py-3 text-left text-xs text-[hsl(var(--muted-foreground))]">
                  <SortButton column="view_count">Views</SortButton>
                </th>
                <th className="px-4 py-3 text-right text-xs text-[hsl(var(--muted-foreground))]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {(articles?.data || []).map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-[hsl(var(--muted))]/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))]">
                        {a.featured_image_url ? (
                          <img src={a.featured_image_url} alt={a.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[hsl(var(--muted-foreground))]">
                            <Calendar className="size-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[hsl(var(--foreground))]">{a.title}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">/articles/{a.slug}</div>
                        {a.excerpt && (
                          <div className="mt-1 line-clamp-1 text-xs text-[hsl(var(--muted-foreground))]">{a.excerpt}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {a.published_at ? (
                        <>
                          <div className="text-[hsl(var(--foreground))]">
                            {new Date(a.published_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">
                            {new Date(a.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </>
                      ) : (
                        <span className="text-[hsl(var(--muted-foreground))]">Draft</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
                      <Eye className="size-3" />
                      {a.view_count ?? 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/articles/${a.id}/edit${postTypeSlug ? `?post_type=${postTypeSlug}` : ''}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        disabled={deleteForm.processing}
                        onClick={() => destroy(a.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {(!articles?.data || articles.data.length === 0) && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    {search ? 'No articles match your search.' : 'No articles yet. Create your first one!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {articles?.links && articles.links.length > 0 && (
          <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-4 py-3">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Showing {articles.from || 0} to {articles.to || 0} of {articles.total || 0} results
            </div>
            <div className="flex items-center gap-1">
              {articles.links.map((link, index) => {
                if (link.label === '&laquo; Previous') {
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      disabled={!link.url}
                      onClick={() => link.url && router.get(link.url)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                  );
                }
                if (link.label === 'Next &raquo;') {
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      disabled={!link.url}
                      onClick={() => link.url && router.get(link.url)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  );
                }
                return (
                  <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url)}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Conflict Resolution Modal */}
      {showConflictModal && conflicts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowConflictModal(false)}>
          <div 
            className="bg-[hsl(var(--card))] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-[hsl(var(--border))] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">Import Conflicts Detected</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                {conflicts.length} article(s) already exist. Choose how to handle each conflict:
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {conflicts.map((conflict, idx) => (
                <div key={idx} className="p-4 bg-[hsl(var(--muted))]/30 rounded-xl border border-[hsl(var(--border))]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">CSV Data</div>
                      <div className="font-medium text-[hsl(var(--foreground))]">{conflict.csv_title}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">Slug: {conflict.csv_slug}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase mb-1">Existing Article</div>
                      <div className="font-medium text-[hsl(var(--foreground))]">{conflict.existing_title}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">ID: {conflict.existing_id} • Slug: {conflict.existing_slug}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`conflict-${idx}`}
                        value="skip"
                        checked={decisions[conflict.index] === 'skip'}
                        onChange={(e) => setDecisions({ ...decisions, [conflict.index]: e.target.value })}
                        className="text-[hsl(var(--primary))]"
                      />
                      <span className="text-sm">Skip (Do Nothing)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`conflict-${idx}`}
                        value="overwrite"
                        checked={decisions[conflict.index] === 'overwrite'}
                        onChange={(e) => setDecisions({ ...decisions, [conflict.index]: e.target.value })}
                        className="text-[hsl(var(--primary))]"
                      />
                      <span className="text-sm">Overwrite Existing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`conflict-${idx}`}
                        value="create_new"
                        checked={decisions[conflict.index] === 'create_new'}
                        onChange={(e) => setDecisions({ ...decisions, [conflict.index]: e.target.value })}
                        className="text-[hsl(var(--primary))]"
                      />
                      <span className="text-sm">Create New (Auto-generate slug)</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(var(--border))]">
              <Button variant="outline" onClick={() => {
                setShowConflictModal(false);
                setConflicts(null);
                setCurrentFile(null);
                setDecisions({});
              }}>
                Cancel
              </Button>
              <Button onClick={handleConfirmedImport}>
                Proceed with Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
