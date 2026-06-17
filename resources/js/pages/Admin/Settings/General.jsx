import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Image } from 'lucide-react';

import AdminShell from '../../../layouts/AdminShell';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import MediaPicker from '../../../components/MediaPicker';

export default function AdminSettingsGeneral({ settings, packs, postTypes, pages, articles }) {
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [faviconMediaPickerOpen, setFaviconMediaPickerOpen] = React.useState(false);
  const [selectedLogoPath, setSelectedLogoPath] = React.useState(null);
  const [selectedFaviconPath, setSelectedFaviconPath] = React.useState(null);

  const form = useForm({
    // Access Control
    guest_mode_enabled: settings?.guest_mode_enabled === 1 || settings?.guest_mode_enabled === true,
    // Theme/Brand
    brandName: settings?.brandName || '',
    logo: null,
    logo_path: null,
    favicon: null,
    favicon_path: null,
    // SEO
    seo_title: settings?.seo_title || '',
    seo_description: settings?.seo_description || '',
    // Pagination
    pagination_articles: settings?.['pagination.articles'] || '20',
    pagination_users: settings?.['pagination.users'] || '20',
    pagination_subscriptions: settings?.['pagination.subscriptions'] || '50',
    pagination_media: settings?.['pagination.media'] || '24',
    // Article View Mode
    article_view_mode: settings?.['article.view_mode'] || 'infinite',
    // Home Page Type
    home_page_type: settings?.home_page_type || 'feed',

    // App download / subscription info
    app_charge_text: settings?.app_download_charge_text || 'Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.',
    app_features: Array.isArray(settings?.app_download_features) ? (settings.app_download_features || []).join('\n') : (settings?.app_download_features || ''),
  });

  const shared = usePage().props.settings || {};
  const effectiveHex = shared?.theme?.effectivePrimaryHex || '#3b82f6';

  function handleMediaSelect(file) {
    const preview = file.url || `/storage/${file.path}`;
    setSelectedLogoPath(preview);
    form.setData('logo_path', file.url || file.path);
    form.setData('logo', null);
  }

  function handleFaviconMediaSelect(file) {
    const preview = file.url || `/storage/${file.path}`;
    setSelectedFaviconPath(preview);
    form.setData('favicon_path', file.url || file.path);
    form.setData('favicon', null);
  }

  function submit(e) {
    e.preventDefault();
    form.post('/admin/settings/general', {
      forceFormData: true,
    });
  }

  return (
    <AdminShell title="Settings">
      <Head title="General Settings" />

      <div className="grid gap-4">

        <div>
          <form onSubmit={submit} className="space-y-4">
            {/* Access Control */}
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Access Control</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Control how users can access the application
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-4">
                  <input
                    id="guest_mode"
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--primary))]"
                    checked={form.data.guest_mode_enabled}
                    onChange={(e) => form.setData('guest_mode_enabled', e.target.checked)}
                  />
                  <div className="flex-1">
                    <label htmlFor="guest_mode" className="block text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer">
                      Enable Guest Mode
                    </label>
                    <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                      Allow users to browse content without logging in or subscribing. 
                      Guest users will have limited access to features.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Branding</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Customize your app's brand appearance
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Brand name</label>
                  <Input value={form.data.brandName} onChange={(e) => form.setData('brandName', e.target.value)} />
                  {form.errors.brandName && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.brandName}</div>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Logo</label>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMediaPickerOpen(true)}
                        className="w-full"
                      >
                        <Image className="mr-2 size-4" />
                        Choose from Media
                      </Button>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">Or upload:</div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          form.setData('logo', e.target.files?.[0] || null);
                          setSelectedLogoPath(null);
                          form.setData('logo_path', null);
                        }}
                      />
                    </div>
                    {form.errors.logo && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.logo}</div>}
                    <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      Current: {selectedLogoPath || settings?.logoPath || 'None'}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Favicon (Site Icon)</label>
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFaviconMediaPickerOpen(true)}
                        className="w-full"
                      >
                        <Image className="mr-2 size-4" />
                        Choose from Media
                      </Button>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">Or upload:</div>
                      <Input
                        type="file"
                        accept="image/*,.ico"
                        onChange={(e) => {
                          form.setData('favicon', e.target.files?.[0] || null);
                          setSelectedFaviconPath(null);
                          form.setData('favicon_path', null);
                        }}
                      />
                    </div>
                    {form.errors.favicon && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.favicon}</div>}
                    <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      Current: {selectedFaviconPath || settings?.faviconPath || 'Uses logo'}
                    </div>
                  </div>
                </div>

                <MediaPicker
                  open={mediaPickerOpen}
                  onClose={() => setMediaPickerOpen(false)}
                  onSelect={handleMediaSelect}
                  accept="image"
                  title="Select Logo"
                />

                <MediaPicker
                  open={faviconMediaPickerOpen}
                  onClose={() => setFaviconMediaPickerOpen(false)}
                  onSelect={handleFaviconMediaSelect}
                  accept="image"
                  title="Select Favicon"
                />

                {/* Preview */}
                <div className="rounded-2xl bg-[hsl(var(--muted))] p-4 ring-1 ring-[hsl(var(--border))]">
                  <div className="text-sm font-semibold">Preview</div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      {selectedLogoPath ? (
                        <img
                          src={selectedLogoPath}
                          alt="logo"
                          className="size-12 rounded-2xl object-cover ring-1 ring-[hsl(var(--border))]"
                        />
                      ) : settings?.logoUrl ? (
                        <img
                          src={settings.logoUrl}
                          alt="logo"
                          className="size-12 rounded-2xl object-cover ring-1 ring-[hsl(var(--border))]"
                        />
                      ) : null}
                      <div>
                        <div className="text-base font-semibold">{form.data.brandName}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Primary: {effectiveHex}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedFaviconPath ? (
                        <img
                          src={selectedFaviconPath}
                          alt="favicon"
                          className="size-8 rounded object-cover ring-1 ring-[hsl(var(--border))]"
                        />
                      ) : settings?.faviconUrl ? (
                        <img
                          src={settings.faviconUrl}
                          alt="favicon"
                          className="size-8 rounded object-cover ring-1 ring-[hsl(var(--border))]"
                        />
                      ) : null}
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">Favicon preview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">SEO / App Meta</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Controls meta title and description tags
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Meta title</label>
                  <Input value={form.data.seo_title} onChange={(e) => form.setData('seo_title', e.target.value)} />
                  {form.errors.seo_title && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.seo_title}</div>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Meta description</label>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    value={form.data.seo_description}
                    onChange={(e) => form.setData('seo_description', e.target.value)}
                  />
                  {form.errors.seo_description && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.seo_description}</div>}
                </div>
              </div>
            </div>

            {/* Home Page / Feed Type */}
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Home Page / Feed</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Choose what the home page (<code>/</code>) displays
              </div>

              <div className="mt-5 space-y-4">
                {/* Mode selector */}
                {(() => {
                  const raw = form.data.home_page_type || 'feed';
                  const mode = raw.startsWith('page:') ? 'page'
                    : raw.startsWith('article:') ? 'article'
                    : raw === 'feed' ? 'feed'
                    : 'post_type';

                  function setMode(newMode) {
                    if (newMode === 'feed') return form.setData('home_page_type', 'feed');
                    if (newMode === 'post_type') return form.setData('home_page_type', (postTypes || [])[0]?.slug || 'feed');
                    if (newMode === 'page') return form.setData('home_page_type', (pages || [])[0] ? `page:${(pages || [])[0].slug}` : 'feed');
                    if (newMode === 'article') return form.setData('home_page_type', (articles || [])[0] ? `article:${(articles || [])[0].slug}` : 'feed');
                  }

                  return (
                    <>
                      <div>
                        <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Home page mode</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {[
                            { id: 'feed',      label: '📰 News Feed',      desc: 'Default article feed' },
                            { id: 'post_type', label: '🗂️ Post Type Feed', desc: 'Feed filtered by type' },
                            { id: 'page',      label: '📄 Static Page',    desc: 'Display a page' },
                            { id: 'article',   label: '📝 Single Article', desc: 'Display one article' },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setMode(opt.id)}
                              className={
                                'rounded-2xl border p-3 text-left text-xs transition-colors ' +
                                (mode === opt.id
                                  ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))]'
                                  : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]')
                              }
                            >
                              <div className="font-semibold">{opt.label}</div>
                              <div className="mt-0.5 text-[hsl(var(--muted-foreground))]">{opt.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sub-selector shown based on mode */}
                      {mode === 'post_type' && (
                        <div>
                          <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Select Post Type</label>
                          <select
                            value={raw}
                            onChange={(e) => form.setData('home_page_type', e.target.value)}
                            className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                          >
                            {(postTypes || []).map((pt) => (
                              <option key={pt.id} value={pt.slug}>{pt.name} — /{pt.slug}</option>
                            ))}
                          </select>
                          {!(postTypes || []).length && (
                            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">No active post types found. Create one under Content Types.</p>
                          )}
                        </div>
                      )}

                      {mode === 'page' && (
                        <div>
                          <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Select Page</label>
                          <select
                            value={raw.startsWith('page:') ? raw.slice(5) : ''}
                            onChange={(e) => form.setData('home_page_type', `page:${e.target.value}`)}
                            className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                          >
                            <option value="">— Select a page —</option>
                            {(pages || []).map((p) => (
                              <option key={p.id} value={p.slug}>{p.title} (/{p.slug})</option>
                            ))}
                          </select>
                          <div className="mt-3">
                            <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Or enter a custom URL</label>
                            <Input
                              placeholder="/custom-path or page-slug"
                              value={raw.startsWith('page:') ? raw.slice(5) : ''}
                              onChange={(e) => form.setData('home_page_type', `page:${e.target.value}`)}
                              className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                            />
                            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Enter a full path (leading slash allowed) or a page slug. This overrides the select above when non-empty.</p>
                          </div>
                          {!(pages || []).length && (
                            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">No published pages found. Create one under Pages.</p>
                          )}
                        </div>
                      )}

                      {mode === 'article' && (
                        <div>
                          <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Select Article</label>
                          <select
                            value={raw.startsWith('article:') ? raw.slice(8) : ''}
                            onChange={(e) => form.setData('home_page_type', `article:${e.target.value}`)}
                            className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                          >
                            <option value="">— Select an article —</option>
                            {(articles || []).map((a) => (
                              <option key={a.id} value={a.slug}>{a.title}</option>
                            ))}
                          </select>
                          {!(articles || []).length && (
                            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">No published articles found.</p>
                          )}
                        </div>
                      )}

                      {form.errors.home_page_type && (
                        <div className="text-xs text-[hsl(var(--destructive))]">{form.errors.home_page_type}</div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Article View Settings */}
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Article Reading Experience</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Control default article loading behavior for users
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Default View Mode</label>
                  <select
                    value={form.data.article_view_mode}
                    onChange={(e) => form.setData('article_view_mode', e.target.value)}
                    className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                  >
                    <option value="infinite">Infinite Scroll - Auto-load articles as user scrolls</option>
                    <option value="single">Single Article - Show one article with suggestions only</option>
                    <option value="loadmore">Load More Button - Manual click to load next article</option>
                    <option value="navigation">Next/Previous Navigation - Use navigation buttons</option>
                  </select>
                  {form.errors.article_view_mode && (
                    <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.article_view_mode}</div>
                  )}
                  <div className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                    This sets the article view mode for all users. Users cannot change this setting.
                  </div>
                </div>

                  {/* App Download Info */}
                  <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
                    <div className="text-lg font-semibold">App Download / Subscription Info</div>
                    <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                      Text displayed on public login and app download pages; and app feature list.
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Charge text</label>
                        <Input value={form.data.app_charge_text} onChange={(e) => form.setData('app_charge_text', e.target.value)} />
                        {form.errors.app_charge_text && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.app_charge_text}</div>}
                        <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">This short line appears on login and app download pages.</div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">App features (one per line)</label>
                        <textarea
                          className="min-h-24 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                          value={form.data.app_features}
                          onChange={(e) => form.setData('app_features', e.target.value)}
                        />
                        {form.errors.app_features && <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.app_features}</div>}
                        <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Enter each feature on a new line; will appear on the app download page.</div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            {/* Pagination Settings */}
            <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
              <div className="text-lg font-semibold">Pagination</div>
              <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Set default items per page for admin lists
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Articles per page</label>
                  <Input 
                    type="number" 
                    min="5" 
                    max="100" 
                    value={form.data.pagination_articles} 
                    onChange={(e) => form.setData('pagination_articles', e.target.value)} 
                  />
                  {form.errors.pagination_articles && (
                    <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.pagination_articles}</div>
                  )}
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Default: 20</div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Users per page</label>
                  <Input 
                    type="number" 
                    min="5" 
                    max="100" 
                    value={form.data.pagination_users} 
                    onChange={(e) => form.setData('pagination_users', e.target.value)} 
                  />
                  {form.errors.pagination_users && (
                    <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.pagination_users}</div>
                  )}
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Default: 20</div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Subscriptions per page</label>
                  <Input 
                    type="number" 
                    min="10" 
                    max="200" 
                    value={form.data.pagination_subscriptions} 
                    onChange={(e) => form.setData('pagination_subscriptions', e.target.value)} 
                  />
                  {form.errors.pagination_subscriptions && (
                    <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.pagination_subscriptions}</div>
                  )}
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Default: 50</div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[hsl(var(--muted-foreground))]">Media files per page</label>
                  <Input 
                    type="number" 
                    min="12" 
                    max="100" 
                    value={form.data.pagination_media} 
                    onChange={(e) => form.setData('pagination_media', e.target.value)} 
                  />
                  {form.errors.pagination_media && (
                    <div className="mt-1 text-xs text-[hsl(var(--destructive))]">{form.errors.pagination_media}</div>
                  )}
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Default: 24</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Saving...' : 'Save Settings'}
              </Button>
              {form.recentlySuccessful && (
                <span className="text-sm text-[hsl(var(--primary))]">Saved!</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
