import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Image } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import TinyMCEEditor from '../../../components/TinyMCEEditor';
import MediaPicker from '../../../components/MediaPicker';


// Using shared `BlocksEditor` component (extracted to components)

export default function AdminArticlesEdit({ mode, article, categories, users, postTypes }) {
  const editorRef = React.useRef(null);
  const [featuredPreviewUrl, setFeaturedPreviewUrl] = React.useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [selectedMediaPath, setSelectedMediaPath] = React.useState(article?.featured_image_path || null);
  const [selectedMediaUrl, setSelectedMediaUrl] = React.useState(article?.featured_image_url || null);
  const [mediaPickerOpenBody, setMediaPickerOpenBody] = React.useState(false);

  const form = useForm({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    category_id: article?.category_id ?? '',
    post_type_id: article?.post_type_id ?? '',
    is_breaking: !!article?.is_breaking,
    visibility: article?.visibility || 'public',
    featured_image: null,
    featured_image_path: article?.featured_image_path || null,
    remove_featured_image: false,
    body: article?.body || '',
    body_blocks: null,
    published_at: article?.published_at ? String(article.published_at).slice(0, 16) : '',
    publish_by: article?.publish_by ?? '',
  });

  React.useEffect(() => {
    if (!form.data.featured_image) {
      setFeaturedPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.data.featured_image);
    setFeaturedPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.data.featured_image]);

  function handleMediaSelect(file) {
    // Use the full URL instead of just the path
    const fullUrl = file.url || `/storage/${file.path}`;
    setSelectedMediaPath(fullUrl);
    setSelectedMediaUrl(fullUrl);
    form.setData('featured_image_path', fullUrl);
    form.setData('featured_image', null);
    form.setData('remove_featured_image', false);
    setFeaturedPreviewUrl(null);
  }

  function handleMediaSelectForBody(file) {
    const fullUrl = file.url || `/storage/${file.path}`;
    // insert into TinyMCE editor
    try {
      editorRef.current?.insertImage(fullUrl);
      const content = editorRef.current?.getContent?.() || '';
      form.setData('body', content);
    } catch (e) {
      // ignore
    }
    setMediaPickerOpenBody(false);
  }

  function submit(e) {
    e.preventDefault();
    form.transform((data) => ({
      ...data,
      body_blocks: null,
      // normalize empty strings to null for nullable numeric/date fields
      category_id: data.category_id === '' ? null : data.category_id,
      post_type_id: data.post_type_id === '' ? null : data.post_type_id,
      published_at: data.published_at === '' ? null : data.published_at,
      featured_image_path: data.featured_image_path === '' ? null : data.featured_image_path,
      publish_by: data.publish_by === '' ? null : data.publish_by,
      ...(mode !== 'create' ? { _method: 'put' } : {}),
    }));

    if (mode === 'create') {
      form.post('/admin/articles', { forceFormData: true });
    } else {
      form.post(`/admin/articles/${article.id}`, { forceFormData: true });
    }
  }

  function destroy() {
    if (!article?.id) return;
    if (!confirm('Delete this article?')) return;
    form.delete(`/admin/articles/${article.id}`);
  }

  return (
    <AdminShell title={mode === 'create' ? 'New Article' : 'Edit Article'}>
      <Head title={mode === 'create' ? 'New Article' : 'Edit Article'} />

      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Title</label>
              <Input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
              {form.errors.title ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.title}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Slug</label>
              <Input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
              {form.errors.slug ? (
                <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.slug}</div>
              ) : (
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Public URL: /articles/{form.data.slug || 'your-slug'}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Featured image</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMediaPickerOpen(true)}
                    className="flex-1"
                  >
                    <Image className="mr-2 size-4" />
                    Choose from Media
                  </Button>
                </div>

                {form.errors.featured_image ? (
                  <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.featured_image}</div>
                ) : null}

                {(article?.featured_image_url || selectedMediaPath) && !featuredPreviewUrl ? (
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <input
                        type="checkbox"
                        checked={!!form.data.remove_featured_image}
                        onChange={(e) => {
                          form.setData('remove_featured_image', e.target.checked);
                          if (e.target.checked) {
                            setSelectedMediaPath(null);
                            setSelectedMediaUrl(null);
                            form.setData('featured_image_path', null);
                          }
                        }}
                      />
                      Remove current image
                    </label>
                  </div>
                ) : null}
              </div>

              <div className="overflow-hidden rounded-2xl bg-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))]">
                {featuredPreviewUrl ? (
                  <img
                    src={featuredPreviewUrl}
                    alt={form.data.title || 'Featured image'}
                    className="h-40 w-full object-cover"
                  />
                ) : selectedMediaUrl ? (
                  <img
                    src={selectedMediaUrl}
                    alt={form.data.title || 'Featured image'}
                    className="h-40 w-full object-cover"
                  />
                ) : article?.featured_image_url && !form.data.remove_featured_image ? (
                  <img
                    src={article.featured_image_url}
                    alt={form.data.title || 'Featured image'}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">No image</div>
                )}
              </div>
            </div>
          </div>

          <MediaPicker
            open={mediaPickerOpen}
            onClose={() => setMediaPickerOpen(false)}
            onSelect={handleMediaSelect}
            accept="image"
            title="Select Featured Image"
            initialSelectedPath={selectedMediaPath || form.data.featured_image_path}
          />

          <div className="mt-4">
            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Excerpt</label>
            <textarea
              className="min-h-20 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              value={form.data.excerpt}
              onChange={(e) => form.setData('excerpt', e.target.value)}
            />
            {form.errors.excerpt ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.excerpt}</div> : null}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Post Type</label>
              <select
                value={String(form.data.post_type_id ?? '')}
                onChange={(e) => form.setData('post_type_id', e.target.value)}
                className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
              >
                <option value="">— None —</option>
                {(Array.isArray(postTypes) ? postTypes : []).map((pt) => (
                  <option key={pt.id} value={String(pt.id)}>
                    {pt.icon ? `${pt.icon} ` : ''}{pt.name}
                  </option>
                ))}
              </select>
              {form.errors.post_type_id ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.post_type_id}</div> : null}
            </div>

            <div className="sm:col-span-1">
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Category</label>
              <select
                value={String(form.data.category_id ?? '')}
                onChange={(e) => form.setData('category_id', e.target.value)}
                className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
              >
                <option value="">— None —</option>
                {(Array.isArray(categories) ? categories : []).map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                    {c.is_active === false ? ' (inactive)' : ''}
                  </option>
                ))}
              </select>
              {form.errors.category_id ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.category_id}</div> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Visibility</label>
              <select
                value={form.data.visibility}
                onChange={(e) => form.setData('visibility', e.target.value)}
                className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
              >
                <option value="public">🌐 Public</option>
                <option value="private">🔒 Private</option>
                <option value="premium">⭐ Premium</option>
                <option value="draft">📝 Draft</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-9">
              <input
                type="checkbox"
                checked={!!form.data.is_breaking}
                onChange={(e) => form.setData('is_breaking', e.target.checked)}
              />
              <div className="text-sm">Breaking</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-sm text-[hsl(var(--muted-foreground))]">Body</label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setMediaPickerOpenBody(true)}>
                  <Image className="mr-2 size-4" />
                  Choose from Media
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <TinyMCEEditor
                ref={editorRef}
                value={form.data.body}
                onChange={(content) => form.setData('body', content)}
                height={400}
              />
            </div>

            <MediaPicker
              open={mediaPickerOpenBody}
              onClose={() => setMediaPickerOpenBody(false)}
              onSelect={handleMediaSelectForBody}
              accept="image"
              title="Insert Image"
            />

            {form.errors.body ? <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.body}</div> : null}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="col-6">
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Published at</label>
              <Input
                type="datetime-local"
                value={form.data.published_at}
                onChange={(e) => form.setData('published_at', e.target.value)}
              />
              {form.errors.published_at ? (
                <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.published_at}</div>
              ) : null}
            </div>
            <div className="col-6">
              <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Publish By</label>
              <select
                value={form.data.publish_by || ''}
                onChange={(e) => form.setData('publish_by', e.target.value)}
                className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
              >
                <option value="">— No one —</option>
                {(Array.isArray(users) ? users : []).map((u) => (
                  <option key={u.id} value={String(u.id)}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {form.errors.publish_by ? (
                <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.publish_by}</div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button disabled={form.processing}>{form.processing ? 'Saving…' : 'Save'}</Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/articles">Back</Link>
            </Button>
            {mode !== 'create' ? (
              <Button variant="destructive" type="button" onClick={destroy}>
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
