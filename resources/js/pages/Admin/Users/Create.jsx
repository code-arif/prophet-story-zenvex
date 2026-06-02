import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import Select from 'react-select';

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
    post('/admin/users');
  };

  const toggleRole = (roleId) => {
    const newRoles = data.roles.includes(roleId)
      ? data.roles.filter((id) => id !== roleId)
      : [...data.roles, roleId];
    setData('roles', newRoles);
  };

  // Filter permissions to show only view/manage ones as requested
  const filteredPermissions = permissions.filter(p =>
    p.name.startsWith('view ') || p.name.startsWith('manage ')
  );

  const permissionOptions = filteredPermissions.map(p => ({
    value: p.id,
    label: p.display_name || p.name
  }));

  const handlePermissionChange = (selectedOptions) => {
    setData('permissions', selectedOptions ? selectedOptions.map(o => o.value) : []);
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--border))',
      backgroundColor: 'hsl(var(--background))',
      padding: '2px',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--primary) / 0.1)' : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--primary))',
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      borderRadius: '0.5rem',
      color: 'hsl(var(--primary))',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'hsl(var(--primary))',
      fontWeight: '500',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
          ? 'hsl(var(--primary) / 0.05)'
          : 'transparent',
      color: state.isSelected ? 'white' : 'inherit',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
      }
    })
  };

  return (
    <AdminShell title="Create User">
      <Head title="Create User" />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="rounded-xl border border-[hsl(var(--border))] px-3 py-2 text-sm hover:bg-[hsl(var(--accent))]"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold">Create New User</h1>
        </div>

        <div className="rounded-3xl bg-[hsl(var(--card))] p-6 ring-1 ring-[hsl(var(--border))]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Name *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                  required
                />
                {errors.name && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.name}</div>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                  required
                />
                {errors.email && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.email}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                />
                {errors.phone && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.phone}</div>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Password *</label>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                  required
                />
                {errors.password && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.password}</div>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Confirm Password *</label>
                <input
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-5 pt-2">
              <div>
                <label className="mb-3 block text-sm font-semibold">Assign Roles</label>
                <div className="flex flex-wrap gap-3">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => toggleRole(role.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer select-none transition-all ${data.roles.includes(role.id)
                          ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                          : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]'
                        }`}
                    >
                      <span className="text-sm font-medium">{role.display_name}</span>
                    </div>
                  ))}
                </div>
                {errors.roles && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.roles}</div>}
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold">Assign Direct Permissions</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  options={permissionOptions}
                  value={permissionOptions.filter(o => data.permissions.includes(o.value))}
                  onChange={handlePermissionChange}
                  styles={customSelectStyles}
                  placeholder="Select individual permissions..."
                  className="text-sm"
                />
                <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                  Showing only standard "View" and "Manage" permissions linked to sidebar menus.
                </p>
                {errors.permissions && <div className="mt-1 text-sm text-[hsl(var(--destructive))]">{errors.permissions}</div>}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[hsl(var(--border))]">
              <button
                type="submit"
                disabled={processing}
                className="rounded-xl bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
              >
                {processing ? 'Creating...' : 'Create User'}
              </button>
              <Link
                href="/admin/users"
                className="rounded-xl border border-[hsl(var(--border))] px-6 py-2.5 text-sm font-medium hover:bg-[hsl(var(--accent))] transition-all"
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
