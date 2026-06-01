import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Shield, Plus, Edit, Trash2, Lock, Info } from 'lucide-react';

export default function RolesIndex({ roles }) {
  const handleDelete = (roleId, roleName) => {
    if (['admin', 'moderator', 'editor'].includes(roleName)) {
      alert('System default roles cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete the "${roleName}" role?`)) {
      router.delete(`/admin/roles/${roleId}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <AdminShell title="Roles">
      <Head title="Manage Roles" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Manage user roles, configure permissions matrix, and control access levels
            </p>
          </div>
          <Link
            href="/admin/roles/create"
            className="flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </Link>
        </div>

        {/* Roles Table */}
        <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  <th className="px-6 py-4">Role Details</th>
                  <th className="px-6 py-4">System Name</th>
                  <th className="px-6 py-4">Assigned Permissions</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))] text-sm">
                {roles.map((role) => {
                  const isSystemRole = ['admin', 'moderator', 'editor'].includes(role.name);
                  return (
                    <tr key={role.id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 rounded-lg bg-[hsl(var(--primary))]/10 p-2 text-[hsl(var(--primary))]">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 font-semibold">
                              {role.display_name}
                              {isSystemRole && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5 text-xs font-medium text-[hsl(var(--secondary-foreground))]">
                                  <Lock className="h-3 w-3" />
                                  System
                                </span>
                              )}
                            </div>

                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-[hsl(var(--muted-foreground))]">
                        {role.name}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-lg">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.map((perm) => (
                              <span
                                key={perm.id}
                                className="inline-flex items-center rounded-md bg-[hsl(var(--muted))] px-2 py-0.5 text-xs text-[hsl(var(--muted-foreground))]"
                              >
                                {perm.display_name || perm.name}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-[hsl(var(--destructive))]">
                              <Info className="h-3.5 w-3.5" />
                              No permissions assigned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/roles/${role.id}/edit`}
                            className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
                            title="Edit Role"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          {isSystemRole ? (
                            <button
                              disabled
                              className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))]/40 cursor-not-allowed"
                              title="System roles cannot be deleted"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDelete(role.id, role.name)}
                              className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--border))] p-2 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10 hover:border-[hsl(var(--destructive))]/20 transition-colors"
                              title="Delete Role"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
