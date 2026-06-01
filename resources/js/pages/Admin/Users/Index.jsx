import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';

export default function UsersIndex({ users, roles, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/users', { search, role: roleFilter }, { preserveState: true });
  };

  const handleDelete = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(`/admin/users/${userId}`, {
        preserveScroll: true,
      });
    }
  };

  const getRoleBadgeColor = (roleName) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminShell title="Users">
      <Head title="Admin Users" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Manage admin users and assign roles
            </p>
          </div>
          <Link
            href="/admin/users/create"
            className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
          >
            Add User
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.display_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-[hsl(var(--primary))] px-6 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
            >
              Search
            </button>
            {(search || roleFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setRoleFilter('');
                  router.get('/admin/users');
                }}
                className="rounded-xl border border-[hsl(var(--border))] px-4 py-2 text-sm hover:bg-[hsl(var(--accent))]"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Users Table */}
        <div className="rounded-3xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Phone
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Roles
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Created
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-[hsl(var(--accent))]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-sm font-semibold text-[hsl(var(--primary-foreground))]">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          {user.is_admin && (
                            <div className="text-xs text-[hsl(var(--muted-foreground))]">
                              Admin
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">{user.email}</td>
                    <td className="px-5 py-4 text-sm">{user.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.length > 0 ? (
                          user.roles.map((role) => (
                            <span
                              key={role.id}
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(
                                role.name
                              )}`}
                            >
                              {role.display_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            No roles
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="rounded-lg bg-[hsl(var(--primary))] px-3 py-1 text-xs font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg bg-[hsl(var(--destructive))] px-3 py-1 text-xs font-medium text-white hover:bg-[hsl(var(--destructive))]/90"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.links && users.links.length > 3 && (
            <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-5 py-3">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Showing {users.from} to {users.to} of {users.total} users
              </div>
              <div className="flex gap-1">
                {users.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      link.active
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                        : 'hover:bg-[hsl(var(--accent))]'
                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
