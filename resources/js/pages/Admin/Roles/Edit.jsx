import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Shield, ArrowLeft, CheckSquare, Square, Lock } from 'lucide-react';

export default function RolesEdit({ role, permissions, rolePermissionNames }) {
  const { data, setData, put, processing, errors } = useForm({
    name: role.name || '',
    display_name: role.display_name || '',
    description: role.description || '',
    permissions: rolePermissionNames || [],
  });

  const isSystemRole = ['admin', 'moderator', 'editor'].includes(role.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/roles/${role.id}`);
  };

  const handlePermissionToggle = (permName) => {
    const isChecked = data.permissions.includes(permName);
    const newPerms = isChecked
      ? data.permissions.filter(name => name !== permName)
      : [...data.permissions, permName];
    setData('permissions', newPerms);
  };

  // Group permissions dynamically
  const groupPermissions = (permissionsList) => {
    const groups = {
      'Articles & Content': [],
      'Categories': [],
      'User Management': [],
      'Subscribers': [],
      'Settings': [],
      'Media': [],
      'SMS': [],
      'Other Permissions': []
    };

    permissionsList.forEach(perm => {
      const name = perm.name.toLowerCase();
      if (name.includes('article')) {
        groups['Articles & Content'].push(perm);
      } else if (name.includes('categor')) {
        groups['Categories'].push(perm);
      } else if (name.includes('user')) {
        groups['User Management'].push(perm);
      } else if (name.includes('subscriber') || name.includes('subscription')) {
        groups['Subscribers'].push(perm);
      } else if (name.includes('setting')) {
        groups['Settings'].push(perm);
      } else if (name.includes('media')) {
        groups['Media'].push(perm);
      } else if (name.includes('sms')) {
        groups['SMS'].push(perm);
      } else {
        groups['Other Permissions'].push(perm);
      }
    });

    return Object.fromEntries(
      Object.entries(groups).filter(([_, items]) => items.length > 0)
    );
  };

  const groupedPerms = groupPermissions(permissions);

  const toggleGroup = (groupPermNames) => {
    const allSelected = groupPermNames.every(name => data.permissions.includes(name));
    let newPerms;
    if (allSelected) {
      // Remove all in this group
      newPerms = data.permissions.filter(name => !groupPermNames.includes(name));
    } else {
      // Add all in this group (without duplicates)
      newPerms = [...new Set([...data.permissions, ...groupPermNames])];
    }
    setData('permissions', newPerms);
  };

  return (
    <AdminShell title={`Edit Role: ${role.display_name}`}>
      <Head title={`Edit Role: ${role.display_name}`} />

      <div className="space-y-6 max-w-5xl">
        {/* Back Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/api/admin/roles"
            className="inline-flex items-center justify-center rounded-xl border border-[hsl(var(--border))] p-2.5 hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Role: {role.display_name}</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Modify role profile and adjust active permission settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Details */}
          <div className="rounded-3xl bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))] shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-[hsl(var(--primary))]" />
              Role Information
            </h2>
            <hr className="border-[hsl(var(--border))]" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Display Name *</label>
                <input
                  type="text"
                  value={data.display_name}
                  onChange={(e) => setData('display_name', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                  required
                />
                {errors.display_name && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.display_name}</div>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium flex items-center gap-1.5">
                  System Name (unique slug)
                  {role.name === 'admin' && (
                    <span className="inline-flex items-center text-xs text-[hsl(var(--muted-foreground))]" title="The default admin role slug cannot be modified">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={data.name}
                  disabled={role.name === 'admin'}
                  onChange={(e) => setData('name', e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_'))}
                  className={`w-full rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all ${
                    role.name === 'admin' ? 'bg-[hsl(var(--muted))] cursor-not-allowed text-[hsl(var(--muted-foreground))]' : 'bg-[hsl(var(--background))]'
                  }`}
                  required
                />
                {errors.name && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.name}</div>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] min-h-[100px] transition-all"
              />
              {errors.description && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.description}</div>}
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="rounded-3xl bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))] shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Permissions Assignment</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Select the capabilities this role is authorized to perform</p>
            </div>
            <hr className="border-[hsl(var(--border))]" />

            <div className="space-y-6">
              {Object.entries(groupedPerms).map(([groupName, groupItems]) => {
                const groupNames = groupItems.map(item => item.name);
                const allChecked = groupNames.every(name => data.permissions.includes(name));
                const someChecked = groupNames.some(name => data.permissions.includes(name)) && !allChecked;

                return (
                  <div key={groupName} className="border border-[hsl(var(--border))] rounded-2xl overflow-hidden bg-[hsl(var(--muted))]/5">
                    {/* Group Header */}
                    <div className="flex items-center justify-between bg-[hsl(var(--muted))]/20 px-4 py-3 border-b border-[hsl(var(--border))]">
                      <span className="font-semibold text-sm">{groupName}</span>
                      <button
                        type="button"
                        onClick={() => toggleGroup(groupNames)}
                        className="flex items-center gap-1.5 text-xs text-[hsl(var(--primary))] font-medium hover:underline transition-all"
                      >
                        {allChecked ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    {/* Group Checkboxes */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupItems.map((perm) => {
                        const checked = data.permissions.includes(perm.name);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => handlePermissionToggle(perm.name)}
                            className={`flex items-start gap-3 p-3 rounded-xl border border-[hsl(var(--border))] cursor-pointer hover:bg-[hsl(var(--muted))]/25 select-none transition-all ${
                              checked ? 'bg-[hsl(var(--primary))]/5 border-[hsl(var(--primary))]/30' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {checked ? (
                                <CheckSquare className="h-4.5 w-4.5 text-[hsl(var(--primary))]" />
                              ) : (
                                <Square className="h-4.5 w-4.5 text-[hsl(var(--muted-foreground))]" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{perm.display_name || perm.name}</div>
                              {perm.description && (
                                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                                  {perm.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.permissions && <div className="text-sm text-[hsl(var(--destructive))] mt-2">{errors.permissions}</div>}
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={processing}
              className="rounded-xl bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 transition-colors shadow-sm"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/roles"
              className="rounded-xl border border-[hsl(var(--border))] px-6 py-2.5 text-sm font-medium hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
