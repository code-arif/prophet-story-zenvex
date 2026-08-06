import React from 'react';
import { Plus, Trash2, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Input } from '../../../components/ui/input';

/* ── Basic form primitives (styled to match the admin design system) ── */

export function Field({ label, children, error, hint, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-medium text-[hsl(var(--muted-foreground))]">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]/70">{hint}</p>}
      {error && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{error}</p>}
    </div>
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={
        'min-h-[96px] w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))] ' +
        'placeholder:text-[hsl(var(--muted-foreground))]/50 outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]/20 ' +
        (props.className || '')
      }
    />
  );
}

export function Select({ value, onChange, options, placeholder, className = '' }) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={
        'w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none transition-colors focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]/20 ' +
        className
      }
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) =>
        typeof o === 'string' ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={
          'relative h-6 w-11 rounded-full transition-colors duration-200 ' +
          (checked ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground))]/25')
        }
      >
        <span
          className={
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ' +
            (checked ? 'left-[22px]' : 'left-0.5')
          }
        />
      </button>
      <span className="text-sm text-[hsl(var(--foreground))]">{label}</span>
    </label>
  );
}

export function SectionCard({ title, subtitle, children, right, className = '' }) {
  return (
    <div className={`rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))] ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function AddButton({ onClick, children, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[hsl(var(--border))] font-medium ' +
        'text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))]/5 ' +
        (small ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm')
      }
    >
      <Plus className="size-4" />
      {children}
    </button>
  );
}

export function RemoveButton({ onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || 'Remove'}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))]"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}

/* ── Pagination ── */

export function Paginator({ meta }) {
  if (!meta || !meta.links || meta.links.length <= 3) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      {meta.links.map((link, i) => {
        if (!link.url) {
          return (
            <span key={i} className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] opacity-50">
              {link.label.includes('Previous') ? (
                <ChevronLeft className="size-4" />
              ) : link.label.includes('Next') ? (
                <ChevronRight className="size-4" />
              ) : (
                <span className="px-1">…</span>
              )}
            </span>
          );
        }

        const isActive = link.active;
        return (
          <Link
            key={i}
            href={link.url}
            preserveScroll
            className={
              'inline-flex min-w-9 items-center justify-center rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ' +
              (isActive
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]')
            }
          >
            {link.label.includes('Previous') ? (
              <ChevronLeft className="size-4" />
            ) : link.label.includes('Next') ? (
              <ChevronRight className="size-4" />
            ) : (
              link.label
            )}
          </Link>
        );
      })}
    </div>
  );
}

/* ── Repeatable-item editors ── */

export function RepeatList({ items, onAdd, onRemove, onMove, children, addLabel, empty }) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-[hsl(var(--border))] px-4 py-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
          {empty || 'কোনো আইটেম নেই'}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              <GripVertical className="size-3.5" />
              #{i + 1}
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => onMove(i, -1)}
                className="rounded-lg px-2 py-1 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => onMove(i, 1)}
                className="rounded-lg px-2 py-1 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-30"
              >
                ↓
              </button>
              <RemoveButton onClick={() => onRemove(i)} />
            </div>
          </div>
          {children(item, i)}
        </div>
      ))}
      <AddButton onClick={onAdd}>{addLabel || 'Add item'}</AddButton>
    </div>
  );
}

/**
 * Editable options list with a radio marking the correct answer.
 * props: options (string[]), answer (int), onChange(options, answer)
 */
export function OptionsEditor({ options, answer, onChange }) {
  const setOption = (i, val) => {
    const next = [...options];
    next[i] = val;
    onChange(next, answer);
  };

  const addOption = () => onChange([...options, ''], answer);
  const removeOption = (i) => {
    const next = options.filter((_, idx) => idx !== i);
    const newAnswer = answer > i ? answer - 1 : answer === i ? 0 : answer;
    onChange(next, newAnswer);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            checked={answer === i}
            onChange={() => onChange(options, i)}
            className="size-4 shrink-0 accent-[hsl(var(--primary))]"
            title="সঠিক উত্তর"
          />
          <Input
            value={opt}
            onChange={(e) => setOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="flex-1"
          />
          {options.length > 2 && (
            <RemoveButton onClick={() => removeOption(i)} title="Remove option" />
          )}
        </div>
      ))}
      <AddButton small onClick={addOption}>
        Add option
      </AddButton>
    </div>
  );
}
