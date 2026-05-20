import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';

export default function UsersCreate({ roles, permissions }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    roles: [],
    permissions: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/api/admin/users');
  };

  const toggleRole = (roleId) => {
    const newRoles = data.roles.includes(roleId)
      ? data.roles.filter((id) => id !== roleId)
      : [...data.roles, roleId];
    setData('roles', newRoles);
  };

  const togglePermission = (permissionId) => {
    const newPermissions = data.permissions.includes(permissionId)
      ? data.permissions.filter((id) => id !== permissionId)
      : [...data.permissions, permissionId];
    setData('permissions', newPermissions);
  };

  return (
    <AdminShell title="Create User">
      <Head title="Create User" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link
            href="/api/admin/users"
            className="rounded-xl border border-[hsl(var(--border))] px-3 py-2 text-sm hover:bg-[hsl(var(--accent))]"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold">Create New User</h1>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">Name *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
                required
              />
              {errors.name && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.name}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">Email *</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
                required
              />
              {errors.email && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">Phone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
              />
              {errors.phone && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.phone}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">Password *</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
                required
              />
              {errors.password && (
                <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">Confirm Password *</label>
              <input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
                required
              />
            </div>

            {/* Roles and Permissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Roles */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[hsl(var(--foreground))]">Assign Roles</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))] p-3 bg-[hsl(var(--background))]/50 hover:bg-[hsl(var(--accent))]/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={data.roles.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="mt-1 h-4 w-4 rounded border-[hsl(var(--border))]"
                      />
                      <div className="flex-1">
                        <label htmlFor={`role-${role.id}`} className="block text-sm font-medium cursor-pointer">
                          {role.display_name}
                        </label>
                        {role.description && (
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.roles && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.roles}</div>}
              </div>

              {/* Direct Permissions */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[hsl(var(--foreground))]">Assign Direct Permissions</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))] p-3 bg-[hsl(var(--background))]/50 hover:bg-[hsl(var(--accent))]/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        checked={data.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1 h-4 w-4 rounded border-[hsl(var(--border))]"
                      />
                      <div className="flex-1">
                        <label htmlFor={`permission-${permission.id}`} className="block text-sm font-medium cursor-pointer">
                          {permission.display_name || permission.name}
                        </label>
                        {permission.description && (
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.permissions && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.permissions}</div>}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-[hsl(var(--border))]">
              <button
                type="submit"
                disabled={processing}
                className="rounded-xl bg-[hsl(var(--primary))] px-6 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50"
              >
                {processing ? 'Creating...' : 'Create User'}
              </button>
              <Link
                href="/api/admin/users"
                className="rounded-xl border border-[hsl(var(--border))] px-6 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
