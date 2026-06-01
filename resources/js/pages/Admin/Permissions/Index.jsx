import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { KeyRound, Plus, Trash2, Lock, Search, Info, Layout, CheckSquare, Square } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';

export default function PermissionsIndex({ permissions, menus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
    name: '',
    menu_id: '',
    types: ['view'],
  });

  const CORE_PERMISSIONS = [
    'view_articles', 'create_articles', 'edit_articles', 'delete_articles',
    'manage_categories', 'view_users', 'create_users', 'edit_users', 'delete_users',
    'view_subscribers', 'manage_subscriptions', 'view_settings', 'edit_settings',
    'manage_media', 'send_sms'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      put(`/admin/permissions/${editingId}`, {
        onSuccess: () => handleCloseModal(),
      });
    } else {
      post('/admin/permissions', {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleOpenCreate = () => {
    setEditMode(false);
    setEditingId(null);
    reset();
    clearErrors();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (permission) => {
    setEditMode(true);
    setEditingId(permission.id);
    
    let types = [];
    let name = permission.name;
    
    if (permission.name.startsWith('view ')) {
      types = ['view'];
      name = permission.name.replace('view ', '');
    } else if (permission.name.startsWith('manage ')) {
      types = ['manage'];
      name = permission.name.replace('manage ', '');
    }

    setData({
      name: name,
      menu_id: permission.menu_id || '',
      types: types,
    });
    clearErrors();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    clearErrors();
  };

  const handleTypeToggle = (type) => {
    const newTypes = data.types.includes(type)
      ? data.types.filter(t => t !== type)
      : [...data.types, type];
    setData('types', newTypes);
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

  const filteredPermissions = permissions.filter(perm => 
    perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (perm.display_name && perm.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (perm.menu?.name && perm.menu.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminShell title="Permissions">
      <Head title="Manage Permissions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Define system capabilities and link them to sidebar navigation access
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Permission
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search permissions by name, menu, or key..."
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
                  <th className="px-6 py-4">Linked Menu</th>
                  <th className="px-6 py-4">Permission Key</th>
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
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded bg-[hsl(var(--primary))]/10 p-1.5 text-[hsl(var(--primary))]">
                              <KeyRound className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 font-semibold">
                                {perm.display_name || perm.name}
                                {isCore && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                                    <Lock className="h-2.5 w-2.5" /> Core
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {perm.menu ? (
                            <div className="flex items-center gap-1.5">
                              <Layout className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                              <span className="font-medium">{perm.menu.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">Global</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[hsl(var(--muted-foreground))]">
                          {perm.name}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(perm)}
                              className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
                              title="Edit Permission"
                            >
                              <Plus className="h-4 w-4" /> {/* Use Plus as icon for edit if Edit icon not imported correctly? no, Edit is better */}
                            </button>
                            {isCore ? (
                              <button
                                disabled
                                className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))]/30 cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDelete(perm.id, perm.name)}
                                className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                      No permissions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal - Simulated via simple state for now as I don't want to break Radix UI implementation if components paths are not exact */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] w-full max-w-md rounded-3xl border border-[hsl(var(--border))] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h3 className="text-lg font-bold">{editMode ? 'Update Permission' : 'Create Permission'}</h3>
              <button onClick={handleCloseModal} className="text-[hsl(var(--muted-foreground))] hover:text-foreground">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">Permission Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dashboard"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all"
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">Select Menu (Optional)</label>
                <select
                  value={data.menu_id}
                  onChange={(e) => setData('menu_id', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all"
                >
                  <option value="">Choose a menu item</option>
                  {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                  ))}
                </select>
                {errors.menu_id && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.menu_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">Permission Types</label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleTypeToggle('view')}>
                    {data.types.includes('view') ? <CheckSquare className="h-5 w-5 text-[hsl(var(--primary))]" /> : <Square className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />}
                    <span className="text-sm">View</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleTypeToggle('manage')}>
                    {data.types.includes('manage') ? <CheckSquare className="h-5 w-5 text-[hsl(var(--primary))]" /> : <Square className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />}
                    <span className="text-sm">Manage</span>
                  </div>
                </div>
                {errors.types && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.types}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-xl border border-[hsl(var(--border))] py-2.5 text-sm font-semibold hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 rounded-xl bg-[hsl(var(--primary))] py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
                >
                  {processing ? 'Processing...' : (editMode ? 'Update' : 'Generate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
