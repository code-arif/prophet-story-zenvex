import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { KeyRound, Plus, Trash2, Lock, Search, Info } from 'lucide-react';

export default function PermissionsIndex({ permissions }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, setData, post, reset, processing, errors } = useForm({
    name: '',
    display_name: '',
    description: '',
  });

  const CORE_PERMISSIONS = [
    'view_articles', 'create_articles', 'edit_articles', 'delete_articles',
    'manage_categories', 'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_subscribers', 'manage_subscriptions', 'view_settings', 'edit_settings',
    'manage_media', 'send_sms'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/permissions', {
      onSuccess: () => reset(),
    });
  };

  const handleDelete = (permId, permName) => {
    if (CORE_PERMISSIONS.includes(permName)) {
      alert('Core system permissions cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete the "${permName}" permission?`)) {
      router.delete(`/admin/permissions/${permId}`, {
        preserveScroll: true,
      });
    }
  };

  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(perm => 
    perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (perm.display_name && perm.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (perm.description && perm.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminShell title="Permissions">
      <Head title="Manage Permissions" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Define system capabilities and map out administrative access gates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Create Permission Form */}
          <div className="rounded-3xl bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))] shadow-sm space-y-4 lg:col-span-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-[hsl(var(--primary))]" />
              New Permission
            </h2>
            <hr className="border-[hsl(var(--border))]" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Publish Articles"
                  value={data.display_name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData(prev => ({
                      ...prev,
                      display_name: val,
                      name: prev.name === '' || prev.name === prev.display_name.toLowerCase().replace(/[^a-z0-9_]+/g, '_')
                        ? val.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '')
                        : prev.name
                    }));
                  }}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                  required
                />
                {errors.display_name && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.display_name}</div>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">System Key Name *</label>
                <input
                  type="text"
                  placeholder="e.g. publish_articles"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_'))}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                  required
                />
                {errors.name && <span className="mt-1 block text-sm text-[hsl(var(--destructive))]">{errors.name}</span>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="What capability does this permission grant?"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] min-h-[80px] transition-all"
                />
                {errors.description && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.description}</div>}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-[hsl(var(--primary))] py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 transition-colors shadow-sm"
              >
                {processing ? 'Creating...' : 'Create Permission'}
              </button>
            </form>
          </div>

          {/* Permissions Table List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-4 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search permissions by display name, key, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] shadow-sm transition-all"
              />
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                      <th className="px-6 py-4">Permission Name</th>
                      <th className="px-6 py-4">System Key</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--border))] text-sm">
                    {filteredPermissions.length > 0 ? (
                      filteredPermissions.map((perm) => {
                        const isCore = CORE_PERMISSIONS.includes(perm.name);
                        return (
                          <tr key={perm.id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 rounded bg-[hsl(var(--primary))]/10 p-1 text-[hsl(var(--primary))]">
                                  <KeyRound className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 font-semibold">
                                    {perm.display_name || perm.name}
                                    {isCore && (
                                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[hsl(var(--muted))] px-1.5 py-0.2 text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                                        <Lock className="h-2.5 w-2.5" /> Core
                                      </span>
                                    )}
                                  </div>
                                  {perm.description && (
                                    <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))] max-w-sm">
                                      {perm.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-[hsl(var(--muted-foreground))]">
                              {perm.name}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isCore ? (
                                <button
                                  disabled
                                  className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))]/30 cursor-not-allowed"
                                  title="Core permissions cannot be deleted"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDelete(perm.id, perm.name)}
                                  className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10 hover:border-[hsl(var(--destructive))]/25 transition-colors"
                                  title="Delete Permission"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-10 text-center text-[hsl(var(--muted-foreground))]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Info className="h-8 w-8 text-[hsl(var(--muted-foreground))]/50" />
                            <span>No permissions found matching search criteria.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
